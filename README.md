# omok.io server
Game server for [omok.io](https://github.com/agemor/omok.io).

## How to use
```
$ npm install
$ npm start
```

## Documentation

### Objects
**Object: Error**
 - `code` Number
 - `message` String

**Object: ServerResponse**
 - `success` Boolean

on success 
 - `message` String
 - `data` JSON

otherwise
 - `error` Error object

### Client-emitted events
#### *lobby.html*

**Event: 'find opponent'**
 - `callback({success: Boolean, message: String, data: JSON})`

#### *game.html*

**Event: 'join game'**
 - `roomToken` JsonWebToken
 - `roomId` String
 - `callback(response: ServerResponse)` Function

**Event: 'play move'**
 - `gameToken` JsonWebToken
 - `roomId` String
 - `callback(response: ServerResponse)` Function

### Server-emitted events
**Event: 'room created'** `<-` 'find opponent'
 - `roomToken` JsonWebToken: Authenticates user as player of the room
 - `roomId` String: created room id for socket.io room communication

**Event: 'game ready'** `<-` 'join game'
 - `gameToken` JsonWebToken: Authenticates play move
 - `stoneColor` String: stone color of player

**Event: 'stone placed'** `<-` 'play move'
 - `move` String: coordinates of the stone. Ex.) "i14"
 - `stoneColor` String: "black" or "white"
 - `gameEnd` Boolean: true if winning move