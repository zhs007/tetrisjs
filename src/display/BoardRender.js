import * as PIXI from 'pixi.js';

export default class BoardRender extends PIXI.Container {
    constructor(bsize, xsp, ysp, cols, rows, btextures) {
        super();

        this.iCols = cols;
        this.iRows = rows;

        this.lstBlockTexture = btextures;

        this.lstBlockSprites = [];

        for (let ii = 0; ii < rows; ++ii) {
            let lst = [];
            for (let jj = 0; jj < cols; ++jj) {
                let sprite = new PIXI.Sprite(this.lstBlockTexture[0]);
                sprite.x = jj * (bsize + xsp);
                sprite.y = ii * (bsize + ysp);
                sprite.visible = false;
                this.addChild(sprite);

                lst.push(sprite);
            }
            this.lstBlockSprites.push(lst);
        }
    }

    showShapeBlocks(lst) {
        if(lst) {
            for(let ii = 0; ii < lst.length; ++ii) {
                let node = lst[ii];

                if(node.x >= 0 && node.x < this.iCols && node.y >= 0 && node.y < this.iRows) {
                    let sprite = this.lstBlockSprites[node.y][node.x];
                    sprite.visible = true;
                    sprite.texture = this.lstBlockTexture[node.bt - 1];
                }
            }
        }
    }

    showBoardBlocks(board) {
        if (board) {
            for (let ii = 0; ii < this.iRows; ++ii) {
                let lst = [];
                for (let jj = 0; jj < this.iCols; ++jj) {
                    let sprite = this.lstBlockSprites[ii][jj];
                    let block = board[ii][jj];

                    if(block > 0) {
                        sprite.visible = true;
                        sprite.texture = this.lstBlockTexture[block - 1];
                    }
                    else {
                        sprite.visible = false;
                    }
                }
            }
        }
    }

    clean() {
        for (let ii = 0; ii < this.iRows; ++ii) {
            let lst = [];
            for (let jj = 0; jj < this.iCols; ++jj) {
                let sprite = this.lstBlockSprites[ii][jj];
                sprite.visible = false;
            }
        }
    }
}
