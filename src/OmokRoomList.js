import OmokRoom from "./OmokRoom";

export default class OmokRoomList {

    constructor() {
        this.roomIdMap = new Map();
        this.roomList = [];
    }

    create() {
        let room = new OmokRoom(this._generateUid());
        this.roomIdMap.set(room.roomId, room);
        return room;
    }

    remove(roomId) {
        let room = this.getById(roomId);
        room.close();

        this.roomList.splice(roomList.indexOf(room), 1);
        this.roomIdMap.delete(room.id);
    }

    authenticate(roomId, roomKey) {
        if (this.roomIdMap.has(roomId)) {
            if (this.roomIdMap.get(roomId).key == roomKey) {
                return true;
            }
        }
        return false;
    }

    exists(roomId) {
        return this.roomIdMap.has(roomId);
    }

    pickRandomId() {
        let keyList = [];
        for (let key of roomIdMap.keys()) {
            keyList.push(key);
        }
        if (keyList.length > 0) {
            return keyList[Math.min(Math.floor(keyList.length * Math.random()), keyList.length)];
        } else {
            return "";
        }
    }

    getById(roomId) {
        return this.roomIdMap.get(roomId);
    }

    _generateUid() {
        let uid;
        do {
            uid = Math.random().toString(36).substr(2,10);
        } while (roomIdMap.has(uid));
        return uid;
    }
}
