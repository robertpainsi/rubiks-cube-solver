'use strict';

import colorize from "./colorize";

const {red, blue, green, orange, yellow} = colorize;

const sideToArray = (side) => {
    const result = [];
    result.push(side.slice(1, 4));
    result.push(side.slice(4, 7));
    result.push(side.slice(7, 10));
    result[2][2] = side[9]; // slice doesn't work for list (proxied array) with the last element.
    return result;
};

export const logCube = ($) => {
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

export const shuffle = ($, executeCommands) => {
    const commandsPool = [`TA`, `TB`, `TAHB`, `TBHA`];
    const commands = [];
    for (let i = 0; i < 128; i++) {
        commands.push(commandsPool[Math.floor(Math.random() * commandsPool.length)]);
    }
    $.commandText = commands.join(` `);
    executeCommands();
};
