export default class OmokPlayer {

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
        return Math.random().toString(36).substr(2,10);
    }
}
