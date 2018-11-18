'use strict';

import colorize from "./colorize";

const {red, blue, green, orange, yellow} = colorize;

console.error = function (...args) {
    console.log(`\x1b[31m`, ...args, `\x1b[0m`);
};

export const logCube = ($) => {
    const sideToArray = (side) => {
        const result = [];
        result.push(side.slice(1, 4));
        result.push(side.slice(4, 7));
        result.push(side.slice(7, 10));
        result[2][2] = side[9];
        return result;
    };
    // const cube = {
    //     F: sideToArray($.F),
    //     B: sideToArray($.B),
    //     L: sideToArray($.L),
    //     R: sideToArray($.R),
    //     U: sideToArray($.U),
    //     D: sideToArray($.D),
    // };
    // console.log(cube);

    for (let i = 0; i < 3; i++) {
        let line = ``;
        [`F`, `R`, `B`, `L`, `D`, `U`].forEach((sideName) => {
            line += colorizeBlock(` ${(i === 0) ? `${sideName}` : ` `}|${sideToArray($[sideName])[i].join(' ')}|`);
        });
        console.log(line);
    }
    console.log();
};

export const colorizeBlock = (b) => {
    return b
        .replace(/r/g, red(`r`))
        .replace(/g/g, green(`g`))
        .replace(/b/g, blue(`b`))
        .replace(/y/g, yellow(`y`))
        .replace(/o/g, orange(`o`));
};
