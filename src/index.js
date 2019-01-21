'use strict';

import {createList, repeat} from "./pocket-code";
import {colorizeBlock, logCube, shuffle} from "./utils";
import assert from "./assert";

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

/** Command handler */
const MotorF_cw = (foo) => {
    if (!foo) console.log(`MotorF_cw`);
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
const MotorF_ccw = (foo) => {
    if (!foo) console.log(`MotorF_ccw`);
    MotorF_cw(true);
    MotorF_cw(true);
    MotorF_cw(true);
};

const MotorB_cw = (foo) => {
    if (!foo) console.log(`MotorB_cw`);
    MotorF_ccw(true);
};
const MotorB_ccw = (foo) => {
    if (!foo) console.log(`MotorB_ccw`);
    MotorF_cw(true);
};

const MotorR_cw = (foo) => {
    if (!foo) console.log(`MotorR_cw`);
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
const MotorR_ccw = (foo) => {
    if (!foo) console.log(`MotorR_ccw`);
    MotorR_cw(true);
    MotorR_cw(true);
    MotorR_cw(true);
};

const MotorL_cw = (foo) => {
    if (!foo) console.log(`MotorL_cw`);
    MotorR_ccw(true);
};
const MotorL_ccw = (foo) => {
    if (!foo) console.log(`MotorL_ccw`);
    MotorR_cw(true);
};

const F_cw = (foo) => {
    if (!foo) console.log(`F_cw`);
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
const F_ccw = (foo) => {
    if (!foo) console.log(`F_ccw`);
    F_cw(true);
    F_cw(true);
    F_cw(true);
};

const B_cw = (foo) => {
    if (!foo) console.log(`B_cw`);
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
const B_ccw = (foo) => {
    if (!foo) console.log(`B_ccw`);
    B_cw(true);
    B_cw(true);
    B_cw(true);
};

const R_cw = (foo) => {
    if (!foo) console.log(`R_cw`);
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
const R_ccw = (foo) => {
    if (!foo) console.log(`R_ccw`);
    R_cw(true);
    R_cw(true);
    R_cw(true);
};

const L_cw = (foo) => {
    if (!foo) console.log(`L_cw`);
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
const L_ccw = (foo) => {
    if (!foo) console.log(`L_ccw`);
    L_cw(true);
    L_cw(true);
    L_cw(true);
};

/** Command utils */
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

const righty = () => {
    R_cw();
    F_cw();
    R_ccw();
    F_ccw();
};
const lefty = () => {
    L_ccw();
    F_cw();
    L_cw();
    F_ccw();
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
    for (let run = 1; run <= 1; run++) {
        console.log(`RUN #${run} ------------------------------------------------------------------------------------`);
        setup();
        readCubeColors();
        logCube($);
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
};

/** Step: Setup */
const setup = () => {
    for (let i = 1; i <= 9; i++) {
        $.F[i] = `w`;
        $.B[i] = `y`;
        $.L[i] = `b`;
        $.R[i] = `g`;
        $.U[i] = `r`;
        $.D[i] = `o`;
    }
    backupCube();

    $.horizontalEdges.push(`b`);
    $.horizontalEdges.push(`o`);
    $.horizontalEdges.push(`o`);
    $.horizontalEdges.push(`g`);
    $.horizontalEdges.push(`g`);
    $.horizontalEdges.push(`r`);
    $.horizontalEdges.push(`r`);
    $.horizontalEdges.push(`b`);
};

/** Step: Read cube colors */
const readCubeColors = () => {
    // TODO: Only for Javascript testing. Remove block on Catrobat.
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
    console.log(`Make daisy`);
    moveFaceToF($.moveFaceToFColor = `y`);
    while ($.F[2] !== `w` || $.F[4] !== `w` || $.F[6] !== `w` || $.F[8] !== `w`) {
        if ($.U[6] === `w` || $.D[6] === `w` || $.B[4] === `w`) {
            while ($.F[6] === `w`) {
                F_cw();
            }
            while ($.F[6] !== `w`) {
                R_cw();
            }
        }

        if ($.R[4] === `w`) {
            R_cw();
        } else if ($.R[6] === `w`) {
            while ($.F[6] === `w`) {
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
    console.log(`Finish white cross`);
    while ($.F[2] === `w` || $.F[4] === `w` || $.F[6] === `w` || $.F[8] === `w`) {
        logCube($);

        while ($.R[5] !== $.R[6] || $.B[4] !== `w`) {
            if ($.F[6] === `w` && $.R[4] === $.R[5]) {
                R_cw();
                R_cw();
            }
            if ($.F[2] === `w` && $.U[8] === $.R[5]) {
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
    console.log(`Finish white face`);
    for (let i = 1; i <= 4; i++) {
        const c1 = $.horizontalEdges[(i - 1) * 2 + 1];
        const c2 = $.horizontalEdges[(i - 1) * 2 + 2];

        console.log(`Finish white corners`, colorizeBlock(c1), colorizeBlock(c2));
        logCube($);

        console.log(`Move away from white face`);
        repeat(4, () => {
            if (
                ($.D[9] === `w` || $.B[7] === `w` || $.R[9] === `w`) &&
                ($.D[9] === c1 || $.B[7] === c1 || $.R[9] === c1) &&
                ($.D[9] === c2 || $.B[7] === c2 || $.R[9] === c2)
            ) {
                righty();
            } else {
                MotorF_cw();
            }
        });
        logCube($);

        console.log('Colored corner on correct faces, F,U,R = F,R,`w`');
        while ($.R[5] !== c1) {
            MotorF_cw();
        }
        logCube($);
        while (!(
            ($.F[9] === `w` || $.D[3] === `w` || $.R[7] === `w`) &&
            ($.F[9] === c1 || $.D[3] === c1 || $.R[7] === c1) &&
            ($.F[9] === c2 || $.D[3] === c2 || $.R[7] === c2)
        )) {
            F_cw();
            logCube($);
        }
        logCube($);

        console.log('Fix white corner');
        while ($.B[7] !== `w` || $.R[9] !== $.R[5] || $.D[9] !== $.D[5]) {
            righty();
        }
        logCube($);

        assert.whiteCross($);
    }

    assert.ts($);
};

/** Step: Finish second layer */
const finishSecondLayer = () => {
    console.log(`Finish second layer`); // TODO: Add comments and cube logs
    for (let i = 1; i <= 4; i++) {
        const c1 = $.horizontalEdges[(i - 1) * 2 + 1];
        const c2 = $.horizontalEdges[(i - 1) * 2 + 2];

        console.log(`Finish second layer colors`, colorizeBlock(c1), colorizeBlock(c2));
        logCube($);

        repeat(4, () => {
            if (($.R[8] === c1 || $.R[8] === c2) && ($.D[6] === c1 || $.D[6] === c2)) {
                righty();
                righty();
                F_cw();
                righty();
                righty();
                righty();
                righty();
            } else {
                MotorF_cw();
            }
        });

        while (!(($.F[8] === c1 || $.F[8] === c2) && ($.D[2] === c1 || $.D[2] === c2))) {
            F_cw();
        }
        while ($.F[8] !== $.D[5]) {
            MotorF_cw();
            F_ccw();
        }
        if ($.R[5] === c1 || $.R[5] === c2) {
            F_cw();
            righty();
            righty();
            F_cw();
            righty();
            righty();
            righty();
            righty();
        } else if ($.L[5] === c1 || $.L[5] === c2) {
            F_ccw();
            lefty();
            lefty();
            F_cw();
            lefty();
            lefty();
            lefty();
            lefty();
        }

        assert.ts($);
    }
    logCube($);

    assert.firstAndSecondLayer($);
};

/** Step: Finish yellow cross */
const finishYellowCross = () => {
    console.log(`Finish yellow cross`);
    while (
        $.F[2] !== `y`
        || $.F[4] !== `y`
        || $.F[6] !== `y`
        || $.F[8] !== `y`
        ) {

        while (($.F[2] === `y` && $.F[8] === `y`)
        || ($.F[2] === `y` && $.F[6] === `y`)
        || ($.F[4] === `y` && $.F[8] === `y`)
        || ($.F[6] === `y` && $.F[8] === `y`)) {
            F_cw();
        }

        MotorR_cw();
        F_cw();
        MotorR_ccw();
        righty();
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
    console.log(`Finish yellow edges`);
    while (!($.U[8] === $.U[5] && $.R[4] === $.R[5] && $.D[2] === $.D[5] && $.L[6] === $.L[5])) {
        if ($.D[2] !== $.D[5]) {
            console.log(`Swap edges`);
            R_cw();
            F_cw();

            R_ccw();
            F_cw();

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
    console.log(`Orient yellow corners`);
    while (!($.F[1] === `y` && $.F[3] === `y` && $.F[7] === `y` && $.F[9] === `y`)) {
        console.log(`Orient yellow corner`);
        logCube($);
        repeat(4, () => {
            if ($.F[9] !== 'y') {
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
            if ($.F[9] === 'y') {
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
