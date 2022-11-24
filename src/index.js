import { Application, Assets } from 'pixi.js';
import { sound } from '@pixi/sound';

import CFG from './Config';
import Game from './Game';

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const app = new Application({ width: windowWidth, height: windowHeight });
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0x1E2C52;

let game = new Game(app);

loadResource();

async function loadResource() {
    for (let item in CFG.SOUND) {
        sound.add(CFG.SOUND[item], CFG.SOUND[item]);
    }

    await Assets.load(CFG.RESOURCE);
    game.run();
}

window.addEventListener('resize', function () {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    app.renderer.autoResize = true;
    app.renderer.resize(windowWidth, windowHeight);

    game.onResize();
})
