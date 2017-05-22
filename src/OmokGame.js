import OmokAlgorithm from './OmokAlgorithm.js';

export default class OmokGame {
    constructor(boardSize) {
        this.algorithm = new OmokAlgorithm();
        this.board = {placement:[], boardSize:boardSize}
        this.victory = 0;
        this.playerIds = [];
    }
    placeStone(coord, stoneColor) {
        console.log(stoneColor);
        let x = coord[0].charCodeAt(0) - 96;
        let y = Number(coord.slice(1));

        if (this.algorithm.checkValidity(x,y,stoneColor,this.board)) {
            if (this.algorithm.checkVictory(x,y, stoneColor, this.board)) {
                this.victory = stoneColor;
            }
            this.board.placement[y * this.board.boardSize + x] = stoneColor;
        } else {
            throw Error("Invalid move");
        }
    }
}
