'use strict';

import {createList, repeat} from "./pocket-code";
import {colorizeBlock, logCube, shuffle} from "./utils";
import assert from "./assert";

const debug = {
    operations: {
        makeDaisy: 0,
        finishWhiteCross: 0,
        finishWhiteFace: 0,
        finishSecondLayer: 0,
        finishYellowCross: 0,
        finishYellowEdges: 0,
        moveYellowCornersToTheirPlaces: 0,
        orientYellowCorners: 0,
        total: 0,
    },
    currentOperation: ``,
};

const FORWARD_TIME = 3;
const BACKWARD_TIME = 5;
const ROTATE_TIME = 7;

const CUBE_TIME = 1;
// const CUBE_TIME = 3 * FORWARD_TIME + 3 * BACKWARD_TIME + 3 * ROTATE_TIME;
const FACE_TIME = 1;
// const FACE_TIME = 1 * FORWARD_TIME + 1 * BACKWARD_TIME + 2 * ROTATE_TIME;

/** Program variables/lists */
const $ = {
    F: createList(),
    B: createList(),
    L: createList(),
    R: createList(),
    U: createList(),
    D: createList(),

    FB: createList(),
    BB: createList(),
    LB: createList(),
    RB: createList(),
    UB: createList(),
    DB: createList(),

    horizontalEdges: createList(),

    moveFaceToFColor: 0,
};

const W = 1;
const Y = 10;
const O = 100;
const R = 1000;
const G = 10000;
const B = 100000;

/** Motor commands handler */
const MotorF_cw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`MotorF_cw`);
        debug.operations[debug.currentOperation] += CUBE_TIME;
    }
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            let oppositeIndex = 9 - (index - 1);
            let cwIndex = k * 3 - (i - 1);
            let ccwIndex = 9 - (3 * (k - 1)) - (3 - i);

            $.FB[cwIndex] = $.F[index];
            $.RB[cwIndex] = $.U[index];
            $.BB[ccwIndex] = $.B[index];
            $.LB[cwIndex] = $.D[index];
            $.UB[cwIndex] = $.L[index];
            $.DB[cwIndex] = $.R[index];
        }
    }
    restoreCube();
};
const MotorF_ccw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`MotorF_ccw`);
        debug.operations[debug.currentOperation] += CUBE_TIME;
    }
    MotorF_cw(true);
    MotorF_cw(true);
    MotorF_cw(true);
};

const MotorB_cw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`MotorB_cw`);
        debug.operations[debug.currentOperation] += CUBE_TIME;
    }
    MotorF_ccw(true);
};
const MotorB_ccw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`MotorB_ccw`);
        debug.operations[debug.currentOperation] += CUBE_TIME;
    }
    MotorF_cw(true);
};

const MotorR_cw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`MotorR_cw`);
        debug.operations[debug.currentOperation] += CUBE_TIME;
    }
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            let oppositeIndex = 9 - (index - 1);
            let cwIndex = k * 3 - (i - 1);
            let ccwIndex = 9 - (3 * (k - 1)) - (3 - i);

            $.FB[index] = $.D[index];
            $.RB[cwIndex] = $.R[index];
            $.BB[oppositeIndex] = $.U[index];
            $.LB[ccwIndex] = $.L[index];
            $.UB[index] = $.F[index];
            $.DB[oppositeIndex] = $.B[index];
        }
    }
    restoreCube();
};
const MotorR_ccw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`MotorR_ccw`);
        debug.operations[debug.currentOperation] += CUBE_TIME;
    }
    MotorR_cw(true);
    MotorR_cw(true);
    MotorR_cw(true);
};

const MotorL_cw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`MotorL_cw`);
        debug.operations[debug.currentOperation] += CUBE_TIME;
    }
    MotorR_ccw(true);
};
const MotorL_ccw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`MotorL_ccw`);
        debug.operations[debug.currentOperation] += CUBE_TIME;
    }
    MotorR_cw(true);
};

