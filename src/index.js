'use strict';

import {createList, repeat} from "./pocket-code";
import {colorizeBlock, logCube, shuffle} from "./utils";
import assert from "./assert";

/** Program variables/lists */
const $ = {
    horizontalEdges: createList(),

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

    moveFaceToFColor: 0,
};

/** Command handler */
// Turn cube clockwise on X-axis
const TA = () => {
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            let newIndex = 9 - (3 * (k - 1)) - (3 - i);
            $.FB[index] = $.F[newIndex];
            $.LB[index] = $.D[newIndex];
            $.RB[index] = $.U[newIndex];
            $.UB[index] = $.L[newIndex];
            $.DB[index] = $.R[newIndex];

            newIndex = k * 3 - (i - 1);
            $.BB[index] = $.B[newIndex];
        }
    }
    restoreCube();
};

// Turn cube counterclockwise on X-axis
const TAP = () => {
    TA();
    TA();
    TA();
};

// Turn cube clockwise on Y-axis
const TB = () => {
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            $.FB[index] = $.L[index];
            $.BB[index] = $.R[index];
            $.LB[index] = $.B[index];
            $.RB[index] = $.F[index];

            let newIndex = k * 3 - (i - 1);
            $.UB[index] = $.U[newIndex];
            newIndex = 9 - (3 * (k - 1)) - (3 - i);
            $.DB[index] = $.D[newIndex];
        }
    }
    restoreCube();
};

// Turn cube counterclockwise on Y-axis
const TBP = () => {
    TB();
    TB();
    TB();
};

// Turn F clockwise
const TAHB = () => {
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            let newIndex = 9 - (3 * (k - 1)) - (3 - i);
            $.FB[index] = $.F[newIndex];
        }
    }

    $.LB[3] = $.D[1];
    $.LB[6] = $.D[2];
    $.LB[9] = $.D[3];

    $.RB[1] = $.U[7];
    $.RB[4] = $.U[8];
    $.RB[7] = $.U[9];

    $.UB[7] = $.L[9];
    $.UB[8] = $.L[6];
    $.UB[9] = $.L[3];

    $.DB[1] = $.R[7];
    $.DB[2] = $.R[4];
    $.DB[3] = $.R[1];
    restoreCube();
};

// Turn F counterclockwise
const TAPHB = () => {
    TAHB();
    TAHB();
    TAHB();
};

// Turn D clockwise
const TBHA = () => {
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            let newIndex = 9 - (3 * (k - 1)) - (3 - i);
            $.DB[index] = $.D[newIndex];

            if (index >= 7) {
                $.FB[index] = $.L[index];
                $.LB[index] = $.B[index];
                $.BB[index] = $.R[index];
                $.RB[index] = $.F[index];
            }
        }
    }
    restoreCube();
};

// Turn D counterclockwise
const TBPHA = () => {
    TBHA();
    TBHA();
    TBHA();
};

/** Command utils */
const moveFaceToF = () => {
    for (let i = 0; i < 2; i++) { // repeat 2 times
        for (let j = 0; j < 4; j++) { // repeat 4 times
            if ($.F[5] === $.moveFaceToFColor) {
                return;
            }
            TB();
        }
        TA();
    }
};

const righty = () => {
    TAHB();
    TBHA();
    TAPHB();
    TBPHA();
};

