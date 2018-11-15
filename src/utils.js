'use strict';

export const logCube = ($) => {
    const sideToArray = (side) => {
        const result = [];
        result.push(side.slice(1, 4));
        result.push(side.slice(4, 7));
        result.push(side.slice(7, 10));
        result[2][2] = side[9];
        return result;
    };
    const cube = {
        F: sideToArray($.F),
        B: sideToArray($.B),
        L: sideToArray($.L),
        R: sideToArray($.R),
        U: sideToArray($.U),
        D: sideToArray($.D),
    };
    console.log(cube);
    console.log();
};
