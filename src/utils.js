'use strict';

import colorize from "./colorize";

const {red, blue, green, orange, yellow} = colorize;

export const logCube = ($) => {
    for (let i = 0; i < 3; i++) {
        let line = ``;
        [`F`, `R`, `B`, `L`, `U`, `D`].forEach((sideName) => {
            line += colorizeBlock(` ${(i === 0) ? `${sideName}` : ` `}|${sideToArray($[sideName])[i].join(' ')}|`);
        });
        console.log(line);
    }
    console.log();
};

const sideToArray = (side) => {
    const result = [];
    result.push([side[1] || ' ', side[2] || ' ', side[3] || ' ']);
    result.push([side[4] || ' ', side[5] || ' ', side[6] || ' ']);
    result.push([side[7] || ' ', side[8] || ' ', side[9] || ' ']);
    return result;
};


const W = 1;
const Y = 10;
const O = 100;
const R = 1000;
const G = 10000;
const B = 100000;

export const colorizeBlock = (b) => {
    return b.toString()
        .replace(/100000/g, `b`)
        .replace(/10000/g, `g`)
        .replace(/1000/g, `r`)
        .replace(/100/g, `o`)
        .replace(/10/g, `y`)
        .replace(/1/g, `w`)
        .replace(/b/g, blue(`b`))
        .replace(/g/g, green(`g`))
        .replace(/r/g, red(`r`))
        .replace(/o/g, orange(`o`))
        .replace(/y/g, yellow(`y`));
};

export const shuffle = ($, commands) => {
    for (let i = 0; i < 128; i++) {
        commands[Math.floor(Math.random() * commands.length)](true);
    }
};
