import OmokPlayer from "./OmokPlayer";

export default class OmokPlayerList {

    constructor() {
        this.playerIdMap = new Map();
        this.playerSocketIdMap = new Map();
        this.playerList = [];
    }

    register(nickname, socketId) {
        let player = new OmokPlayer(this._generateUid(), nickname, socketId);
        this.playerIdMap.set(player.id, player);
        this.playerSocketIdMap.set(socketId, player);
        return player;
    }

    remove(playerId) {
        let player = this.getById(playerId);
        this.playerList.splice(playerList.indexOf(player), 1);
        this.playerIdMap.delete(player.id);
        this.playerSocketIdMap.delete(player.socketId);
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
        return this.playerSocketIdMap.get(socketId);
    }

    _generateUid() {
        let uid;
        do {
            uid = Math.random().toString(36).substr(2,10);
        } while (playerIdMap.has(uid));
        return uid;
    }
}
