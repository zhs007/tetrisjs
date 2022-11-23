
export const DISPLAY = {
    BLOCK_SIZE: 42,
    BG_WIDTH: 640,
    BG_HEIGHT: 960,
    BLOCK_BX: 9,
    BLOCK_BY: 111,
    BLOCK_XSP: 0,
    BLOCK_YSP: 0,
    WAIT_WIDTH: 110,
    WAIT_HEIGHT: 110,
    WAIT_X: [481, 481, 481, 481, 481],
    WAIT_Y: [726, 589, 463, 337, 211],
    WAIT_SCALE: 0.65
}

export const RESOURCE = "assets.json";

export const IMAGE_NAME = {
    BG: "bg_full.jpg",
    BLOCKS: ["block_green.png","block_orange.png","block_violet.png","block_light_blue.png","block_blue.png","block_red.png","block_pink.png"]
}

export const KEY = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DROP: 'ArrowDown',
    ROTATE: 'ArrowUp',
    START: ' '
}

const SHAPE0 = [
        [   [1,0,0],
            [1,1,0],
            [0,1,0]     ],
        [   [0,0,0],
            [0,1,1],
            [1,1,0]     ]];

const  SHAPE1 = [
    [   [2,2],
        [2,2,]      ]];

const SHAPE2 = [
    [   [0,0,0,0],
        [3,3,3,3],
        [0,0,0,0],
        [0,0,0,0]       ],
    [   [0,3,0,0],
        [0,3,0,0],
        [0,3,0,0],
        [0,3,0,0]       ]];

const SHAPE3 = [
    [   [0,0,4],
        [0,4,4],
        [0,0,4]     ],
    [   [0,0,0],
        [0,4,0],
        [4,4,4]     ],
    [   [4,0,0],
        [4,4,0],
        [4,0,0]     ],
    [   [4,4,4],
        [0,4,0],
        [0,0,0]     ]];

const SHAPE4 = [
    [   [5,5,5],
        [5,0,0],
        [0,0,0]     ],
    [   [0,5,5],
        [0,0,5],
        [0,0,5]     ],
    [   [0,0,0],
        [0,0,5],
        [5,5,5]     ],
    [   [5,0,0],
        [5,0,0],
        [5,5,0]     ]];

const SHAPE5 = [
    [   [0,0,0],
        [6,6,0],
        [0,6,6]     ],
    [   [0,0,6],
        [0,6,6],
        [0,6,0]     ]];

const SHAPE6 = [
    [   [7,7,7],
        [0,0,7],
        [0,0,0]     ],
    [   [0,0,7],
        [0,0,7],
        [0,7,7]     ],
    [   [0,0,0],
        [7,0,0],
        [7,7,7]     ],
    [   [7,7,0],
        [7,0,0],
        [7,0,0]     ]];

export const LOGIC = {
    COLS: 10,
    ROWS: 20,
    SHAPES: [SHAPE0, SHAPE1, SHAPE2, SHAPE3, SHAPE4, SHAPE5, SHAPE6],
    WAIT_NUMS: 5,
    MAX_SPEED: 1000,
    MIN_SPEED: 100,
    CHG_SPEED: 100,
    CHG_SCORE: 10,
}



export default {DISPLAY, RESOURCE, IMAGE_NAME, KEY, LOGIC};
