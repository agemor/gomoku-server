import http from 'http';
import io from 'socket.io';
import jwt from 'jsonwebtoken';
import OmokGame from './OmokGame.js';

var port = 5555;

//  Secret key for jwt
const SECRET_KEY = "shhhhhh";

//  Create simple http server
var server = http.createServer();
server.listen(port);

//  Attach socket.io to server
var socket = io.listen(server);

var lobbyUsers = [];
var gameMap = new Map();

socket.on('connection', function(client){ 
    console.log('SOCKET::Connection to client <%s> established', client.id);
    let userAdded = false;

    //  lobby handlers
    client.on('find opponent', function(data, callback) {
        if (userAdded == false) {
            if (lobbyUsers.length !== 0) {

                client.emit("found match", {success:true, message: "found match"});

                // take first user out of queue
                let opponentId = lobbyUsers.shift(); 
                console.log("Matching user <%s> with user <%s>...", client.id, opponentId);

                //  create room
                let roomId;
                do {
                    roomId = Math.random().toString(36).substr(2,10);
                } while (gameMap.has(roomId));

                gameMap.set(roomId,new OmokGame(15));

                //  create token
                let roomToken = jwt.sign({roomId: roomId}, SECRET_KEY);

                //  emit roomId and token to players
                socket.to(client.id).to(opponentId).emit('room created', roomToken, roomId);
                
            } else {
                lobbyUsers.push(client.id);
                userAdded = true;
                client.emit("added to queue", {success:true});
                console.log("Added user <%s> to queue!", client.id);
            }
        } else {
            client.emit("user already in queue", {success:false});
        }
    });

    //  game handlers
    //  event: roomId, token
    client.on('join', function() {

        //  Set variable parameters
        let roomToken = arguments[arguments.length - 1];
        let roomId = arguments[arguments.length - 2];

        if (!typeof(roomId)=='string') {
            client.emit("join failed", {message:"invalid arguments"});
        } else if (! gameMap.has(roomId)) {
            client.emit("join failed", {message:"invalid room id"});
        } else {
            if (roomToken) {
                jwt.verify(roomToken, SECRET_KEY, function(err, decoded) {
                    if (!decoded) {
                        console.log(err);
                        client.emit("join failed", {message:"invalid token"});
                    } else if (decoded.roomId !== roomId) {
                        client.emit("join failed", {message:"token does not match room"});
                    } else {
                        let omokGame = gameMap.get(roomId);
                        omokGame.playerIds.push(client.id);
                        client.join(roomId);
                        if (omokGame.playerIds.length == 1) {
                            client.emit("waiting for other player");
                        }
                        else if (omokGame.playerIds.length == 2) {
                            client.emit("game joined as player");
                            console.log("Game <%s> started.", roomId);
                            let stoneColor1 = Math.floor(Math.random() *2) == 0 ? "black"  : "white";
                            let stoneColor2 = stoneColor1 == "black" ? "white" : "black";
                            let gameToken1 = jwt.sign({roomId: roomId, stoneColor:stoneColor1}, SECRET_KEY);
                            let gameToken2 = jwt.sign({roomId: roomId, stoneColor:stoneColor2}, SECRET_KEY);
                            socket.to(omokGame.playerIds[0]).emit('game ready', {gameToken: gameToken1, stoneColor: stoneColor1});
                            socket.to(omokGame.playerIds[1]).emit('game ready', {gameToken: gameToken2, stoneColor: stoneColor2});
                        } else {
                            client.emit("join failed", {message:"invalid number of users"});
                        }
                    }
                });
            } else {
                let omokGame = gameMap.get(roomId);
                client.join(roomId);
                client.emit("game joined as observer", {board:omokGame.board});
            }
        }
    });

    //  event: move, roomId, token
    client.on('play move', function(gameToken, roomId, move) {
        console.log("Playing move..");

        if (!( typeof(gameToken)=='string' && typeof(roomId)=='string' && typeof(move)=='string')) {
            client.emit("play move failed", {message:"invalid arguments"});
        } else if (! gameMap.has(roomId)) {
            client.emit("play move failed", {message:"invalid room id"});
        } else {
            jwt.verify(gameToken, SECRET_KEY, function(err, decoded) {
                if (!decoded) {
                    console.log(err);
                    client.emit("play move failed", {message:"invalid token"});
                } else if (decoded.roomId !== roomId) {
                    client.emit("play move failed", {message:"token does not match room"});
                } else {
                    let omokGame = gameMap.get(roomId);
                    if (omokGame.currentTurn != decoded.stoneColor) {
                        client.emit("play move failed", {message:"opponent's turn"});
                    } else {
                        try {
                            omokGame.placeStone(move, decoded.stoneColor);
                            let gameEnded = false;
                            if (omokGame.victory == decoded.stoneColor) {
                                gameEnded = true;
                            }
                            socket.in(roomId).emit('stone placed', {stoneColor: decoded.stoneColor, move: move, gameEnd: gameEnded});
                        }
                        catch (err) {
                            console.log(err);
                            client.emit("play move failed", {message:"invalid move"});
                        }
                    }
                }
            });
        }
    });

    client.on('disconnect',function(){
        //  Remove user from lobby
        var index = lobbyUsers.indexOf(client.id);
        if (index > -1) {
            lobbyUsers.splice(index, 1);
        }
        console.log('SOCKET::Server has disconnected');
    });
});

console.log('Server running at http://127.0.0.1:' + port + '/');
