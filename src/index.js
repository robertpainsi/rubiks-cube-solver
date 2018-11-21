'use strict';

import {createList, parallel, repeat, setArduinoDigintalPin} from "./pocket_code";
import {colorizeBlock, logCube, shuffle} from "./utils";
import assert from "./assert";

/** Global variables/lists */
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

    commands: createList(),
    commandText: ``,

    moveFaceToFColor: 0,

    currentMotorDirectionPin: 0,
    currentMotorDirection: 0,
    currentMotorStepperPin: 0,
    currentMotorSteps: 0,
};

/** Command handler */
const parseCommands = () => {
    while ($.commands.length) {
        delete $.commands[1];
    }
    let insertNewItem = true;
    for (let i = 0; i < $.commandText.length; i++) { // TODO: Adapt to Catrobat text indices [1...length]
        let c = $.commandText[i];
        if (c === ` `) {
            insertNewItem = true;
        } else {
            if (insertNewItem) {
                $.commands.push(c);
                insertNewItem = false;
            } else {
                $.commands[$.commands.length] = $.commands[$.commands.length] + c;
            }
        }
    }
    $.commandText = ``;
};

const executeCommands = () => {
    parseCommands();
    while ($.commands.length) {
        // console.log($.commands[1]);
        if ($.commands[1] === `TA`) {
            TA();
        } else if ($.commands[1] === `TAP`) {
            TAP();
        } else if ($.commands[1] === `TB`) {
            TB();
        } else if ($.commands[1] === `TBP`) {
            TBP();
        } else if ($.commands[1] === `TAHB`) {
            TAHB();
        } else if ($.commands[1] === `TAPHB`) {
            TAPHB();
        } else if ($.commands[1] === `TBHA`) {
            TBHA();
        } else if ($.commands[1] === `TBPHA`) {
            TBPHA();
        } else {
            console.error(`Unknown command`, $.commands[1]);
            process.exit();
        }
        delete $.commands[1];
    }
};

// Turn cube clockwise on X-axis
const TA = () => {
    parallel(TA_Motor, TA_Data);
};
const TA_Motor = () => {
    releaseMotorB();
    turnMotorAClockwise();
    holdMotorB();
    releaseMotorA();
    turnMotorACounterclockwise();
    holdMotorA();
};
const TA_Data = () => {
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
    parallel(TAP_Motor, TAP_Data);
};
const TAP_Motor = () => {
    releaseMotorB();
    turnMotorACounterclockwise();
    holdMotorB();
    releaseMotorA();
    turnMotorAClockwise();
    holdMotorA();
};
const TAP_Data = () => {
    TA_Data();
    TA_Data();
    TA_Data();
};

// Turn cube clockwise on Y-axis
const TB = () => {
    parallel(TB_Motor, TB_Data);
};
const TB_Motor = () => {
    releaseMotorA();
    turnMotorBClockwise();
    holdMotorA();
    releaseMotorB();
    turnMotorBCounterclockwise();
    holdMotorB();
};
const TB_Data = () => {
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
    parallel(TBP_Motor, TBP_Data);
};
const TBP_Motor = () => {
    releaseMotorA();
    turnMotorBCounterclockwise();
    holdMotorA();
    releaseMotorB();
    turnMotorBClockwise();
    holdMotorB();
};
const TBP_Data = () => {
    TB_Data();
    TB_Data();
    TB_Data();
};

// Turn F clockwise
const TAHB = () => {
    parallel(TAHB_Motor, TAHB_Data);
};
const TAHB_Motor = () => {
    turnMotorAClockwise();
    releaseMotorA();
    turnMotorACounterclockwise();
    holdMotorA();
};
const TAHB_Data = () => {
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
    parallel(TAPHB_Motor, TAPHB_Data);
};
const TAPHB_Motor = () => {
    turnMotorACounterclockwise();
    releaseMotorA();
    turnMotorAClockwise();
    holdMotorA();
};
const TAPHB_Data = () => {
    TAHB_Data();
    TAHB_Data();
    TAHB_Data();
};

// Turn D clockwise
const TBHA = () => {
    parallel(TBHA_Motor, TBHA_Data);
};
const TBHA_Motor = () => {
    turnMotorBClockwise();
    releaseMotorB();
    turnMotorBCounterclockwise();
    holdMotorB();
};
const TBHA_Data = () => {
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
    parallel(TBPHA_Motor, TBPHA_Data);
};
const TBPHA_Motor = () => {
    turnMotorBCounterclockwise();
    releaseMotorB();
    turnMotorBClockwise();
    holdMotorB();
};
const TBPHA_Data = () => {
    TBHA_Data();
    TBHA_Data();
    TBHA_Data();
};

/** Command utils */
const moveFaceToF = () => {
    for (let i = 0; i < 2; i++) { // repeat 2 times
        for (let j = 0; j < 4; j++) { // repeat 4 times
            if ($.F[5] === $.moveFaceToFColor) {
                return;
            }
            executeCommands($.commandText = `TB`);
        }
        executeCommands($.commandText = `TA`);
    }
};

