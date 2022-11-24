import CFG from '../Config';

export default class LogicShape {
    constructor(type, cols, rows, board) {
        this.iCols = cols;
        this.iRows = rows;
        this.lstBoard = board;

        this.setPosition(0, 0);
        this.setType(type);
    }

    setType(type) {
        this.type = type;
        this.rtype = 0;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    beginPosition() {
        const shape = CFG.LOGIC.SHAPES[this.type][this.rtype];

        let rows = shape.length;
        let cols = shape[0].length;

        this.setPosition(Math.floor((this.iCols - cols) / 2), -rows);

        // 如果一个块都不在绘制范围内，则尝试下移
        let lst = this.getBlocks();

        while (!this._isInBoardList(lst)) {
            this.y += 1;
            lst = this.getBlocks();
        }
    }

    putBoard() {
        let lst = this.getBlocks();
        let isend = false;

        for (let ii = 0; ii < lst.length; ++ii) {
            let node = lst[ii];

            if (this._isInBoard(node.x, node.y)) {
                this.lstBoard[node.y][node.x] = node.bt;
            }
            else {
                isend = true;
            }
        }

        return isend;
    }

    fall() {
        // 如果之后的位置有别的块或者超出区域则失败
        let lst = this.getChgBlocks(0, 1);

        for (let ii = 0; ii < lst.length; ++ii) {
            let node = lst[ii];

            // 超出范围
            if (node.y >= this.iRows) {
                return false;
            }

            if (this._hasBlock(node.x, node.y)) {
                return false;
            }
        }

        this.y += 1;
        return true;
    }

    quickFall() {
        let bty = this._getBottomY();
        this.y += bty;
    }

    left() {
        // 如果之后的位置有别的块或者超出区域则失败
        let lst = this.getChgBlocks(-1, 0);

        for (let ii = 0; ii < lst.length; ++ii) {
            let node = lst[ii];

            // 超出范围
            if (node.x < 0) {
                return false;
            }

            if (this._hasBlock(node.x, node.y)) {
                return false;
            }
        }

        this.x -= 1;
        return true;
    }

    right() {
        // 如果之后的位置有别的块或者超出区域则失败
        let lst = this.getChgBlocks(1, 0);

        for (let ii = 0; ii < lst.length; ++ii) {
            let node = lst[ii];

            // 超出范围
            if (node.x >= this.iCols) {
                return false;
            }

            if (this._hasBlock(node.x, node.y)) {
                return false;
            }
        }

        this.x += 1;
        return true;
    }

    rotate() {
        let ox = this.x;
        let oy = this.y;
        let or = this.rtype;

        let chgx = 0;
        // 先判断边缘
        let lst = this.getRotateBlocks();

        for (let ii = 0; ii < lst.length; ++ii) {
            let node = lst[ii];

            // 下面超出则不能旋转
            if (node.y >= this.iRows) {
                return false;
            }

            if (node.x < 0 && chgx > node.x) {
                chgx = node.x;
            }
            else if (node.x >= this.iCols && chgx < node.x - this.iCols + 1) {
                chgx = node.x - this.iCols + 1;
            }
        }

        chgx = -chgx;

        // 修正位置之后再判断碰撞
        for (let ii = 0; ii < lst.length; ++ii) {
            let node = lst[ii];

            if (this._hasBlock(node.x + chgx, node.y)) {
                return false;
            }
        }

        this.rtype = this._getNext(this.rtype);
        this.x += chgx;
        return true;
    }

    getBlocks() {
        return this._getBlocks(this.type, this.rtype, this.x, this.y);
    }

    getChgBlocks(chgx, chgy) {
        return this._getBlocks(this.type, this.rtype, this.x + chgx, this.y + chgy);
    }

    getRotateBlocks() {
        let rtype = this._getNext(this.rtype);
        return this._getBlocks(this.type, rtype, this.x, this.y);
    }

    getShadowBlocks() {
        let bty = this._getBottomY();
        let lst = this.getChgBlocks(0, bty);

        return lst;
    }

    _getBottomY() {
        let lst = this.getBlocks();
        let bty = 0;

        let bn = true;

        while (bn) {
            for (let ii = 0; ii < lst.length; ++ii) {
                let node = lst[ii];

                // 超出范围
                if (node.y + bty + 1 >= this.iRows) {
                    bn = false;
                    break;
                }

                if (this._hasBlock(node.x, node.y + bty + 1)) {
                    bn = false;
                    break;
                }
            }

            if (bn) {
                bty += 1;
            }
            else {
                return bty;
            }
        }

        return bty;
    }

    _getBlocks(type, rtype, x, y) {
        let lst = [];
        const shape = CFG.LOGIC.SHAPES[type][rtype];

        let rows = shape.length;
        let cols = shape[0].length;

        for (let ii = 0; ii < rows; ++ii) {
            for (let jj = 0; jj < cols; ++jj) {
                if (shape[ii][jj] != 0) {
                    let node = { x: x + jj, y: y + ii, bt: shape[ii][jj] };
                    lst.push(node);
                }
            }
        }

        return lst;
    }

    _isInBoard(x, y) {
        return x >= 0 && x < this.iCols && y >= 0 && y < this.iRows;
    }

    _isInBoardList(lst) {
        for (let ii = 0; ii < lst.length; ++ii) {
            let node = lst[ii];

            if (this._isInBoard(node.x, node.y)) {
                return true;
            }
        }

        return false;
    }

    _hasBlock(x, y) {
        if (!this._isInBoard(x, y)) {
            return false;
        }

        return this.lstBoard && this.lstBoard[y][x] != 0;
    }

    _getNext(rtype) {
        let nrt = rtype + 1;

        if (nrt >= CFG.LOGIC.SHAPES[this.type].length) {
            nrt = 0;
        }

        return nrt;
    }
}
