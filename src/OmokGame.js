import OmokAlgorithm from './OmokAlgorithm.js';

export default class OmokGame {
    constructor(boardSize) {
        this.algorithm = new OmokAlgorithm();
        this.board = {placement:[], boardSize:boardSize}
        this.victory = 0;
        this.playerIds = [];
        this.currentTurn = "black";
    }
    placeStone(coord, stoneColor) {
        console.log(stoneColor);

        let x = this.fromStringCoordinate(coord).x;
        let y = this.fromStringCoordinate(coord).y;
        
        let stoneColorValue = stoneColor == "black" ? 1 : 2;

        if (this.algorithm.checkValidity(x, y, stoneColorValue, this.board)) {
            if (this.algorithm.checkVictory(x, y, stoneColorValue, this.board)) {
                this.victory = stoneColor;
            }
            this.board.placement[y * this.board.boardSize + x] = stoneColorValue;
            this.currentTurn = this.currentTurn == "black" ? "white" : "black";
        } else {
            throw Error("Invalid move");
        }
    }

    fromStringCoordinate(coord) {
        return {x: coord.charCodeAt(0) - 97, y: Number(coord.slice(1))};
    }
}
