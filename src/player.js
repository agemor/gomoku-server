import * as WebSocket from 'ws'

export class Player {

    constructor(id, nickname, client) {

        this.id = id;
        this.key = this._generateKey();
        this.nickname = nickname;
        this.client = client;

        this.playingRoom = null;
    }

    isConnected() {
        return this.client.readyState === WebSocket.OPEN
    }

    _generateKey() {
        return Math.random().toString(36).substr(2, 10);
    }
}


export class PlayerList {

    constructor() {
        this.playerIdMap = new Map();
        this.playerList = [];
    }

    register(nickname, client) {
        let player = new Player(this._generateUid(), nickname, client);
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
            if (this.playerIdMap.get(playerId).key === playerKey) {
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
            if (this.playerList[i].socketId === socketId) {
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