const lefty = () => {
    TAPHB();
    TBHA();
    TAHB();
    TBPHA();
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
const main = () => {
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
};

/** Step: Read cube colors */
const readCubeColors = () => {
    // TODO: Only for Javascript testing. Implement block for Catrobat.
    shuffle($, [TA, TAP, TB, TBP, TAHB, TAPHB, TBHA, TBPHA]);
    logCube($);
};

/** Step: Make daisy */
const makeDaisy = () => {
    console.log(`Make daisy`);
    moveFaceToF($.moveFaceToFColor = `y`);
    while ($.F[2] !== `w` || $.F[4] !== `w` || $.F[6] !== `w` || $.F[8] !== `w`) {
        if ($.B[2] === `w` || $.B[4] === `w` || $.B[6] === `w` || $.B[8] === `w`) {
            // console.log(`Move white tile from back to yellow front`);
            TB();
            TB();
            while ($.F[8] !== `w`) {
                TAHB();
            }
            TB();
            TB();
            while ($.F[8] === `w`) {
                TAHB();
            }
            TBHA();
            TBHA();
        } else {
            // console.log(`Move white tile from side to yellow front face`);
            while ($.D[2] !== `w` && $.D[4] !== `w` && $.D[6] !== `w` && $.D[8] !== `w`) {
                TA();
            }
            while ($.F[8] === `w`) {
                TAHB();
            }
            while ($.D[4] !== `w`) {
                TBHA();
            }
            TA();
            TA();
            TA();

            while ($.F[8] === `w`) { // optional?
                TAHB();
            }

            TBPHA();
        }
        moveFaceToF($.moveFaceToFColor = `y`);
    }
    logCube($);

    assert.whiteDaisy($);
};

/** Step: Finish white cross */
const finishWhiteCross = () => {
    console.log(`Finish white cross`);
    repeat(4, () => {
        while (!($.F[8] === `w` && $.D[2] === $.D[5])) {
            TAHB();
        }
        TBHA();
        TBHA();
        TA();
    });
    TB();
    TA();
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
                ($.F[3] === `w` || $.U[9] === `w` || $.R[1] === `w`) &&
                ($.F[3] === c1 || $.U[9] === c1 || $.R[1] === c1) &&
                ($.F[3] === c2 || $.U[9] === c2 || $.R[1] === c2)
            ) {
                righty();
            } else {
                TB();
            }
        });
        logCube($);

        console.log('Colored corner on correct faces, F,U,R = F,R,`w`');
        while ($.F[5] !== c1) {
            TB();
        }
        logCube($);
        while (!(
            ($.F[9] === `w` || $.D[3] === `w` || $.R[7] === `w`) &&
            ($.F[9] === c1 || $.D[3] === c1 || $.R[7] === c1) &&
            ($.F[9] === c2 || $.D[3] === c2 || $.R[7] === c2)
        )) {
            TBHA();
        }
        logCube($);

        console.log('Fix white corner');
        while ($.U[9] !== `w` || $.F[3] !== $.F[5] || $.R[1] !== $.R[5]) {
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
            if (($.F[6] === c1 || $.F[6] === c2) && ($.R[4] === c1 || $.R[4] === c2)) {
                righty();
                righty();
                TBPHA();
                righty();
                righty();
                righty();
                righty();
            } else {
                TB();
            }
        });

        while (!(($.F[8] === c1 || $.F[8] === c2) && ($.D[2] === c1 || $.D[2] === c2))) {
            TBHA();
        }
        while (!($.F[5] === $.F[8] && ($.F[5] === c1 || $.F[5] === c2))) {
            TBHA();
            TBP();
        }
        if ($.L[5] === c1 || $.L[5] === c2) {
            TBHA();
            TBHA();
            lefty();
            lefty();
            TBHA();
            lefty();
            lefty();
            lefty();
            lefty();
        } else if ($.R[5] === c1 || $.R[5] === c2) {
            TBHA();
            TBHA();
            righty();
            righty();
            TBHA();
            righty();
            righty();
            righty();
            righty();
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
        $.D[2] !== `y`
        || $.D[4] !== `y`
        || $.D[6] !== `y`
        || $.D[8] !== `y`
        ) {

        while (($.D[2] === `y` && $.D[8] === `y`)
        || ($.D[2] === `y` && $.D[4] === `y`)
        || ($.D[2] === `y` && $.D[6] === `y`)
        || ($.D[4] === `y` && $.D[8] === `y`)) {
            TB();
        }

        TAHB();
        TB();
        righty();
        TBP();
        TAPHB();

        assert.firstAndSecondLayer($);
    }
    logCube($);

    assert.yellowCross($);
};

/** Step: Finish yellow edges */
const finishYellowEdges = () => {
    console.log(`Finish yellow edges`);
    while (!(
        ($.F[5] === $.F[8])
        && ($.B[5] === $.B[8])
        && ($.L[5] === $.L[8])
        && ($.R[5] === $.R[8])
    )) {
        if ($.R[5] !== $.R[8]) {
            console.log(`Swap edges`);
            TAHB();
            TBHA();
            TAPHB();
            TBHA();
            TAHB();
            TBHA();
            TBHA();
            TAPHB();
            TBHA();
            logCube($);
        }
        console.log(`Rotate cube`);
        TB();
        logCube($);

        assert.yellowCross($);
    }
    logCube($);

    assert.yellowCrossEdges($);
};

