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
                console.error(`U isn't completely white!`);
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
                    console.error(`T's aren't complete!`);
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
                    console.error(`1 and 2 layers aren't complete!`);
                    logCube($);
                    process.exit();
                }
            }
        });
    },
    yellowCross: function ($) {
        this.firstAndSecondLayer($);
        if (!($.D[5] === `y` && $.D[2] === `y` && $.D[4] === `y` && $.D[6] === `y` && $.D[8] === `y`)) {
            console.error(`Wrong yellow cross!`);
            logCube($);
            process.exit();
        }
    },
    yellowCrossEdges: function ($) {
        this.yellowCross($);
        if (!($.F[5] === $.F[8] && $.R[5] === $.R[8] && $.B[5] === $.B[8] && $.L[5] === $.L[8])) {
            console.error(`Wrong yellow cross!`);
            logCube($);
            process.exit();
        }
    },
    yellowCrossEdgesAndCorners: function ($) {
        this.yellowCross($);
        if ([
                {A: $.F, B: $.R, C: 3},
            ].some((corner) => {
                return (!(
                    corner.A[5] === corner.A[9] || corner.A[5] === corner.B[7] || corner.A[5] === $.D[corner.C])
                    && (corner.B[5] === corner.A[9] || corner.B[5] === corner.B[7] || corner.B[5] === $.D[corner.C])
                    && (`y` === corner.A[9] || `y` === corner.B[7] || `y` === $.D[corner.C]));
            })) {
            console.error(`Wrong yellow corners position!`);
            logCube($);
            process.exit();
        }
    },
    cube: function ($) {
        [$.F, $.B, $.L, $.R, $.U, $.D].forEach((side) => {
            for (let i = 1; i <= 9; i++) {
                if (side[i] !== side[5]) {
                    console.error(`Cube isn't complete!`);
                    logCube($);
                    process.exit();
                }
            }
        });
    },
}