const F_cw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`F_cw`);
        debug.operations[debug.currentOperation] += FACE_TIME;
    }
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            let oppositeIndex = 9 - (index - 1);
            let cwIndex = k * 3 - (i - 1);
            let ccwIndex = 9 - (3 * (k - 1)) - (3 - i);

            $.FB[cwIndex] = $.F[index];
        }
    }
    $.RB[1] = $.U[7];
    $.RB[4] = $.U[8];
    $.RB[7] = $.U[9];

    $.UB[7] = $.L[9];
    $.UB[8] = $.L[6];
    $.UB[9] = $.L[3];

    $.LB[3] = $.D[1];
    $.LB[6] = $.D[2];
    $.LB[9] = $.D[3];

    $.DB[1] = $.R[7];
    $.DB[2] = $.R[4];
    $.DB[3] = $.R[1];
    restoreCube();
};
const F_ccw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`F_ccw`);
        debug.operations[debug.currentOperation] += FACE_TIME;
    }
    F_cw(true);
    F_cw(true);
    F_cw(true);
};

const B_cw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`B_cw`);
        debug.operations[debug.currentOperation] += FACE_TIME;
    }
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            let oppositeIndex = 9 - (index - 1);
            let cwIndex = k * 3 - (i - 1);
            let ccwIndex = 9 - (3 * (k - 1)) - (3 - i);

            $.BB[cwIndex] = $.B[index];
        }
    }
    $.RB[3] = $.D[9];
    $.RB[6] = $.D[8];
    $.RB[9] = $.D[7];

    $.UB[1] = $.R[3];
    $.UB[2] = $.R[6];
    $.UB[3] = $.R[9];

    $.LB[1] = $.U[3];
    $.LB[4] = $.U[2];
    $.LB[7] = $.U[1];

    $.DB[7] = $.L[1];
    $.DB[8] = $.L[4];
    $.DB[9] = $.L[7];
    restoreCube();
};
const B_ccw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`B_ccw`);
        debug.operations[debug.currentOperation] += FACE_TIME;
    }
    B_cw(true);
    B_cw(true);
    B_cw(true);
};

const R_cw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`R_cw`);
        debug.operations[debug.currentOperation] += FACE_TIME;
    }
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            let oppositeIndex = 9 - (index - 1);
            let cwIndex = k * 3 - (i - 1);
            let ccwIndex = 9 - (3 * (k - 1)) - (3 - i);

            $.RB[cwIndex] = $.R[index];
        }
    }
    $.FB[3] = $.D[3];
    $.FB[6] = $.D[6];
    $.FB[9] = $.D[9];

    $.UB[3] = $.F[3];
    $.UB[6] = $.F[6];
    $.UB[9] = $.F[9];

    $.BB[1] = $.U[9];
    $.BB[4] = $.U[6];
    $.BB[7] = $.U[3];

    $.DB[3] = $.B[7];
    $.DB[6] = $.B[4];
    $.DB[9] = $.B[1];
    restoreCube();
};
const R_ccw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`R_ccw`);
        debug.operations[debug.currentOperation] += FACE_TIME;
    }
    R_cw(true);
    R_cw(true);
    R_cw(true);
};

const L_cw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`L_cw`);
        debug.operations[debug.currentOperation] += FACE_TIME;
    }
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            let oppositeIndex = 9 - (index - 1);
            let cwIndex = k * 3 - (i - 1);
            let ccwIndex = 9 - (3 * (k - 1)) - (3 - i);

            $.LB[cwIndex] = $.L[index];
        }
    }
    $.FB[1] = $.U[1];
    $.FB[4] = $.U[4];
    $.FB[7] = $.U[7];

    $.UB[1] = $.B[9];
    $.UB[4] = $.B[6];
    $.UB[7] = $.B[3];

    $.BB[3] = $.D[7];
    $.BB[6] = $.D[4];
    $.BB[9] = $.D[1];

    $.DB[1] = $.F[1];
    $.DB[4] = $.F[4];
    $.DB[7] = $.F[7];
    restoreCube();
};
const L_ccw = (alreadyLogged) => {
    if (!alreadyLogged) {
        console.log(`L_ccw`);
        debug.operations[debug.currentOperation] += FACE_TIME;
    }
    L_cw(true);
    L_cw(true);
    L_cw(true);
};

/** Motor command utils */
const moveFaceToF = () => {
    if ($.F[5] === $.moveFaceToFColor) {
        return;
    }

    if ($.B[5] === $.moveFaceToFColor) {
        MotorR_cw();
        MotorR_cw();
        return;
    }

    repeat(2, () => {
        if ($.U[5] === $.moveFaceToFColor) {
            MotorR_ccw();
            return true;
        }
        if ($.D[5] === $.moveFaceToFColor) {
            MotorR_cw();
            return true;
        }
        MotorF_cw();
    });
};