const righty = () => {
    executeCommands($.commandText = `TAHB TBHA TAPHB TBPHA`);
};

const lefty = () => {
    executeCommands($.commandText = `TAPHB TBHA TAHB TBPHA`);
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

/** Motor */
const triggerCurrentMotor = () => {
    setArduinoDigintalPin(motorA.currentMotorDirectionPin, $.currentMotorDirection);
    repeat($.currentMotorSteps, () => { // TODO: Change to broadcasting to improve speed
        setArduinoDigintalPin($.turnStepperPin, 0);
        setArduinoDigintalPin($.turnStepperPin, 1);
    });
};

const turnMotorClockwise = () => {

    triggerCurrentMotor();
};

const turnMotorCounterclockwise = () => {
    $.currentMotorDirection = 0;
    triggerCurrentMotor();
};

/** Motor A */
/* TODO: setup() */
const motorA = {
    turnDirectionPin: 2,
    turnStepperPin: 3,
    holdReleaseDirectionPin: 4,
    holdReleaseStepperPin: 5,
};
const turnMotorAClockwise = () => {
    $.currentMotorDirectionPin = motorA.turnDirectionPin;
    $.currentMotorStepperPin = motorA.turnStepperPin;
    $.currentMotorSteps = 100;
    turnMotorClockwise();
};
const turnMotorACounterclockwise = () => {
    $.currentMotorDirectionPin = motorA.turnDirectionPin;
    $.currentMotorStepperPin = motorA.turnStepperPin;
    $.currentMotorSteps = 100;
    turnMotorCounterclockwise();
};
const holdMotorA = () => {
    $.currentMotorDirectionPin = motorA.holdReleaseDirectionPin;
    $.currentMotorStepperPin = motorA.holdReleaseStepperPin;
    $.currentMotorSteps = 50;
    turnMotorClockwise();
};
const releaseMotorA = () => {
    $.currentMotorDirectionPin = motorA.holdReleaseDirectionPin;
    $.currentMotorStepperPin = motorA.holdReleaseStepperPin;
    $.currentMotorSteps = 50;
    turnMotorCounterclockwise();
};

/** Motor B */
/* TODO: setup() */
const motorB = {
    turnStepperPin: 6,
    turnDirectionPin: 7,
    holdReleaseStepperPin: 8,
    holdReleaseDirectionPin: 9,
};
const turnMotorBClockwise = () => {
    $.currentMotorDirectionPin = motorB.turnDirectionPin;
    $.currentMotorStepperPin = motorB.turnStepperPin;
    $.currentMotorSteps = 100;
    turnMotorClockwise();
};
const turnMotorBCounterclockwise = () => {
    $.currentMotorDirectionPin = motorB.turnDirectionPin;
    $.currentMotorStepperPin = motorB.turnStepperPin;
    $.currentMotorSteps = 100;
    turnMotorCounterclockwise();
};
const holdMotorB = () => {
    $.currentMotorDirectionPin = motorB.holdReleaseDirectionPin;
    $.currentMotorStepperPin = motorB.holdReleaseStepperPin;
    $.currentMotorSteps = 50;
    turnMotorClockwise();
};
const releaseMotorB = () => {
    $.currentMotorDirectionPin = motorB.holdReleaseDirectionPin;
    $.currentMotorStepperPin = motorB.holdReleaseStepperPin;
    $.currentMotorSteps = 50;
    turnMotorCounterclockwise();
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

    console.log(`Shuffle cube`);
    shuffle($, executeCommands); // TODO: Remove
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
};

/** Step: Make daisy */
const makeDaisy = () => {
    console.log(`Make daisy`);
    moveFaceToF($.moveFaceToFColor = `y`);
    while ($.F[2] !== `w` || $.F[4] !== `w` || $.F[6] !== `w` || $.F[8] !== `w`) {
        if ($.B[2] === `w` || $.B[4] === `w` || $.B[6] === `w` || $.B[8] === `w`) {
            // console.log(`Move white tile from back to yellow front`);
            executeCommands($.commandText = `TB TB`);
            while ($.F[8] !== `w`) {
                executeCommands($.commandText = `TAHB`);
            }
            executeCommands($.commandText = `TB TB`);
            while ($.F[8] === `w`) {
                executeCommands($.commandText = `TAHB`);
            }
            executeCommands($.commandText = `TBHA TBHA`);
        } else {
            // console.log(`Move white tile from side to yellow front face`);
            while ($.D[2] !== `w` && $.D[4] !== `w` && $.D[6] !== `w` && $.D[8] !== `w`) {
                executeCommands($.commandText = `TA`);
            }
            while ($.F[8] === `w`) {
                executeCommands($.commandText = `TAHB`);
            }
            while ($.D[4] !== `w`) {
                executeCommands($.commandText = `TBHA`);
            }
            executeCommands($.commandText = `TA TA TA`);

            while ($.F[8] === `w`) { // optional?
                executeCommands($.commandText = `TAHB`);
            }

            executeCommands($.commandText = `TBPHA`);
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
            executeCommands($.commandText = `TAHB`);
        }
        executeCommands($.commandText = `TBHA TBHA TA`);
    });
    executeCommands($.commandText = `TB TA`);
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
                executeCommands($.commandText = `TB`);
            }
        });
        logCube($);

        console.log('Colored corner on correct faces, F,U,R = F,R,`w`');
        while ($.F[5] !== c1) {
            executeCommands($.commandText = `TB`);
        }
        logCube($);
        while (!(
            ($.F[9] === `w` || $.D[3] === `w` || $.R[7] === `w`) &&
            ($.F[9] === c1 || $.D[3] === c1 || $.R[7] === c1) &&
            ($.F[9] === c2 || $.D[3] === c2 || $.R[7] === c2)
        )) {
            executeCommands($.commandText = `TBHA`);
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

        for (let i = 0; i < 4; i++) {
            if (($.F[6] === c1 || $.F[6] === c2) && ($.R[4] === c1 || $.R[4] === c2)) {
                righty();
                righty();
                executeCommands($.commandText = `TBPHA`);
                righty();
                righty();
                righty();
                righty();
            } else {
                executeCommands($.commandText = `TB`);
            }
        }

        while (!(($.F[8] === c1 || $.F[8] === c2) && ($.D[2] === c1 || $.D[2] === c2))) {
            executeCommands($.commandText = `TBHA`);
        }
        while (!($.F[5] === $.F[8] && ($.F[5] === c1 || $.F[5] === c2))) {
            executeCommands($.commandText = `TBHA TBP`);
        }
        if ($.L[5] === c1 || $.L[5] === c2) {
            executeCommands($.commandText = `TBHA TBHA`);
            lefty();
            lefty();
            executeCommands($.commandText = `TBHA`);
            lefty();
            lefty();
            lefty();
            lefty();
        } else if ($.R[5] === c1 || $.R[5] === c2) {
            executeCommands($.commandText = `TBHA TBHA`);
            righty();
            righty();
            executeCommands($.commandText = `TBHA`);
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
            executeCommands($.commandText = `TB`);
        }

        executeCommands($.commandText = `TAHB TB`);
        righty();
        executeCommands($.commandText = `TBP TAPHB`);

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
            executeCommands($.commandText = `TAHB TBHA TAPHB TBHA TAHB TBHA TBHA TAPHB TBHA`);
            logCube($);
        }
        console.log(`Rotate cube`);
        executeCommands($.commandText = `TB`);
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

                executeCommands($.commandText = `TBP`);
                //  U R U' L' U R' U' L
                //  BRD-corner stays they same, other three D corners rotate
                executeCommands($.commandText = `TBHA TAHB TBPHA TB TB TAPHB TB TB TBHA TAPHB TBPHA TB TB TAHB TB TB`);
                executeCommands($.commandText = `TB`);
                logCube($);

                console.log(`    FRD(${colorizeBlock($.F[9])}${colorizeBlock($.R[7])}${colorizeBlock($.D[3])})`
                    + ` BRD(${colorizeBlock($.B[7])}${colorizeBlock($.R[9])}${colorizeBlock($.D[9])})`
                    + ` BLD(${colorizeBlock($.B[9])}${colorizeBlock($.L[7])}${colorizeBlock($.D[7])})`
                    + ` FLD(${colorizeBlock($.F[7])}${colorizeBlock($.L[9])}${colorizeBlock($.D[1])})`
                );
            }
        });
        executeCommands($.commandText = `TB`);
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
    executeCommands($.commandText = `TA TA`);
    while (!($.U[1] === `y` && $.U[3] === `y` && $.U[7] === `y` && $.U[9] === `y`)) {
        console.log(`Orient yellow corner`);
        logCube($);
        repeat(4, () => {
            if ($.U[9] !== 'y') {
                // R' D' R D
                executeCommands($.commandText = `TBP TAPHB TB`);
                executeCommands($.commandText = `TBPHA`);
                executeCommands($.commandText = `TBP TAHB TB`);
                executeCommands($.commandText = `TBHA`);
            }
        });
        logCube($);

        console.log(`Rotate to next yellow corner not facing correctly`);
        executeCommands($.commandText = `TA TA`);
        repeat(4, () => {
            if ($.D[1] === 'y') {
                executeCommands($.commandText = `TBPHA`);
            }
        });
        executeCommands($.commandText = `TA TA`);
        logCube($);
    }
    executeCommands($.commandText = `TA TA`);
    while ($.F[5] !== $.F[8]) {
        executeCommands($.commandText = `TBHA`);
    }
    console.log(`Done`);
    logCube($);

    assert.cube($);
};

main();
