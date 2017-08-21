import io from 'socket.io';
import OmokGame from './OmokGame';
import OmokStone from './OmokStone';

export default class OmokRoom {

    constructor(id) {

        this.id = id;
        this.key = this._generateKey();

        this.game = new OmokGame(30);

        this.players = [];
        this.playerStoneColors = Math.random() > 0.5 ? [OmokStone.BLACK, OmokStone.WHITE] : [OmokStone.WHITE, OmokStone.BLACK];
        this.observers = [];
    }

    close() {
        for (let i = 0; this.players.length; i++) {
            this.players[i].playingRoom = null;
        }
    }

    broadcast(socket, message, dataObject) {
        
        let send = (target) => socket.in(target).emit('stone placed', dataObject);

        // 플레이어에게 
        for (let i = 0; i < this.players.length; i++) {
            send(this.players[i].socketId);
        }

        // 옵저버에게 
        for (let i = 0; i < this.observers.length; i++) {
            send(this.observers[i]);
        }
    }

    startTimer() {

    }

    _generateKey() {
        return Math.random().toString(36).substr(2,10);
    }
}
