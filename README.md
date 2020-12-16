# omok.io app
Game app for [omok.io](https://github.com/agemor/omok.io).

## How to use
```
$ npm install
$ npm start
```

## Documentation

### *lobby.html*

#### Request: `login (nickname)`
- Response: `login success (player.id, player.key)`
- Response: `cannot login (error)`


#### Request: `find match (player.id, player.key)`
- Response: `match found (room.id, room.key)`
- Response: `cannot find match (error)`

#### Request: `get random room`
- Response: `random room (room.id)`

### *game.html*

#### Request: `join room (room.id, room.key, player.id, player.key)`
- Response: `room joined ({stoneColor, board, turn})`
- Response: `cannot join room (error)`

#### Request: `observe room (room.id)`
- Response: `room observed ({players, stoneColors, board, turn})`
- Response: `cannot observe room (error)`

#### Request: `place stone (room.id, room.key, player.id, player.key, coordinate)`
- Response: `stone placed ({stoneColor, coordinate})`
- Response: `game over ({win})`
- Response: `cannot place stone (error)`
