import io from 'socket.io';
import Game from './game';
import {StoneColor, TimeLimit} from "./rule";

export class Room {

    constructor(id) {

        this.id = id;
        this.key = this._generateKey();

        this.game = new Game(19);

        this.players = [];
        this.playerStoneColors = Math.random() > 0.5 ? [StoneColor.BLACK, StoneColor.WHITE] : [StoneColor.WHITE, StoneColor.BLACK];
        this.observers = [];

        this.timer = null;
        this.paused = false;
    }

    close() {
        this.unsetTimer();
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].playingRoom = null;
        }
    }

    broadcast(socket, message, dataObject) {

        let send = (target) => socket.to(target).emit(message, dataObject);

        // 플레이어에게 
        for (let i = 0; i < this.players.length; i++) {
            send(this.players[i].socketId);
        }

        // 옵저버에게 
        for (let i = 0; i < this.observers.length; i++) {
            send(this.observers[i]);
        }
    }

    setTimer(seconds, callback) {
        this.unsetTimer();
        this.timer = setTimeout(callback, seconds * TimeLimit.PLACEMENT);
    }

    unsetTimer() {
        if (this.timer != null) {
            clearTimeout(this.timer);
        }
    }

    _generateKey() {
        return Math.random().toString(36).substr(2, 10);
    }
}


export class RoomList {

    constructor() {
        this.roomIdMap = new Map();
        this.roomList = [];
    }

    create() {
        let room = new Room(this._generateUid());
        this.roomIdMap.set(room.id, room);
        return room;
    }

    remove(roomId) {

        let room = this.getById(roomId);

        if (room != null) {

            room.close();

            this.roomList.splice(this.roomList.indexOf(room), 1);
            this.roomIdMap.delete(room.id);
        }
    }

    authenticate(roomId, roomKey) {
        if (this.roomIdMap.has(roomId)) {
            if (this.roomIdMap.get(roomId).key === roomKey) {
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
        for (let key of this.roomIdMap.keys()) {
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
            uid = Math.random().toString(36).substr(2, 10);
        } while (this.roomIdMap.has(uid));
        return uid;
    }
}
