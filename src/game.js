import {checkValidity, checkVictory, opponentColor, StoneColor} from './rule.js';

export class Game {

    constructor(boardSize) {

        this.boardSize = boardSize
        this.board = []
        this.victory = "";
        this.players = [];
        this.currentTurn = StoneColor.BLACK;
    }

    placeStone(coord, stoneColor) {

        let x = this.fromStringCoordinate(coord).x;
        let y = this.fromStringCoordinate(coord).y;

        if (this.board[y * this.boardSize + x] != null) {
            throw Error("Invalid placement");
        }

        if (checkValidity(x, y, stoneColor, this.board)) {
            if (checkVictory(x, y, stoneColor, this.board)) {
                this.victory = stoneColor;
            }
            this.board[y * this.boardSize + x] = stoneColor;
            this.currentTurn = opponentColor(this.currentTurn)
        } else {
            throw Error("Invalid placement");
        }
    }

    isGameEnd() {
        return this.victory !== "";
    }

    fromStringCoordinate(coord) {
        return {x: coord.charCodeAt(0) - 97, y: Number(coord.slice(1)) - 1};
    }
}