/** Data utils */
const backupCube = () => {
    for (let i = 1; i <= 9; i++) {
        $.FB[i] = $.F[i];
        $.BB[i] = $.B[i];
        $.LB[i] = $.L[i];
        $.RB[i] = $.R[i];
        $.UB[i] = $.U[i];
        $.DB[i] = $.D[i];
    }
};

const restoreCube = () => {
    for (let i = 1; i <= 9; i++) {
        $.F[i] = $.FB[i];
        $.B[i] = $.BB[i];
        $.L[i] = $.LB[i];
        $.R[i] = $.RB[i];
        $.U[i] = $.UB[i];
        $.D[i] = $.DB[i];
    }
};

/** Main logic */
const main = () => {
    const RUNS = 1;
    for (let run = 1; run <= RUNS; run++) {
        console.log(`RUN #${run} ------------------------------------------------------------------------------------`);
        setup();
        readCubeColors();
        makeDaisy();
        finishWhiteCross();
        finishWhiteFace();
        finishSecondLayer();
        finishYellowCross();
        finishYellowEdges();
        moveYellowCornersToTheirPlaces();
        orientYellowCorners();

        assert.cube($);
    }

    for (let [key, value] of Object.entries(debug.operations)) {
        if (key === `total`) {
            continue;
        }
        debug.operations.total += value;
    }

    for (let [key, value] of Object.entries(debug.operations)) {
        console.log(`${(value / RUNS)} operations for ${key}`);
    }
};

/** Step: Setup */
const setup = () => {
    for (let i = 1; i <= 9; i++) {
        $.F[i] = W;
        $.B[i] = Y;
        $.L[i] = B;
        $.R[i] = G;
        $.U[i] = R;
        $.D[i] = O;

        $.FB[i] = $.F[i];
        $.BB[i] = $.B[i];
        $.LB[i] = $.L[i];
        $.RB[i] = $.R[i];
        $.UB[i] = $.U[i];
        $.DB[i] = $.D[i];
    }
    backupCube();

    $.horizontalEdges.push(B);
    $.horizontalEdges.push(O);
    $.horizontalEdges.push(O);
    $.horizontalEdges.push(G);
    $.horizontalEdges.push(G);
    $.horizontalEdges.push(R);
    $.horizontalEdges.push(R);
    $.horizontalEdges.push(B);
};

/** Step: Read cube colors */
const readCubeColors = () => {
    // TODO: Only for Javascript testing. Remove in Pocket Code.
    console.log(`Shuffle cube`);
    shuffle($, [
        F_cw, F_ccw, MotorF_cw, MotorF_ccw,
        B_cw, B_ccw, MotorB_cw, MotorB_ccw,
        L_cw, L_ccw, MotorL_cw, MotorL_ccw,
        R_cw, R_ccw, MotorR_cw, MotorR_ccw,
    ]);
    logCube($);
};

/** Step: Make daisy */
const makeDaisy = () => {
    debug.currentOperation = `makeDaisy`;
    console.log(`Make daisy`);
    moveFaceToF($.moveFaceToFColor = Y);
    while ($.F[2] !== W || $.F[4] !== W || $.F[6] !== W || $.F[8] !== W) {
        if ($.U[6] === W || $.D[6] === W || $.B[4] === W) {
            while ($.F[6] === W) {
                F_cw();
            }
            while ($.F[6] !== W) {
                R_cw();
            }
        }

        if ($.R[4] === W) {
            R_cw();
        } else if ($.R[6] === W) {
            while ($.F[6] === W) {
                F_cw();
            }
            R_cw();
        }

        MotorF_cw();
    }
    logCube($);

    assert.whiteDaisy($);
};

/** Step: Finish white cross */
const finishWhiteCross = () => {
    debug.currentOperation = `finishWhiteCross`;
    console.log(`Finish white cross`);
    while ($.F[2] === W || $.F[4] === W || $.F[6] === W || $.F[8] === W) {
        logCube($);

        while ($.R[5] !== $.R[6] || $.B[4] !== W) {
            if ($.F[6] === W && $.R[4] === $.R[5]) {
                R_cw();
                R_cw();
            }
            if ($.F[2] === W && $.U[8] === $.R[5]) {
                F_cw();
            } else {
                F_ccw();
            }
        }
        MotorF_cw();
    }
    logCube($);

    assert.whiteCross($);
};

