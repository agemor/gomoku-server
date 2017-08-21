import OmokPlayer from "./OmokPlayer";
import OmokAlgorithm from './OmokAlgorithm.js';
import OmokStone from "./OmokStone";

export default class OmokGame {

    constructor(boardSize) {

        this.algorithm = new OmokAlgorithm();
        this.board = {placement:[], boardSize:boardSize}
        this.victory = "";
        this.players = [];
        this.currentTurn = OmokStone.BLACK;
    }

    placeStone(coord, stoneColor) {

        let x = this.fromStringCoordinate(coord).x;
        let y = this.fromStringCoordinate(coord).y;

        if (this.algorithm.checkValidity(x, y, stoneColor, this.board)) {
            if (this.algorithm.checkVictory(x, y, stoneColor, this.board)) {
                this.victory = stoneColor;
            }
            this.board.placement[y * this.board.boardSize + x] = (stoneColor == OmokStone.BLACK ? 1 : 2);
            this.currentTurn = this.currentTurn == OmokStone.BLACK ? OmokStone.WHITE : OmokStone.BLACK;
        } else {
            throw Error("Invalid move");
        }
    }

    isGameEnd() {
        return this.victory != "";
    }

    fromStringCoordinate(coord) {
        return {x: coord.charCodeAt(0) - 97, y: Number(coord.slice(1)) - 1};
    }
}
