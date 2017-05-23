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
    client.on('find opponent', function(callback) {
        if (userAdded == false) {
            if (lobbyUsers.length !== 0) {
                callback({success:true, message: "found match"});
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
                let token = jwt.sign({roomId: roomId}, SECRET_KEY);

                //  emit roomId and token to players
                socket.to(client.id).to(opponentId).emit('room created', {roomId: roomId, token: token});
            } else {
                lobbyUsers.push(client.id);
                userAdded = true;
                callback({success:true, message: "added to queue"});
                console.log("Added user <%s> to queue!", client.id);
            }
        } else {
            callback({success:false, error: {code:10, message:"user already in queue"}});
        }
    });

    //  game handlers
    //  event: roomId, token
    client.on('start game', function(event) {
        if (event.token) {
            jwt.verify(event.token, SECRET_KEY, function(err, decoded) {
                if(decoded) {
                    if (decoded.roomId == event.roomId) {
                        let omokGame = gameMap.get(event.roomId);
                        if (omokGame) {
                            omokGame.playerIds.push(client.id);
                            client.join(event.roomId);
                            if (omokGame.playerIds.length == 2) {
                                let stoneColor = Math.floor(Math.random() *2) + 1;
                                let token1 = jwt.sign({roomId: event.roomId, stoneColor:stoneColor}, SECRET_KEY);
                                let token2 = jwt.sign({roomId: event.roomId, stoneColor:3-stoneColor}, SECRET_KEY);
                                socket.to(omokGame.playerIds[0]).emit('game ready', {token:token1,roomId:event.roomId,stoneColor:stoneColor});
                                socket.to(omokGame.playerIds[1]).emit('game ready', {token:token2,roomId:event.roomId,stoneColor:3-stoneColor});
                            }
                        } else {
                            throw Error("Game doesn't exist yet");
                        }
                    } else {
                        throw Error("Given roomId and token's roomId does not match!");
                    }
               } else {
                    throw Error("Error decoding token");
                }
            });
        } else {
            if (event.roomId) {
                let omokGame = gameMap.get(event.roomId);
                if (omokGame) {
                    socket.to(client.id).emit('board get',{board: omokGame.board});
                    client.join(event.roomId);
                } else {
                    throw Error("Game doesn't exist yet");
                }
            } else {
                throw Error("User has neither token or room id");
            }
        }
    });

    //  event: move, roomId, token
    client.on('play move', function(event) {
        console.log("Playing move..");
        if (event.token) {
            jwt.verify(event.token, SECRET_KEY, function(err, decoded) {
                if (decoded) {
                    if (decoded.roomId == event.roomId) {
                        let game = gameMap.get(event.roomId);
                        try {
                            game.placeStone(event.move, decoded.stoneColor);
                            let gameEnded = false;
                            if (game.victory == decoded.stoneColor) {
                                let gameEnded = true;
                            }
                            socket.in(event.roomId).emit('stone place', {color:decoded.stoneColor, coord:event.move, gameend:gameEnded});;
                        }
                        catch (err) {
                            console.log(err);
                            socket.to(client.id).emit('move invalid');
                        }
                    } else {
                        throw Error("roomId and token's roomId does not match");
                    }
                } else {
                    throw Error("Error decoding token!");
                }
            });
        } else {
            throw Error("No token given");
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