/** Step: Move yellow corners to their places */
const moveYellowCornersToTheirPlaces = () => {
    console.log(`Move corners to their places`);
    repeat(4, () => {
        repeat(3, () => {
            if (!(
                    ($.F[5] === $.F[9] || $.F[5] === $.R[7] || $.F[5] === $.D[3])
                    && ($.R[5] === $.F[9] || $.R[5] === $.R[7] || $.R[5] === $.D[3])
                )) {
                logCube($);
                console.log(`Rotate corner ${colorizeBlock($.F[9])}${colorizeBlock($.R[7])}${colorizeBlock($.D[3])} to match ${colorizeBlock($.F[5])}${colorizeBlock($.R[5])}`);

                console.log(`    FRD(${colorizeBlock($.F[9])}${colorizeBlock($.R[7])}${colorizeBlock($.D[3])})`
                    + ` BRD(${colorizeBlock($.B[7])}${colorizeBlock($.R[9])}${colorizeBlock($.D[9])})`
                    + ` BLD(${colorizeBlock($.B[9])}${colorizeBlock($.L[7])}${colorizeBlock($.D[7])})`
                    + ` FLD(${colorizeBlock($.F[7])}${colorizeBlock($.L[9])}${colorizeBlock($.D[1])})`
                );

                TBP();
                //  U R U' L' U R' U' L
                //  BRD-corner stays they same, other three D corners rotate
                TBHA();
                TAHB();
                TBPHA();
                TB();
                TB();
                TAPHB();
                TB();
                TB();
                TBHA();
                TAPHB();
                TBPHA();
                TB();
                TB();
                TAHB();
                TB();
                TB();
                TB();
                logCube($);

                console.log(`    FRD(${colorizeBlock($.F[9])}${colorizeBlock($.R[7])}${colorizeBlock($.D[3])})`
                    + ` BRD(${colorizeBlock($.B[7])}${colorizeBlock($.R[9])}${colorizeBlock($.D[9])})`
                    + ` BLD(${colorizeBlock($.B[9])}${colorizeBlock($.L[7])}${colorizeBlock($.D[7])})`
                    + ` FLD(${colorizeBlock($.F[7])}${colorizeBlock($.L[9])}${colorizeBlock($.D[1])})`
                );
            }
        });
        TB();
    });
    logCube($);

    console.log(`Corners: FRD(${colorizeBlock($.F[9])}${colorizeBlock($.R[7])}${colorizeBlock($.D[3])})`
        + ` BRD(${colorizeBlock($.B[7])}${colorizeBlock($.R[9])}${colorizeBlock($.D[9])})`
        + ` BLD(${colorizeBlock($.B[9])}${colorizeBlock($.L[7])}${colorizeBlock($.D[7])})`
        + ` FLD(${colorizeBlock($.F[7])}${colorizeBlock($.L[9])}${colorizeBlock($.D[1])})`
    );
    assert.yellowCrossEdgesAndCorners($);
};

/** Step: Orient yellow corners */
const orientYellowCorners = () => {
    console.log(`Orient yellow corners`);
    TA();
    TA();
    while (!($.U[1] === `y` && $.U[3] === `y` && $.U[7] === `y` && $.U[9] === `y`)) {
        console.log(`Orient yellow corner`);
        logCube($);
        repeat(4, () => {
            if ($.U[9] !== 'y') {
                // R' D' R D
                TBP();
                TAPHB();
                TB();
                TBPHA();
                TBP();
                TAHB();
                TB();
                TBHA();
            }
        });
        logCube($);

        console.log(`Rotate to next yellow corner not facing correctly`);
        TA();
        TA();
        repeat(4, () => {
            if ($.D[1] === 'y') {
                TBPHA();
            }
        });
        TA();
        TA();
        logCube($);
    }
    TA();
    TA();
    while ($.F[5] !== $.F[8]) {
        TBHA();
    }
    console.log(`Done`);
    logCube($);

    assert.cube($);
};

main();
