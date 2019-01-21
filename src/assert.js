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
        if (!($.F[5] === `y`
                && $.B[2] === `w` && $.B[4] === `w` && $.B[5] === `w` && $.B[6] === `w` && $.B[8] === `w`
                && $.U[2] === $.U[5]
                && $.R[6] === $.R[5]
                && $.D[8] === $.D[5]
                && $.L[4] === $.L[5]
            )) {
            console.error(`Wrong white cross!`);
            logCube($);
            process.exit();
        }
    },
    whiteSide: function ($) {
        for (let i = 1; i <= 9; i++) {
            if ($.B[i] !== `w`) {
                console.error(`B isn't completely white!`);
                logCube($);
                process.exit();
            }
        }
    },
    ts: function ($) {
        this.whiteSide($);
        if (
            $.U[2] !== $.U[5]
            || $.R[6] !== $.R[5]
            || $.D[8] !== $.D[5]
            || $.L[4] !== $.L[5]
        ) {
            console.error(`T's aren't complete!`);
            logCube($);
            process.exit();
        }
    },
    firstAndSecondLayer: function ($) {
        this.ts($);

        for (let [sideName, indices] of Object.entries({
            U: [1, 2, 3, 4, 5, 6],
            R: [2, 3, 5, 6, 8, 9],
            D: [4, 5, 6, 7, 8, 9],
            L: [1, 2, 4, 5, 7, 8],
        })) {
            const side = $[sideName];
            indices.every((index) => {
                if (side[indices[0]] !== side[index]) {
                    console.error(`1 and 2 layers aren't complete!`);
                    logCube($);
                    process.exit();
                }
            })
        }
    },
    yellowCross: function ($) {
        this.firstAndSecondLayer($);
        if (!($.F[2] === `y` && $.F[4] === `y` && $.F[5] === `y` && $.F[6] === `y` && $.F[8] === `y`)) {
            console.error(`Wrong yellow cross!`);
            logCube($);
            process.exit();
        }
    },
    yellowCrossEdges: function ($) {
        this.yellowCross($);
        if (!($.U[5] === $.U[8] && $.R[5] === $.R[4] && $.D[5] === $.D[2] && $.L[5] === $.L[6])) {
            console.error(`Wrong yellow cross!`);
            logCube($);
            process.exit();
        }
    },
    yellowCrossEdgesAndCorners: function ($) {
        this.yellowCrossEdges($);
        if (![
                {
                    name: `FUL`,
                    A: [$.F[5], $.U[5], $.L[5]],
                    B: [$.F[1], $.U[7], $.L[3]]
                }, {
                    name: `FUR`,
                    A: [$.F[5], $.U[5], $.R[5]],
                    B: [$.F[3], $.U[9], $.R[1]]
                }, {
                    name: `FDL`,
                    A: [$.F[5], $.D[5], $.L[5]],
                    B: [$.F[7], $.D[1], $.L[9]]
                }, {
                    name: `FDR`,
                    A: [$.F[5], $.D[5], $.R[5]],
                    B: [$.F[9], $.D[3], $.R[7]]
                },
            ].every((o) => {
                return o.A.every((x) => {
                    return o.B.includes(x);
                });
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
