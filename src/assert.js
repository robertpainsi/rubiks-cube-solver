'use strict';

import {logCube} from "./utils";

console.error = function (...args) {
    console.log(`\x1b[31m${[...args].join(` `)}\x1b[0m`);
};

export default {
    whiteDaisy: function ($) {
        if (!($.F[5] === `y` && $.F[2] === `w` && $.F[4] === `w` && $.F[6] === `w` && $.F[8] === `w`)) {
            console.error(`Wrong white daisy!`);
            logCube($);
            process.exit();
        }
    },
    whiteCross: function ($) {
        if (!($.D[5] === `y`
                && $.U[2] === `w` && $.U[4] === `w` && $.U[5] === `w` && $.U[6] === `w` && $.U[8] === `w`
                && $.F[2] === $.F[5]
                && $.B[2] === $.B[5]
                && $.L[2] === $.L[5]
                && $.R[2] === $.R[5]
            )) {
            console.error(`Wrong white cross!`);
            logCube($);
            process.exit();
        }
    },
    whiteSide: function ($) {
        for (let i = 1; i <= 9; i++) {
            if ($.U[i] !== `w`) {
                console.error(`U isn't completely white`);
                logCube($);
                process.exit();
            }
        }
    },
    ts: function ($) {
        this.whiteSide($);
        [$.F, $.B, $.L, $.R].forEach((side) => {
            for (let i = 1; i <= 3; i++) {
                if (side[i] !== side[5]) {
                    console.error(`T's aren't complete`);
                    logCube($);
                    process.exit();
                }
            }
        });
    },
    firstAndSecondLayer: function ($) {
        this.whiteSide($);
        [$.F, $.B, $.L, $.R].forEach((side) => {
            for (let i = 1; i <= 6; i++) {
                if (side[i] !== side[5]) {
                    console.error(`1 and 2 layers aren't complete`);
                    logCube($);
                    process.exit();
                }
            }
        });
    },
    cube: function ($) {
        [$.F, $.B, $.L, $.R, $.U, $.D].forEach((side) => {
            for (let i = 1; i <= 9; i++) {
                if (side[i] !== side[5]) {
                    console.error(`Cube isn't complete`);
                    logCube($);
                    process.exit();
                }
            }
        });
    },
}
