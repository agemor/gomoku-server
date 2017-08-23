import OmokPlayer from "./OmokPlayer";

export default class OmokPlayerList {

    constructor() {
        this.playerIdMap = new Map();
        this.playerList = [];
    }

    register(nickname, socketId) {
        let player = new OmokPlayer(this._generateUid(), nickname, socketId);
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
            uid = Math.random().toString(36).substr(2,10);
        } while (this.playerIdMap.has(uid));
        return uid;
    }
}
