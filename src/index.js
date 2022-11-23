import { Application, Assets } from 'pixi.js';

import CFG from './Config';
import Game from './Game';

const app = new Application({width: CFG.DISPLAY.BG_WIDTH, height: CFG.DISPLAY.BG_HEIGHT});
document.body.appendChild(app.view);

let game = new Game(app);

loadResource();

async function loadResource() {
    await Assets.load(CFG.RESOURCE);
    game.run();
}
