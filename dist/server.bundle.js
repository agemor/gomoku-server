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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OmokAlgorithm_js__ = __webpack_require__(4);


class OmokGame {
    constructor(boardSize) {
        this.algorithm = new __WEBPACK_IMPORTED_MODULE_0__OmokAlgorithm_js__["a" /* default */]();
        this.board = { placement: [], boardSize: boardSize };
        this.victory = 0;
        this.playerIds = [];
        this.currentTurn = "black";
    }
    placeStone(coord, stoneColor) {
        console.log(stoneColor);

        let x = this.fromStringCoordinate(coord).x;
        let y = this.fromStringCoordinate(coord).y;

        let stoneColorValue = stoneColor == "black" ? 1 : 2;

        if (this.algorithm.checkValidity(x, y, stoneColorValue, this.board)) {
            if (this.algorithm.checkVictory(x, y, stoneColorValue, this.board)) {
                this.victory = stoneColor;
            }
            this.board.placement[y * this.board.boardSize + x] = stoneColorValue;
            this.currentTurn = this.currentTurn == "black" ? "white" : "black";
        } else {
            throw Error("Invalid move");
        }
    }

    fromStringCoordinate(coord) {
        return { x: coord.charCodeAt(0) - 97, y: Number(coord.slice(1)) };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OmokGame;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class OmokAlgorithm {
    constructor() {}

    analyze() {}

    /**
     * 돌을 놓는다고 가정했을 때, 이겼는지 검사
     */
    checkVictory(x, y, stoneColor, board) {

        let boardClone = {
            placement: board.placement.slice(0), boardSize: board.boardSize
        };
        boardClone.placement[y * board.boardSize + x] = stoneColor;

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

        let boardClone = {
            placement: board.placement.slice(0), boardSize: board.boardSize
        };
        boardClone.placement[y * board.boardSize + x] = stoneColor;

        // 삼삼 체크
        let notDoubleThree = !this.checkDoubleN(x, y, stoneColor, boardClone, 3);

        // 사사 체크
        let notDoubleFour = !this.checkDoubleN(x, y, stoneColor, boardClone, 4);

        return notDoubleThree && notDoubleFour;
    }

    /**
     * NN 체크
     */
    checkDoubleN(x, y, stoneColor, board, n) {

        // 돌 연산자
        let at = (sx, sy) => board.placement[sy * board.boardSize + sx];
        let inbound = (sx, sy) => sx >= 0 && sy >= 0 && sx < board.boardSize && sy < board.boardSize;

        // 기준 돌
        let criterion = stoneColor;
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_http__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_http___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_http__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_socket_io__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jsonwebtoken__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jsonwebtoken__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OmokGame_js__ = __webpack_require__(0);





var port = 5555;

//  Secret key for jwt
const SECRET_KEY = "shhhhhh";

//  Create simple http server
var server = __WEBPACK_IMPORTED_MODULE_0_http___default.a.createServer();
server.listen(port);

//  Attach socket.io to server
var socket = __WEBPACK_IMPORTED_MODULE_1_socket_io___default.a.listen(server);

var lobbyUsers = [];
var gameMap = new Map();

socket.on('connection', function (client) {
    console.log('SOCKET::Connection to client <%s> established', client.id);
    let userAdded = false;

    //  lobby handlers
    client.on('find opponent', function (data, callback) {
        if (userAdded == false) {
            if (lobbyUsers.length !== 0) {

                client.emit("found match", { success: true, message: "found match" });

                // take first user out of queue
                let opponentId = lobbyUsers.shift();
                console.log("Matching user <%s> with user <%s>...", client.id, opponentId);

                //  create room
                let roomId;
                do {
                    roomId = Math.random().toString(36).substr(2, 10);
                } while (gameMap.has(roomId));

                gameMap.set(roomId, new __WEBPACK_IMPORTED_MODULE_3__OmokGame_js__["a" /* default */](15));

                //  create token
                let roomToken = __WEBPACK_IMPORTED_MODULE_2_jsonwebtoken___default.a.sign({ roomId: roomId }, SECRET_KEY);

                //  emit roomId and token to players
                socket.to(client.id).to(opponentId).emit('room created', roomToken, roomId);
            } else {
                lobbyUsers.push(client.id);
                userAdded = true;
                client.emit("added to queue", { success: true });
                console.log("Added user <%s> to queue!", client.id);
            }
        } else {
            client.emit("user already in queue", { success: false });
        }
    });

    //  game handlers
    //  event: roomId, token
    client.on('join', function () {

        //  Set variable parameters
        let roomToken = arguments[arguments.length - 1];
        let roomId = arguments[arguments.length - 2];

        if (!typeof roomId == 'string') {
            client.emit("join failed", { message: "invalid arguments" });
        } else if (!gameMap.has(roomId)) {
            client.emit("join failed", { message: "invalid room id" });
        } else {
            if (roomToken) {
                __WEBPACK_IMPORTED_MODULE_2_jsonwebtoken___default.a.verify(roomToken, SECRET_KEY, function (err, decoded) {
                    if (!decoded) {
                        console.log(err);
                        client.emit("join failed", { message: "invalid token" });
                    } else if (decoded.roomId !== roomId) {
                        client.emit("join failed", { message: "token does not match room" });
                    } else {
                        let omokGame = gameMap.get(roomId);
                        omokGame.playerIds.push(client.id);
                        client.join(roomId);
                        if (omokGame.playerIds.length == 1) {
                            client.emit("waiting for other player");
                        } else if (omokGame.playerIds.length == 2) {
                            client.emit("game joined as player");
                            console.log("Game <%s> started.", roomId);
                            let stoneColor1 = Math.floor(Math.random() * 2) == 0 ? "black" : "white";
                            let stoneColor2 = stoneColor1 == "black" ? "white" : "black";
                            let gameToken1 = __WEBPACK_IMPORTED_MODULE_2_jsonwebtoken___default.a.sign({ roomId: roomId, stoneColor: stoneColor1 }, SECRET_KEY);
                            let gameToken2 = __WEBPACK_IMPORTED_MODULE_2_jsonwebtoken___default.a.sign({ roomId: roomId, stoneColor: stoneColor2 }, SECRET_KEY);
                            socket.to(omokGame.playerIds[0]).emit('game ready', { gameToken: gameToken1, stoneColor: stoneColor1 });
                            socket.to(omokGame.playerIds[1]).emit('game ready', { gameToken: gameToken2, stoneColor: stoneColor2 });
                        } else {
                            client.emit("join failed", { message: "invalid number of users" });
                        }
                    }
                });
            } else {
                let omokGame = gameMap.get(roomId);
                client.join(roomId);
                client.emit("game joined as observer", { board: omokGame.board });
            }
        }
    });

    //  event: move, roomId, token
    client.on('play move', function (gameToken, roomId, move) {
        console.log("Playing move..");

        if (!(typeof gameToken == 'string' && typeof roomId == 'string' && typeof move == 'string')) {
            client.emit("play move failed", { message: "invalid arguments" });
        } else if (!gameMap.has(roomId)) {
            client.emit("play move failed", { message: "invalid room id" });
        } else {
            __WEBPACK_IMPORTED_MODULE_2_jsonwebtoken___default.a.verify(gameToken, SECRET_KEY, function (err, decoded) {
                if (!decoded) {
                    console.log(err);
                    client.emit("play move failed", { message: "invalid token" });
                } else if (decoded.roomId !== roomId) {
                    client.emit("play move failed", { message: "token does not match room" });
                } else {
                    let omokGame = gameMap.get(roomId);
                    if (omokGame.currentTurn != decoded.stoneColor) {
                        client.emit("play move failed", { message: "opponent's turn" });
                    } else {
                        try {
                            omokGame.placeStone(move, decoded.stoneColor);
                            let gameEnded = false;
                            if (omokGame.victory == decoded.stoneColor) {
                                gameEnded = true;
                            }
                            socket.in(roomId).emit('stone placed', { stoneColor: decoded.stoneColor, move: move, gameEnd: gameEnded });
                        } catch (err) {
                            console.log(err);
                            client.emit("play move failed", { message: "invalid move" });
                        }
                    }
                }
            });
        }
    });

    client.on('disconnect', function () {
        //  Remove user from lobby
        var index = lobbyUsers.indexOf(client.id);
        if (index > -1) {
            lobbyUsers.splice(index, 1);
        }
        console.log('SOCKET::Server has disconnected');
    });
});

console.log('Server running at http://127.0.0.1:' + port + '/');

/***/ })
/******/ ]);