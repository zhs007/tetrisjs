import CFG from '../Config';
import LogicShape from './LogicShape';

export default class LogicMgr {
    constructor(cols, rows) {
        this.iCols = cols;
        this.iRows = rows;

        this.lstBoard = [];

        for (let ii = 0; ii < rows; ++ii) {
            let lst = [];
            for (let jj = 0; jj < cols; ++jj) {
                lst.push(0);
            }
            this.lstBoard.push(lst);
        }

        this.curShape = null;
        this.lstWaitShape = [];
        this.bGaming = false;
        this.bRefresh = false;
        this.iScore = 0;
        this.iLevel = 0;

        this.lstListener = [];
    }

    start() {
        if (this.bGaming) {
            return;
        }

        this.clean();

        this.lstWaitShape = [];

        for (let ii = 0; ii < CFG.LOGIC.WAIT_NUMS; ++ii) {
            let shape = this._randomShape();
            this.lstWaitShape.push(shape);
        }

        this.nextBlock();

        this.bGaming = true;
        this.stime = CFG.LOGIC.MAX_SPEED;
        this.speed = CFG.LOGIC.MAX_SPEED;
        this.iScore = 0;
        this.iLevel = 0;
    }

    left() {
        if (!this.bGaming || this.curShape == null) {
            return;
        }

        this.curShape.left();
        this.bRefresh = true;
    }

    right() {
        if (!this.bGaming || this.curShape == null) {
            return;
        }

        this.curShape.right();
        this.bRefresh = true;
    }

    drop() {
        if (!this.bGaming || this.curShape == null) {
            return;
        }

        if (!this.curShape.fall()) {
            // 不能下落则放置并判断是否失败
            this.dispatchEvent('drop');

            if (this.curShape.putBoard()) {
                this.curShape = null;
                this.bGaming = false;
            }
            else {
                this.checkDestroy();
                this.nextBlock();
            }
        }

        this.bRefresh = true;
    }

    quickDrop() {
        if (!this.bGaming || this.curShape == null) {
            return;
        }

        this.curShape.quickFall();
        this.dispatchEvent('drop');

        if (this.curShape.putBoard()) {
            this.curShape = null;
            this.bGaming = false;
        }
        else {
            this.checkDestroy();
            this.nextBlock();
        }

        this.bRefresh = true;
    }

    rotate() {
        if (!this.bGaming || this.curShape == null) {
            return;
        }

        this.curShape.rotate();
        this.bRefresh = true;
    }

    clean() {
        for (let ii = 0; ii < this.iRows; ++ii) {
            let lst = [];
            for (let jj = 0; jj < this.iCols; ++jj) {
                this.lstBoard[ii][jj] = 0;
            }
        }
    }

    checkDestroy() {
        let bdes = false;

        for (let ii = 0; ii < this.iRows; ++ii) {
            let bfull = true;

            for (let jj = 0; jj < this.iCols; ++jj) {
                if (this.lstBoard[ii][jj] == 0) {
                    bfull = false;
                    break;
                }
            }

            if (bfull) {
                bdes = true;
                this.lstBoard.splice(ii, 1);

                let lst = [];
                for (let kk = 0; kk < this.iCols; ++kk) {
                    lst.push(0);
                }
                this.lstBoard.unshift(lst);
                this.iScore += 1;
            }
        }

        this.iLevel = Math.floor(this.iScore / CFG.LOGIC.CHG_SCORE);

        this.speed = CFG.LOGIC.MAX_SPEED - this.iLevel * CFG.LOGIC.CHG_SPEED;

        if (this.speed < CFG.LOGIC.MIN_SPEED) {
            this.speed = CFG.LOGIC.MIN_SPEED;
        }

        if (bdes) {
            this.dispatchEvent('destroy');
        }

        return bdes;
    }

    nextBlock() {
        this.curShape = this.lstWaitShape[0];
        this.curShape.beginPosition();

        this.lstWaitShape.splice(0, 1);

        let shape = this._randomShape();
        this.lstWaitShape.push(shape);
    }

    getData() {
        let data = {};

        data.lst = null;
        data.board = this.lstBoard;
        data.shadow = null;

        if (this.curShape) {
            data.lst = this.curShape.getBlocks();
            data.shadow = this.curShape.getShadowBlocks();
        }

        this.bRefresh = false;
        return data;
    }

    getWaitBlocks(index) {
        if (index < 0 || index >= this.lstWaitShape.length) {
            return null;
        }

        let shape = this.lstWaitShape[index];

        return shape.getBlocks();
    }

    update(dms) {
        if (!this.bGaming) {
            return;
        }

        this.stime += dms;

        if (this.stime > this.speed) {
            this.stime -= this.speed;
            this.drop();
        }
    }

    addEventListener(func) {
        this.lstListener.push(func);
    }

    dispatchEvent(evt) {
        for (let ii = 0; ii < this.lstListener.length; ++ii) {
            let func = this.lstListener[ii];
            func.call(this, evt);
        }
    }

    _randomShape() {
        let type = Math.floor(Math.random() * CFG.LOGIC.SHAPES.length);
        let shape = new LogicShape(type, CFG.LOGIC.COLS, CFG.LOGIC.ROWS, this.lstBoard);
        return shape;
    }
}
