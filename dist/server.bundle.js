/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class OmokStone {}
/* harmony export (immutable) */ __webpack_exports__["a"] = OmokStone;


OmokStone.BLACK = "black";
OmokStone.WHITE = "white";

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class OmokPlayer {

    constructor(id, nickname, socketId) {

        this.id = id;
        this.key = this._generateKey();
        this.nickname = nickname;
        this.socketId = socketId;

        this.playingRoom = null;
    }

    isConnected() {
        return this.socketId != "";
    }

    _generateKey() {
        return Math.random().toString(36).substr(2, 10);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OmokPlayer;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OmokPlayer__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__OmokAlgorithm_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OmokStone__ = __webpack_require__(0);




class OmokGame {

    constructor(boardSize) {

        this.algorithm = new __WEBPACK_IMPORTED_MODULE_1__OmokAlgorithm_js__["a" /* default */]();
        this.board = { placement: [], boardSize: boardSize };
        this.victory = "";
        this.players = [];
        this.currentTurn = __WEBPACK_IMPORTED_MODULE_2__OmokStone__["a" /* default */].BLACK;
    }

    placeStone(coord, stoneColor) {

        let x = this.fromStringCoordinate(coord).x;
        let y = this.fromStringCoordinate(coord).y;

        if (this.board.placement[y * this.board.boardSize + x] != null) {
            throw Error("Invalid placement");
        }

        if (this.algorithm.checkValidity(x, y, stoneColor, this.board)) {
            if (this.algorithm.checkVictory(x, y, stoneColor, this.board)) {
                this.victory = stoneColor;
            }
            this.board.placement[y * this.board.boardSize + x] = stoneColor == __WEBPACK_IMPORTED_MODULE_2__OmokStone__["a" /* default */].BLACK ? 1 : 2;
            this.currentTurn = this.currentTurn == __WEBPACK_IMPORTED_MODULE_2__OmokStone__["a" /* default */].BLACK ? __WEBPACK_IMPORTED_MODULE_2__OmokStone__["a" /* default */].WHITE : __WEBPACK_IMPORTED_MODULE_2__OmokStone__["a" /* default */].BLACK;
        } else {
            throw Error("Invalid placement");
        }
    }

    isGameEnd() {
        return this.victory != "";
    }

    fromStringCoordinate(coord) {
        return { x: coord.charCodeAt(0) - 97, y: Number(coord.slice(1)) - 1 };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OmokGame;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__OmokGame__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OmokStone__ = __webpack_require__(0);




class OmokRoom {

    constructor(id) {

        this.id = id;
        this.key = this._generateKey();

        this.game = new __WEBPACK_IMPORTED_MODULE_1__OmokGame__["a" /* default */](19);

        this.players = [];
        this.playerStoneColors = Math.random() > 0.5 ? [__WEBPACK_IMPORTED_MODULE_2__OmokStone__["a" /* default */].BLACK, __WEBPACK_IMPORTED_MODULE_2__OmokStone__["a" /* default */].WHITE] : [__WEBPACK_IMPORTED_MODULE_2__OmokStone__["a" /* default */].WHITE, __WEBPACK_IMPORTED_MODULE_2__OmokStone__["a" /* default */].BLACK];
        this.observers = [];

        this.timer = null;
        this.paused = false;
    }

    close() {

        this.unsetTimer();

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].playingRoom = null;
        }
    }

    broadcast(socket, message, dataObject) {

        let send = target => socket.to(target).emit(message, dataObject);

        // 플레이어에게 
        for (let i = 0; i < this.players.length; i++) {
            send(this.players[i].socketId);
        }

        // 옵저버에게 
        for (let i = 0; i < this.observers.length; i++) {
            send(this.observers[i]);
        }
    }

    setTimer(seconds, callback) {

        this.unsetTimer();

        this.timer = setTimeout(callback, seconds * 1000);
    }

    unsetTimer() {
        if (this.timer != null) {
            clearTimeout(this.timer);
        }
    }

    _generateKey() {
        return Math.random().toString(36).substr(2, 10);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OmokRoom;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OmokPlayer__ = __webpack_require__(1);


class OmokPlayerList {

    constructor() {
        this.playerIdMap = new Map();
        this.playerList = [];
    }

    register(nickname, socketId) {
        let player = new __WEBPACK_IMPORTED_MODULE_0__OmokPlayer__["a" /* default */](this._generateUid(), nickname, socketId);
        this.playerIdMap.set(player.id, player);
        this.playerList.push(player);
        return player;
    }

    remove(playerId) {
        let player = this.getById(playerId);
        this.playerList.splice(this.playerList.indexOf(player), 1);
        this.playerIdMap.delete(player.id);
    }

    authenticate(playerId, playerKey) {
        if (this.playerIdMap.has(playerId)) {
            if (this.playerIdMap.get(playerId).key == playerKey) {
                return true;
            }
        }
        return false;
    }

    getById(playerId) {
        return this.playerIdMap.get(playerId);
    }

    getBySocketId(socketId) {

        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].socketId == socketId) {
                return this.playerList[i];
            }
        }

        return null;
    }

    _generateUid() {
        let uid;
        do {
            uid = Math.random().toString(36).substr(2, 10);
        } while (this.playerIdMap.has(uid));
        return uid;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OmokPlayerList;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OmokRoom__ = __webpack_require__(3);


class OmokRoomList {

    constructor() {
        this.roomIdMap = new Map();
        this.roomList = [];
    }

    create() {
        let room = new __WEBPACK_IMPORTED_MODULE_0__OmokRoom__["a" /* default */](this._generateUid());
        this.roomIdMap.set(room.id, room);
        return room;
    }

    remove(roomId) {

        let room = this.getById(roomId);

        if (room != null) {

            room.close();

            this.roomList.splice(this.roomList.indexOf(room), 1);
            this.roomIdMap.delete(room.id);
        }
    }

    authenticate(roomId, roomKey) {
        if (this.roomIdMap.has(roomId)) {
            if (this.roomIdMap.get(roomId).key == roomKey) {
                return true;
            }
        }
        return false;
    }

    exists(roomId) {
        return this.roomIdMap.has(roomId);
    }

    pickRandomId() {
        let keyList = [];
        for (let key of this.roomIdMap.keys()) {
            keyList.push(key);
        }
        if (keyList.length > 0) {
            return keyList[Math.min(Math.floor(keyList.length * Math.random()), keyList.length)];
        } else {
            return "";
        }
    }

    getById(roomId) {
        return this.roomIdMap.get(roomId);
    }

    _generateUid() {
        let uid;
        do {
            uid = Math.random().toString(36).substr(2, 10);
        } while (this.roomIdMap.has(uid));
        return uid;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OmokRoomList;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OmokStone__ = __webpack_require__(0);


class OmokAlgorithm {
    constructor() {}

    analyze() {}

    /**
     * 돌을 놓는다고 가정했을 때, 이겼는지 검사
     */
    checkVictory(x, y, stoneColor, board) {

        let stoneColorValue = stoneColor == __WEBPACK_IMPORTED_MODULE_0__OmokStone__["a" /* default */].BLACK ? 1 : 2;

        let boardClone = {
            placement: board.placement.slice(0), boardSize: board.boardSize
        };
        boardClone.placement[y * board.boardSize + x] = stoneColorValue;

        // 돌 연산자
        let at = (sx, sy) => boardClone.placement[sy * board.boardSize + sx];
        let inbound = (sx, sy) => sx >= 0 && sy >= 0 && sx < board.boardSize && sy < board.boardSize;

        // 기준 돌
        let criterion = at(x, y);

        // 흩어짐 체크
        let check = function (a, b, c, d) {
            let i = 0,
                j = 0;
            while (at(x + a * i, y + b * i) == criterion && inbound(x + a * i, y + b * i)) {
                i++;
            }
            while (at(x + c * j, y + d * j) == criterion && inbound(x + c * j, y + d * j)) {
                j++;
            }
            return i + j == 6;
        };

        // 가로, 세로, 대각선 검사
        return check(-1, 0, 1, 0) || check(0, -1, 0, 1) || check(-1, -1, 1, 1) || check(1, -1, -1, 1);
    }

    /**
     * 돌을 놓는다고 가정했을 때, 금수인지 검사
     */
    checkValidity(x, y, stoneColor, board) {

        let stoneColorValue = stoneColor == __WEBPACK_IMPORTED_MODULE_0__OmokStone__["a" /* default */].BLACK ? 1 : 2;

        let boardClone = {
            placement: board.placement.slice(0), boardSize: board.boardSize
        };
        boardClone.placement[y * board.boardSize + x] = stoneColorValue;

        // 삼삼 체크
        let notDoubleThree = !this.checkDoubleN(x, y, stoneColorValue, boardClone, 3);

        // 사사 체크
        let notDoubleFour = !this.checkDoubleN(x, y, stoneColorValue, boardClone, 4);

        return notDoubleThree && notDoubleFour;
    }

    /**
     * NN 체크
     */
    checkDoubleN(x, y, stoneColorValue, board, n) {

        // 돌 연산자
        let at = (sx, sy) => board.placement[sy * board.boardSize + sx];
        let inbound = (sx, sy) => sx >= 0 && sy >= 0 && sx < board.boardSize && sy < board.boardSize;

        // 기준 돌
        let criterion = stoneColorValue;
        let opponent = criterion == 1 ? 2 : 1;

        // 한쪽 방향으로 열림성 검사
        let traverse = (a, b) => {
            let i = 0;
            let stuck = true;
            let spaces = [];
            while (true) {
                if (at(x + a * i, y + b * i) == 0) spaces.push([x + a * i, y + b * i]);
                if (!inbound(x + a * (i + 1), y + b * (i + 1))) break;
                if (at(x + a * (i + 1), y + b * (i + 1)) == opponent) break;
                if (at(x + a * (i + 1), y + b * (i + 1)) == 0 && at(x + a * i, y + b * i) == 0) {
                    stuck = false;
                    break;
                }
                i++;
            }
            return { length: i, stuck: stuck, spaces: spaces };
        };

        // 열린 N 검사
        /**
         * 열린4: 양쪽 모두가 막히지 않은 4
         * 열린3: 하나 두면 열린 4가 만들어 지는 것
         *     - 네 칸의 범위에서 같은 색깔 3개가 있어야 함.
         *     - 하나 둬서 4를 만들 수 있어야 함.
         * 쌍삼: 열린 3이 두개 만들어 지는 것
         */

        let checkOpenN = (a, b, c, d) => {

            let p = traverse(a, b);
            let q = traverse(c, d);
            let lsum = p.length + q.length;
            let csum = p.spaces.length + q.spaces.length - 2;

            if (at(x + a * p.length, y + b * p.length) == 0 && at(x + c * q.length, y + d * q.length) == 0) {

                if (lsum == n + 1 && csum == 0) {
                    return this.checkValidity(p.spaces[0][0], p.spaces[0][1], criterion, board) || this.checkValidity(q.spaces[0][0], q.spaces[0][1], criterion, board);
                }
                if (lsum == n + 2 && csum == 1 && !(p.stuck && q.stuck)) {
                    let target = p.spaces.length > 1 ? p.spaces : q.spaces;
                    return this.checkValidity(target[1][0], target[1][1], criterion, board);
                }
                return false;
            } else {
                return false;
            }
        };

        return checkOpenN(-1, 0, 1, 0) + checkOpenN(0, -1, 0, 1) + checkOpenN(-1, -1, 1, 1) + checkOpenN(1, -1, -1, 1) > 1;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = OmokAlgorithm;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_http__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_http___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_http__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_socket_io__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OmokGame__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OmokPlayer__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__OmokRoom__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__OmokStone__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__OmokPlayerList__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__OmokRoomList__ = __webpack_require__(6);









var port = 5555;

// 서버 생성
var server = __WEBPACK_IMPORTED_MODULE_0_http___default.a.createServer();
server.listen(port);

var socket = __WEBPACK_IMPORTED_MODULE_1_socket_io___default.a.listen(server);

// 유저 목록
var players = new __WEBPACK_IMPORTED_MODULE_6__OmokPlayerList__["a" /* default */]();

// 방 목록
var rooms = new __WEBPACK_IMPORTED_MODULE_7__OmokRoomList__["a" /* default */]();
var observingRoom = null;

// 유저 대기 큐
var waitingQueue = [];

// 타임아웃 설정
var PLAY_TIMEOUT = 200;
var RECONNECT_TIMEOUT = 400;

console.log("Server running at http://127.0.0.1:" + port + "/");

socket.on("connection", function (client) {

    // 새 유저 접속
    console.log("Connection to client <%s> established", client.id);

    /**
     * 새로운 유저 등록
     */
    client.on("login", function (nickname) {

        if (!typeof nickname == "string") {
            client.emit("cannot login", { message: "Invalid nickname" });
            return;
        }

        let player = players.register(nickname, client.id);

        // 인증 정보 전송
        client.emit("login success", player.id, player.key);

        console.log("User <%s> loggined", player.nickname);
    });

    /**
     * 새 게임 찾기
     */
    client.on("find match", function (playerId, playerKey) {

        // 플레이어 인증
        if (!players.authenticate(playerId, playerKey)) {
            client.emit("cannot find match", { message: "User authentication failed" });
            return;
        }

        let player = players.getById(playerId);

        // 접속 상황 관리
        if (player.socketId != client.id) {
            player.socketId = client.id;
        }

        if (waitingQueue.indexOf(player) < 0) {

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
                client.emit("cannot find match", { message: "User already in waiting queue" });
            }
    });

    /**
     * 게임 방 입장하기
     */
    client.on("join room", function (roomId, roomKey, playerId, playerKey) {

        // 플레이어 인증
        if (!players.authenticate(playerId, playerKey)) {
            client.emit("cannot join room", { message: "User authentication failed" });
            return;
        }

        // 방 인증
        if (!rooms.authenticate(roomId, roomKey)) {
            client.emit("cannot join room", { message: "Room authentication failed" });
            return;
        }

        let player = players.getById(playerId);
        let room = rooms.getById(roomId);

        // 연결 갱신
        if (player.socketId != client.id) {
            player.socketId = client.id;
        }

        // 신규 접속
        if (room.players.indexOf(player) < 0) {

            // 초과 접속 시도
            if (room.players.length >= 2) {
                client.emit("cannot join room", { message: "Exceeded maximum number of players" });
                return;
            } else {

                room.players.push(player);
                player.playingRoom = room;

                // 모든 플레이어가 접속한 경우
                if (room.players.length == 2) {

                    let stoneColor = n => room.playerStoneColors[n];

                    socket.to(room.players[0].socketId).emit("room joined", {
                        nicknames: [room.players[0].nickname, room.players[1].nickname],
                        stoneColors: room.playerStoneColors,
                        stoneColor: stoneColor(0),
                        turn: room.game.currentTurn
                    });

                    socket.to(room.players[1].socketId).emit("room joined", {
                        nicknames: [room.players[0].nickname, room.players[1].nickname],
                        stoneColors: room.playerStoneColors,
                        stoneColor: stoneColor(1),
                        turn: room.game.currentTurn
                    });

                    console.log("Game <%s> started.", roomId);
                }
            }
        }

        // 재접속
        else {

                // 기존 게임 데이터 전송
                let stoneColor = room.playerStoneColors[room.players.indexOf(player)];

                socket.to(player.socketId).emit("room joined", {
                    nicknames: [room.players[0].nickname, room.players[1].nickname],
                    stoneColors: room.playerStoneColors,
                    stoneColor: stoneColor,
                    turn: room.game.currentTurn,
                    board: room.game.board
                });

                room.paused = false;
                room.broadcast(socket, "player reconnected", player.nickname);

                console.log("Game <%s> resumed.", roomId);
            }

        // 타임아웃 설정 (1분)
        room.setTimer(PLAY_TIMEOUT, () => {

            if (!room.game.isGameEnd()) {

                let stoneColor = room.playerStoneColors[room.players.indexOf(player)];

                room.broadcast(socket, "game over", { win: stoneColor });

                // 방 삭제
                rooms.remove(room.id);

                console.log("Game <%s> ended. (Timeout)", room.id);
            }
        });
    });

    /**
     * 게임 방 입장하기
     */
    client.on("observe room", function (roomId) {

        if (!rooms.exists(roomId)) {

            observingRoom = null;

            client.emit("cannot observe room", { message: "Room does not exist" });

            return;
        }

        let room = rooms.getById(roomId);
        observingRoom = room;

        room.observers.push(client.id);

        // 기존 게임 데이터 전송
        client.emit("room observed", {
            nicknames: [room.players[0].nickname, room.players[1].nickname],
            stoneColors: room.playerStoneColors,
            turn: room.game.currentTurn,
            board: room.game.board
        });
    });

    /**
     * 랜덤한 방 얻기
     */
    client.on("get random room", function () {
        client.emit("random room", rooms.pickRandomId());
    });

    /**
     * 돌 놓기
     */
    client.on("place stone", function (roomId, roomKey, playerId, playerKey, coord) {

        // 플레이어 인증
        if (!players.authenticate(playerId, playerKey)) {
            client.emit("cannot place stone", { message: "User authentication failed" });
            return;
        }

        // 방 인증
        if (!rooms.authenticate(roomId, roomKey)) {
            client.emit("cannot place stone", { message: "Room authentication failed" });
            return;
        }

        let player = players.getById(playerId);
        let room = rooms.getById(roomId);

        if (room.players.indexOf(player) < 0) {
            client.emit("cannot place stone", { message: "Wrong match" });
            return;
        }

        if (room.paused) {
            client.emit("cannot place stone", { message: "Room paused" });
            return;
        }

        // 게임이 끝났을 경우
        if (room.game.isGameEnd()) {
            client.emit("cannot place stone", { message: "Game over" });
            return;
        }

        let playerStoneColor = room.playerStoneColors[room.players.indexOf(player)];

        if (room.game.currentTurn == playerStoneColor) {

            try {

                // 돌 놓기
                room.game.placeStone(coord, playerStoneColor);

                room.broadcast(socket, "stone placed", {
                    stoneColor: playerStoneColor,
                    coord: coord
                });

                // 게임이 끝났다면
                if (room.game.isGameEnd()) {

                    room.broadcast(socket, "game over", { win: playerStoneColor });

                    // 방 삭제
                    rooms.remove(room.id);

                    console.log("Game <%s> ended. (Game over)", room.id);

                    return;
                }

                // 타임아웃 설정 (1분)
                room.setTimer(PLAY_TIMEOUT, () => {

                    if (!room.game.isGameEnd()) {

                        let stoneColor = room.playerStoneColors[room.players.indexOf(player)];

                        room.broadcast(socket, "game over", { win: stoneColor });

                        // 방 삭제
                        rooms.remove(room.id);

                        console.log("Game <%s> ended. (Timeout)", room.id);
                    }
                });
            } catch (error) {
                client.emit("cannot place stone", { message: "Invalid stone coordinate" });
            }
        }

        // 자신의 차례가 아닐 경우
        else {
                client.emit("cannot place stone", { message: "Opponent's turn" });
            }
    });

    /**
     * 클라이언트와의 연결이 끊겼을 경우
     */
    client.on("disconnect", function () {

        console.log("Connection to client <%s> disconnected", client.id);

        let player = players.getBySocketId(client.id);

        // 접속 절차를 밟지 않은 유저일 경우
        if (player == null) {

            if (observingRoom != null) {

                let index = observingRoom.observers.indexOf(client.id);

                if (index > -1) {
                    observingRoom.observers.splice(index, 1);
                }
            }

            return;
        }

        let room = player.playingRoom;

        // 접속 정보 말소
        player.socketId = "";

        // 대기 큐애서 삭제
        var index = waitingQueue.indexOf(player);
        if (index > -1) {
            waitingQueue.splice(index, 1);
        }

        // 현재 게임 중이라면, 방에 통보
        if (room != null) {

            // 만약 남은 다른 유저도 나간 상태라면
            if (room.players[0].socketId == "" && room.players[1].socketId == "") {

                room.broadcast(socket, "game over", { win: __WEBPACK_IMPORTED_MODULE_5__OmokStone__["a" /* default */].BLACK });

                // 방 삭제
                rooms.remove(room.id);

                console.log("Game <%s> ended. (Both players left)", room.id);
            } else {

                room.broadcast(socket, "player disconnected", player.nickname);

                room.paused = true;

                // 게임 종료 타이머 시작
                room.setTimer(RECONNECT_TIMEOUT, () => {

                    if (!player.isConnected()) {

                        let stoneColor = room.playerStoneColors[room.players.indexOf(player)];

                        room.broadcast(socket, "game over", { win: stoneColor == __WEBPACK_IMPORTED_MODULE_5__OmokStone__["a" /* default */].BLACK ? __WEBPACK_IMPORTED_MODULE_5__OmokStone__["a" /* default */].WHITE : __WEBPACK_IMPORTED_MODULE_5__OmokStone__["a" /* default */].BLACK });

                        // 방 삭제
                        rooms.remove(room.id);

                        console.log("Game <%s> ended. (One player left)", room.id);
                    }
                });
            }
        }

        console.log("Player <%s> has left", player.nickname);
    });
});

/***/ })
/******/ ]);