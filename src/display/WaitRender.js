import * as PIXI from 'pixi.js';

export default class WaitRender extends PIXI.Container {
    constructor(bsize, xsp, ysp, width, height, btextures) {
        super();

        this.iBlockSize = bsize;
        this.iXSp = xsp;
        this.iYSp = ysp;

        this.iWidth = width;
        this.iHeight = height;

        this.lstBlockTexture = btextures;
        // this.scale = scale;

        this.lstSprite = [];
    }

    showBlocks(lst) {
        this.clean();

        if(lst) {
            while(this.lstSprite.length < lst.length) {
                let sprite = new PIXI.Sprite(this.lstBlockTexture[0]);
                this.addChild(sprite);

                this.lstSprite.push(sprite);
            }

            let rect = {left:-1, right:-1, top:-1, bottom:-1};

            for(let ii = 0; ii < lst.length; ++ii) {
                let node = lst[ii];
                let sprite = this.lstSprite[ii];

                sprite.visible = true;
                sprite.texture = this.lstBlockTexture[node.bt - 1];
                sprite.position.x = node.x * (this.iBlockSize + this.iXSp);
                sprite.position.y = node.y * (this.iBlockSize + this.iYSp);

                if(rect.left < 0 || sprite.position.x < rect.left) {
                    rect.left = sprite.position.x;
                }

                if(rect.top < 0 || sprite.position.y < rect.top) {
                    rect.top = sprite.position.y;
                }

                if(rect.right < 0 || sprite.position.x + this.iBlockSize + this.iXSp > rect.right) {
                    rect.right = sprite.position.x + this.iBlockSize + this.iXSp;
                }

                if(rect.bottom < 0 || sprite.position.y + this.iBlockSize + this.iYSp > rect.bottom) {
                    rect.bottom = sprite.position.y + this.iBlockSize + this.iYSp;
                }
            }

            let px = this.iWidth  / this.scale.x / 2 - (rect.left + rect.right) / 2;
            let py = this.iHeight / this.scale.y / 2 - (rect.top + rect.bottom) / 2;

            for(let ii = 0; ii < lst.length; ++ii) {
                let sprite = this.lstSprite[ii];

                sprite.position.x = sprite.position.x + px;
                sprite.position.y = sprite.position.y + py;
            }
        }
    }

    clean() {
        for (let ii = 0; ii < this.lstSprite.length; ++ii) {
            let sprite = this.lstSprite[ii];
            sprite.visible = false;
        }
    }
}
