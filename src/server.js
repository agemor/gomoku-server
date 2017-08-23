import http from 'http';
import io from 'socket.io';
import OmokGame from './OmokGame';
import OmokPlayer from './OmokPlayer';
import OmokRoom from './OmokRoom';
import OmokPlayerList from './OmokPlayerList';
import OmokRoomList from './OmokRoomList';

var port = 5555;

// 서버 생성
var server = http.createServer();
server.listen(port);

var socket = io.listen(server);

// 유저 목록
var players = new OmokPlayerList();

// 방 목록
var rooms = new OmokRoomList();

// 유저 대기 큐
var waitingQueue = [];

console.log('Server running at http://127.0.0.1:' + port + '/');

socket.on("connection", function(client){ 

    // 새 유저 접속
    console.log('Connection to client <%s> established', client.id);

    /**
     * 새로운 유저 등록
     */
    client.on("login", function(nickname) {

        if (!typeof(nickname) == "string") {
            client.emit("cannot login", {message: "Invalid nickname"});
            return;
        }

        let player = players.register(nickname, client.id);

        // 인증 정보 전송
        client.emit("login success", player.id, player.key);
        console.log('User <%s> loggined', player.nickname);
    });


    /**
     * 새 게임 찾기
     */
    client.on("find match", function(playerId, playerKey) {

        // 플레이어 인증
        if (!players.authenticate(playerId, playerKey)) {
            client.emit("cannot find match", {message: "User authentication failed"});
            return;
        }

        let player = players.getById(playerId);

        // 접속 상황 관리
        if (player.isConnected()) {
            if (player.socketId != client.id) {
                client.emit("cannot find match", {message: "Duplicated access is not allowed"});
                return;
            }
        } else {
            player.socketId = client.id;
        }

        if (waitingQueue.indexOf(player) >= 0) {

            // 대기 큐에 사람이 있을 경우
            if (waitingQueue.length > 0) {

                // 대기 큐에서 상대방 선택
                let opponent = waitingQueue.shift(); 

                // 방 생성
                let room = rooms.create();

                // 생성된 방 정보 전송
                socket.to(player.socketId).to(opponent.socketId).emit("match found", room.id, room.key);
                console.log("Matching user <%s> with user <%s>...", opponent.nickname, player.nickname);
            }
                
            // 아직 대기 중인 사람이 없을 경우
            else {

                // 게임 대기 큐에 추가
                waitingQueue.push(player);

                client.emit("server message", "Added to waiting queue");
                console.log("Added user <%s> to waiting queue!", player.nickname);
            }
        }
            
        // 이미 큐에 등록되어 있을 경우
        else {
            client.emit("cannot find match", {message: "User already in waiting queue"});
        }
    });


    /**
     * 게임 방 입장하기
     */
    client.on("join room", function(roomId, roomKey, playerId, playerKey) {

        // 플레이어 인증
        if (!players.authenticate(playerId, playerKey)) {
            client.emit("cannot join room", {message: "User authentication failed"});
            return;
        }

        // 기존 것과 연결 끊어졌는지 체크 후 소켓 id 갱신

        // 방 인증
        if (!rooms.authenticate(roomId, roomKey)) {
            client.emit("cannot join room", {message: "Room authentication failed"});
            return;
        }
        
        let player = players.getById(playerId);
        let room = rooms.getById(roomId);
        
        // 신규 접속
        if (room.players.indexOf(player) < 0) {

            // 초과 접속 시도
            if (room.players.length >= 2) {
                client.emit("cannot join room", {message: "Exceeded maximum number of players"});
            }
            
            else {

                room.players.push(player);
                player.playingRoom = room;

                // 모든 플레이어가 접속한 경우
                if (room.players.length == 2) {

                    let stoneColor = (n) => room.playerStoneColors[n];

                    socket.to(room.players[0].socketId).emit('room joined', {stoneColor: stoneColor(0), turn: stoneColor(0) == OmokStone.BLACK});
                    socket.to(room.players[1].socketId).emit('room joined', {stoneColor: stoneColor(1), turn: stoneColor(1) == OmokStone.BLACK});
                    console.log("Game <%s> started.", roomId);
                }
            }
        }

        // 재접속
        else {
            
            // 기존 게임 데이터 전송
            let stoneColor = room.playerStoneColors[room.players.indexOf(player)];
            let isMyTurn = room.game.currentTurn == stoneColor;

            socket.to(player.socketId).emit('room joined', {stoneColor: stoneColor, board:room.game.board, turn: isMyTurn});
            console.log("Game <%s> resumed.", roomId);
        }
    });


    /**
     * 게임 방 입장하기
     */
    client.on("observe room", function(roomId) {
        
        if (!rooms.exists(roomId)) {
            client.emit("cannot observe room", {message: "Room does not exist"});
            return;
        }

        let room = rooms.getById(roomId);

        room.observers.push(client.id);

        // 기존 게임 데이터 전송
        socket.to(player.socketId).emit('room observed', {
            players: [room.players[0].nickname, room.players[1].nickname], 
            stoneColors: room.playerStoneColors,
            turn: room.game.currentTurn,
            board: room.game.board
        });
    });


    /**
     * 랜덤한 방 얻기
     */
    client.on('get random room', function() {
        client.emit("random room", rooms.pickRandomId());
    });


    /**
     * 돌 놓기
     */
    client.on('place stone', function(roomId, roomKey, playerId, playerKey, coord) {

        // 플레이어 인증
        if (!players.authenticate(playerId, playerKey)) {
            client.emit("cannot place stone", {message: "User authentication failed"});
            return;
        }

        // 방 인증
        if (!rooms.authenticate(roomId, roomKey)) {
            client.emit("cannot place stone", {message: "Room authentication failed"});
            return;
        }

        let player = players.getById(playerId);
        let room = rooms.getById(roomId);
        
        if (room.players.indexOf(player) < 0) {
            client.emit("cannot place stone", {message: "Wrong match"});
            return;
        }

        // 게임이 끝났을 경우
        if (room.game.isGameEnd()) {
            client.emit("cannot place stone", {message: "Game over"});
        }

        let playerStoneColor = room.playerStoneColors[room.players.indexOf(player)];

        if (room.game.currentTurn == playerStoneColor) {

            try {
                
                // 돌 놓기
                room.game.placeStone(coord, playerStoneColor);

                room.broadcast(socket, 'stone placed', {
                    stoneColor: playerStoneColor,
                    coord: coord
                });

                // 게임이 끝났다면
                if (room.game.isGameEnd()) {

                    room.broadcast(socket, 'game over', {win: playerStoneColor});

                    // 방 삭제
                    rooms.remove(room.id);
                    return;
                }

                // 타임아웃 설정 (1분)
                setTimeout(function(room, player) {

                    if (!room.game.isGameEnd()) {

                        let stoneColor = room.playerStoneColors[room.players.indexOf(player)];

                        room.broadcast(socket, 'game over', {win: stoneColor});
                
                        // 방 삭제
                        rooms.remove(room.id);
                    }

                }, 60 * 1000, room, player);

            } catch (error) {
                client.emit("cannot place stone", {message: "Invalid stone coordinate"});
            }
        }
        
        // 자신의 차례가 아닐 경우
        else {
            client.emit("cannot place stone", {message: "Opponent's turn"});
        }
    });


    /**
     * 클라이언트와의 연결이 끊겼을 경우
     */
    client.on('disconnect', function() {

        let player = players.getBySocketId(client.id);
        let room = player.playingRoom;

        // 접속 정보 말소
        player.socketId = "";

        // 접속 절차를 밟지 않은 유저일 경우
        if (player == null) {
            return;
        }

        // 대기 큐애서 삭제
        var index = waitingQueue.indexOf(player);
        if (index > -1) {
            waitingQueue.splice(index, 1);
        }

        // 현재 게임 중이라면, 방에 통보
        if (room != null) {

            room.broadcast(socket, 'player disconnected', player.nickname);

            // 게임 종료 타이머 시작
            setTimeout(function(room, player) {

                if (!player.isConnected()) {

                    let stoneColor = room.playerStoneColors[room.players.indexOf(player)];

                    room.broadcast(socket, 'game over', {win: stoneColor == OmokStone.BLACK ? OmokStone.WHITE : OmokStone.BLACK});
               
                    // 방 삭제
                    rooms.remove(room.id);
                }

            }, 15 * 1000, room, player);
        }

        console.log('Player <%s> has left', player.nickname);
    });
});