'use strict';

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
        [`F`, `B`, `L`, `R`, `U`, `D`].forEach((sideName) => {
            line += `   ${(i === 0) ? `${sideName}` : ` `}|${sideToArray($[sideName])[i].join(' ')}|`
                .replace(/r/g, `\x1b[31mr\x1b[0m`)
                .replace(/g/g, `\x1b[32mg\x1b[0m`)
                .replace(/b/g, `\x1b[34mb\x1b[0m`)
                .replace(/y/g, `\x1b[33my\x1b[0m`)
                .replace(/o/g, `\x1b[36mo\x1b[0m`);
        });
        console.log(line);
    }
    console.log();
};
