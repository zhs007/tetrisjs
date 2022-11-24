import { Assets, Sprite, Text, TextStyle, Container } from 'pixi.js';
import { sound } from '@pixi/sound';

import CFG from './Config';
import BoardRender from './display/BoardRender';
import WaitRender from './display/WaitRender';
import LogicMgr from './logic/LogicMgr';

const infoStyle = new TextStyle({
    fontFamily: 'Arial',
    dropShadow: true,
    dropShadowAlpha: 0.8,
    dropShadowAngle: 2.1,
    dropShadowBlur: 4,
    dropShadowColor: '0x111111',
    dropShadowDistance: 10,
    fill: ['#ffffff'],
    stroke: '#004620',
    fontSize: 40,
    fontWeight: 'lighter',
    lineJoin: 'round',
    strokeThickness: 12,
    align: 'left'
});

export default class Game {
    constructor(app) {
        this.root = new Container();
        app.stage.addChild(this.root);

        this.app = app;
        this.onResize();
    }

    run() {
        // 初始化背景
        const sheet = Assets.get(CFG.RESOURCE);
        const sprbg = new Sprite(sheet.textures[CFG.IMAGE_NAME.BG]);
        this.root.addChild(sprbg);

        let blocktextures = [];

        for (let ii = 0; ii < CFG.IMAGE_NAME.BLOCKS.length; ++ii) {
            blocktextures.push(sheet.textures[CFG.IMAGE_NAME.BLOCKS[ii]]);
        }

        this.rendBoard = new BoardRender(
            CFG.DISPLAY.BLOCK_SIZE,
            CFG.DISPLAY.BLOCK_XSP,
            CFG.DISPLAY.BLOCK_YSP,
            CFG.LOGIC.COLS,
            CFG.LOGIC.ROWS,
            blocktextures,
        );

        this.root.addChild(this.rendBoard);
        this.rendBoard.x = CFG.DISPLAY.BLOCK_BX;
        this.rendBoard.y = CFG.DISPLAY.BLOCK_BY;

        this.lstWaitRender = [];

        for (let ii = 0; ii < CFG.LOGIC.WAIT_NUMS; ++ii) {
            let waitrender = new WaitRender(
                CFG.DISPLAY.BLOCK_SIZE,
                CFG.DISPLAY.BLOCK_XSP,
                CFG.DISPLAY.BLOCK_YSP,
                CFG.DISPLAY.WAIT_WIDTH,
                CFG.DISPLAY.WAIT_HEIGHT,
                blocktextures
            );

            this.root.addChild(waitrender);
            waitrender.x = CFG.DISPLAY.WAIT_X[ii];
            waitrender.y = CFG.DISPLAY.WAIT_Y[ii];
            waitrender.scale.x = CFG.DISPLAY.WAIT_SCALE;
            waitrender.scale.y = CFG.DISPLAY.WAIT_SCALE;

            this.lstWaitRender.push(waitrender);
        }

        this.mgrLogic = new LogicMgr(CFG.LOGIC.COLS, CFG.LOGIC.ROWS);
        this.mgrLogic.addEventListener((evt) => {
            this.onLogicEvent(evt);
        });

        this.app.ticker.add(this.update, this);

        window.addEventListener('keydown', (evt) => {
            this.onKeyDown(evt.key);
        });

        this.textInfo = new Text('Press SPACE to start\n\n↑ : Rotation\n↓ : Drop\n→ : Right\n← : Left\nSPACE : Quick Drop', infoStyle);
        this.root.addChild(this.textInfo);
        this.textInfo.anchor.set(0.5);
        this.textInfo.position.x = CFG.DISPLAY.BG_WIDTH / 2;
        this.textInfo.position.y = CFG.DISPLAY.BG_HEIGHT / 2;

        this.textLevel = new Text('Level : 0', infoStyle);
        this.root.addChild(this.textLevel);
        this.textLevel.anchor.set(0, 0);
        this.textLevel.position.x = 0;
        this.textLevel.position.y = 30;

        this.textScore = new Text('Score : 0', infoStyle);
        this.root.addChild(this.textScore);
        this.textScore.anchor.set(1, 0);
        this.textScore.position.x = CFG.DISPLAY.BG_WIDTH;
        this.textScore.position.y = 30;

        sound.add('my-sound', 'da.mp3');
    }

    onResize() {
        let sw = this.app.renderer.width / CFG.DISPLAY.BG_WIDTH;
        let sh = this.app.renderer.height / CFG.DISPLAY.BG_HEIGHT;

        let scale = (sw > sh ? sh : sw);

        this.root.scale.x = scale;
        this.root.scale.y = scale;

        this.root.position.x = (this.app.renderer.width - CFG.DISPLAY.BG_WIDTH * scale) / 2;
        this.root.position.y = (this.app.renderer.height - CFG.DISPLAY.BG_HEIGHT * scale) / 2;
    }

    update(dt) {
        let dms = this.app.ticker.elapsedMS;

        this.mgrLogic.update(dms);

        if (this.mgrLogic.bRefresh) {
            let data = this.mgrLogic.getData();
            this.rendBoard.showBoardBlocks(data.board);
            this.rendBoard.showShadowBlocks(data.shadow);
            this.rendBoard.showShapeBlocks(data.lst);

            for (let ii = 0; ii < CFG.LOGIC.WAIT_NUMS; ++ii) {
                let waitrender = this.lstWaitRender[ii];
                waitrender.showBlocks(this.mgrLogic.getWaitBlocks(ii));
            }

            this.textInfo.visible = !this.mgrLogic.bGaming;
            this.textLevel.text = 'Level : ' + this.mgrLogic.iLevel;
            this.textScore.text = 'Score : ' + this.mgrLogic.iScore;
        }
    }

    onKeyDown(key) {
        if (!this.mgrLogic.bGaming) {
            if (key == CFG.KEY.START) {
                this.mgrLogic.start();
            }
        }
        else {
            let bsound = true;

            switch (key) {
                case CFG.KEY.QUICKDROP:
                    this.mgrLogic.quickDrop();

                    break;
                case CFG.KEY.LEFT:
                    this.mgrLogic.left();
                    break;
                case CFG.KEY.RIGHT:
                    this.mgrLogic.right();
                    break;
                case CFG.KEY.DROP:
                    this.mgrLogic.drop();
                    break;
                case CFG.KEY.ROTATE:
                    this.mgrLogic.rotate();
                    break;
                default:
                    bsound = false;
                    break;
            }

            if (bsound) {
                sound.play(CFG.SOUND.KEYDOWN);
            }
        }
    }

    onLogicEvent(evt) {
        switch (evt) {
            case 'destroy':
                sound.play(CFG.SOUND.DESTROY);
                break;
            case 'drop':
                sound.play(CFG.SOUND.DROP);
                break;
        }
    }
}