/** Step: Finish white face */
const finishWhiteFace = () => {
    debug.currentOperation = `finishWhiteFace`;
    console.log(`Finish white face`);
    for (let i = 1; i <= 4; i++) {
        const c1 = $.horizontalEdges[(i - 1) * 2 + 1];
        const c2 = $.horizontalEdges[(i - 1) * 2 + 2];
        const piece = W + c1 + c2;

        console.log(`Finish white corners`, colorizeBlock(c1), colorizeBlock(c2));
        logCube($);

        console.log(`Move away from white face`);
        if (
            piece === $.B[7] + $.R[9] + $.D[9] ||
            piece === $.B[1] + $.R[3] + $.U[3] ||
            piece === $.B[9] + $.L[7] + $.D[7] ||
            piece === $.B[3] + $.L[1] + $.U[1]
        ) {
            repeat(4, () => {
                if (piece === $.B[7] + $.R[9] + $.D[9]) {
                    R_cw();
                    F_cw();
                    R_ccw();
                } else {
                    MotorF_cw();
                }
            })
        }

        console.log(`Colored corner on correct faces, F,U,R = F,R,w`);
        while ($.R[5] !== c1) {
            MotorF_cw();
        }
        logCube($);
        while (piece !== $.F[9] + $.D[3] + $.R[7]) {
            F_cw();
            logCube($);
        }
        logCube($);

        console.log(`Fix white corner`);
        if ($.D[3] === W) {
            F_cw();
            R_cw();
            F_ccw();
            R_ccw();
        } else if ($.R[7] === W) {
            R_cw();
            F_cw();
            R_ccw();
        } else {
            F_cw();
            R_cw();
            F_ccw();
            F_ccw();
            R_ccw();
            F_cw();
            R_cw();
            F_ccw();
            R_ccw();
        }
        logCube($);

        assert.whiteCross($);
    }

    assert.ts($);
};

/** Step: Finish second layer */
const finishSecondLayer = () => {
    debug.currentOperation = `finishSecondLayer`;
    console.log(`Finish second layer`);
    for (let i = 1; i <= 4; i++) {
        const c1 = $.horizontalEdges[(i - 1) * 2 + 1];
        const c2 = $.horizontalEdges[(i - 1) * 2 + 2];
        const piece = c1 + c2;

        console.log(`Finish second layer colors`, colorizeBlock(c1), colorizeBlock(c2));
        logCube($);

        if (
            piece === $.R[8] + $.D[6] ||
            piece === $.R[2] + $.U[6] ||
            piece === $.L[8] + $.D[4] ||
            piece === $.L[2] + $.U[4]
        ) {
            repeat(4, () => {
                if (piece === $.R[8] + $.D[6]) {
                    R_cw();
                    F_cw();
                    R_ccw();
                    F_ccw();

                    R_cw();
                    F_cw();
                    R_ccw();
                    F_ccw();

                    F_cw();
                    F_cw();

                    R_cw();
                    F_ccw();
                    R_ccw();
                    F_cw();

                    R_cw();
                    F_ccw();
                    R_ccw();
                    F_cw();
                } else {
                    MotorF_cw();
                }
            });
        }

        while (piece !== $.F[8] + $.D[2]) {
            F_cw();
        }
        while ($.D[2] !== $.D[5]) {
            MotorF_cw();
            F_ccw();
        }

        if ($.R[5] === c1 || $.R[5] === c2) {
            // U R U' R'
            F_cw();
            R_cw();
            F_ccw();
            R_ccw();

            // U' F' U F
            MotorF_ccw();
            F_ccw();
            R_ccw();
            F_cw();
            R_cw();
            MotorF_cw();
        } else if ($.L[5] === c1 || $.L[5] === c2) {
            // U' L' U L
            F_ccw();
            L_ccw();
            F_cw();
            L_cw();

            // U F U' F'
            MotorF_ccw();
            F_cw();
            R_cw();
            F_ccw();
            R_ccw();
            MotorF_cw();
        }

        assert.ts($);
    }
    logCube($);

    assert.firstAndSecondLayer($);
};

