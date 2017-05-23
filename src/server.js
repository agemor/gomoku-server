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
                let roomToken = jwt.sign({roomId: roomId}, SECRET_KEY);

                //  emit roomId and token to players
                socket.to(client.id).to(opponentId).emit('room created', roomToken, roomId);
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
    client.on('join game', function() {
        //  Set variable parameters
        let roomToken = arguments[arguments.length-3];
        let roomId = arguments[arguments.length-2];
        let callback = arguments[arguments.length-1];

        if (!( typeof(roomId)=='string' && typeof(callback)=='function' )) {
            callback({success:false, error: {code:20, message:"invalid arguments"}});
        } else if (! gameMap.has(roomId)) {
            callback({success:false, error: {code:21, message:"invalid room id"}});
        } else {
            if (roomToken) {
                jwt.verify(roomToken, SECRET_KEY, function(err, decoded) {
                    if (!decoded) {
                        console.log(err);
                        callback({success:false, error: {code:22, message:"invalid token"}});
                    } else if (decoded.roomId !== roomId) {
                        callback({success:false, error: {code:23, message:"token does not match room"}});
                    } else {
                        let omokGame = gameMap.get(roomId);
                        omokGame.playerIds.push(client.id);
                        client.join(roomId);

                        if (omokGame.playerIds.length == 1) {
                            callback({success:true, message:"waiting for other player"});
                        }
                        else if (omokGame.playerIds.length == 2) {
                            callback({success:true, message:"game joined as player"});
                            let stoneColor1 = Math.floor(Math.random() *2) == 0 ? "black"  : "white";
                            let stoneColor2 = stoneColor1 == "black" ? "white" : "black";
                            let gameToken1 = jwt.sign({roomId: roomId, stoneColor:stoneColor1}, SECRET_KEY);
                            let gameToken2 = jwt.sign({roomId: roomId, stoneColor:stoneColor2}, SECRET_KEY);
                            socket.to(omokGame.playerIds[0]).emit('game ready', gameToken1,stoneColor1);
                            socket.to(omokGame.playerIds[1]).emit('game ready', gameToken2,stoneColor2);
                        } else {
                            callback({success:false, error: {code:24, message:"invalid number of users"}});
                        }
                    }
                });
            } else {
                let omokGame = gameMap.get(roomId);
                client.join(roomId);
                callback({success:true, message:"game joined as observer", data:{board:omokGame.board}});
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