/** Step: Finish yellow cross */
const finishYellowCross = () => {
    debug.currentOperation = `finishYellowCross`;
    console.log(`Finish yellow cross`);
    while (
        $.F[2] !== Y
        || $.F[4] !== Y
        || $.F[6] !== Y
        || $.F[8] !== Y
        ) {

        while (($.F[2] === Y && $.F[8] === Y)
        || ($.F[2] === Y && $.F[6] === Y)
        || ($.F[4] === Y && $.F[8] === Y)
        || ($.F[6] === Y && $.F[8] === Y)) {
            F_cw();
        }

        MotorR_cw();
        F_cw();
        MotorR_ccw();
        R_cw();
        F_cw();
        R_ccw();
        F_ccw();
        MotorR_cw();
        F_ccw();
        MotorR_ccw();

        assert.firstAndSecondLayer($);
    }
    logCube($);

    assert.yellowCross($);
};

/** Step: Finish yellow edges */
const finishYellowEdges = () => {
    debug.currentOperation = `finishYellowEdges`;
    console.log(`Finish yellow edges`);
    while (!($.U[8] === $.U[5] && $.R[4] === $.R[5] && $.D[2] === $.D[5] && $.L[6] === $.L[5])) {
        if ($.D[2] !== $.D[5]) {
            console.log(`Swap edges`);
            // R U R' U
            R_cw();
            F_cw();
            R_ccw();
            F_cw();

            // R U2 R' U
            R_cw();
            F_cw();
            F_cw();
            R_ccw();
            F_cw();

            logCube($);
        }
        console.log(`Rotate cube`);
        MotorF_cw();
        logCube($);

        assert.yellowCross($);
    }
    logCube($);

    assert.yellowCrossEdges($);
};

/** Step: Move yellow corners to their places */
const moveYellowCornersToTheirPlaces = () => {
    debug.currentOperation = `moveYellowCornersToTheirPlaces`;
    console.log(`Move corners to their places`);
    repeat(3, () => {
        repeat(4, () => {
            if (!(
                ($.R[5] === $.F[9] || $.R[5] === $.R[7] || $.R[5] === $.D[3])
                && ($.D[5] === $.F[9] || $.D[5] === $.R[7] || $.D[5] === $.D[3])
            )) {
                MotorF_cw();
            }
        });

        if (!(
            ($.U[5] === $.F[1] || $.U[5] === $.U[7] || $.U[5] === $.L[3])
            && ($.L[5] === $.F[1] || $.L[5] === $.U[7] || $.L[5] === $.L[3])
        )) {
            F_cw();
            R_cw();
            F_ccw();
            L_ccw();
            F_cw();
            R_ccw();
            F_ccw();
            L_cw();
        }
    });
    logCube($);

    console.log(`Corners: FUL(${colorizeBlock($.F[1])}${colorizeBlock($.U[7])}${colorizeBlock($.L[3])})`
        + ` FRU(${colorizeBlock($.F[3])}${colorizeBlock($.R[1])}${colorizeBlock($.U[9])})`
        + ` FLD(${colorizeBlock($.F[7])}${colorizeBlock($.L[9])}${colorizeBlock($.D[1])})`
        + ` FDR(${colorizeBlock($.F[9])}${colorizeBlock($.D[3])}${colorizeBlock($.R[7])})`
    );
    assert.yellowCrossEdgesAndCorners($);
};

/** Step: Orient yellow corners */
const orientYellowCorners = () => {
    debug.currentOperation = `orientYellowCorners`;
    console.log(`Orient yellow corners`);
    while (!($.F[1] === Y && $.F[3] === Y && $.F[7] === Y && $.F[9] === Y)) {
        console.log(`Orient yellow corner`);
        logCube($);
        repeat(4, () => {
            if ($.F[9] !== Y) {
                // R' D' R D
                R_ccw();
                B_ccw();
                R_cw();
                B_cw();
            }
        });
        logCube($);

        console.log(`Rotate to next yellow corner not facing correctly`);
        repeat(4, () => {
            if ($.F[9] === Y) {
                F_cw();
            }
        });
        logCube($);
    }
    while ($.R[4] !== $.R[5]) {
        F_cw();
    }
    console.log(`Done`);
    logCube($);

    assert.cube($);
};

main();
