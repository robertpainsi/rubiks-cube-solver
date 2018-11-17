'use strict';

import {createList} from "./pocket_code";
import {colorizeBlock, logCube} from "./utils";
import colorize from "./colorize";

const $ = {
    // F: createList([`y`, `r`, `g`, `r`, `w`, `o`, `o`, `o`, `w`,]),
    // B: createList([`y`, `r`, `y`, `b`, `y`, `b`, `b`, `b`, `o`,]),
    // L: createList([`r`, `w`, `r`, `y`, `b`, `y`, `w`, `r`, `y`,]),
    // R: createList([`r`, `y`, `b`, `w`, `g`, `o`, `o`, `g`, `w`,]),
    // U: createList([`g`, `b`, `o`, `g`, `r`, `g`, `b`, `g`, `w`,]),
    // D: createList([`g`, `y`, `b`, `w`, `o`, `o`, `g`, `w`, `r`,]),

    F: createList([`w`, `w`, `w`, `w`, `w`, `w`, `w`, `w`, `w`,]),
    B: createList([`y`, `y`, `y`, `y`, `y`, `y`, `y`, `y`, `y`,]),
    L: createList([`b`, `b`, `b`, `b`, `b`, `b`, `b`, `b`, `b`,]),
    R: createList([`g`, `g`, `g`, `g`, `g`, `g`, `g`, `g`, `g`,]),
    U: createList([`r`, `r`, `r`, `r`, `r`, `r`, `r`, `r`, `r`,]),
    D: createList([`o`, `o`, `o`, `o`, `o`, `o`, `o`, `o`, `o`,]),

    FB: createList(),
    BB: createList(),
    LB: createList(),
    RB: createList(),
    UB: createList(),
    DB: createList(),

    commands: createList(),
    commandText: ``,

    searchedSideColor: 0,
};

const direction = {
    cw: 0,
    ccw: 1,
};

const shuffle = () => {
    const commandsPool = [`TA`, `TB`, `TAHB`, `TBHA`];
    const commands = [];
    for (let i = 0; i < 128; i++) {
        commands.push(commandsPool[Math.floor(Math.random() * commandsPool.length)]);
    }
    $.commandText = commands.join(` `);
    executeCommands();
};

const parseCommands = () => {
    while ($.commands.length) {
        delete $.commands[1];
    }
    let insertNewItem = true;
    for (let i = 0; i < $.commandText.length; i++) { // TODO: Adapt to PC text indices
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
        if ($.commands[1] === `TA`) {
            // console.log(`TA`);
            TA();
        } else if ($.commands[1] === `TAP`) {
            // console.log(`TAP`);
            TAP();
        } else if ($.commands[1] === `TB`) {
            // console.log(`TB`);
            TB();
        } else if ($.commands[1] === `TBP`) {
            // console.log(`TBP`);
            TBP();
        } else if ($.commands[1] === `TAHB`) {
            // console.log(`TAHB`);
            TAHB();
        } else if ($.commands[1] === `TAPHB`) {
            // console.log(`TAPHB`);
            TAPHB();
        } else if ($.commands[1] === `TBHA`) {
            // console.log(`TBHA`);
            TBHA();
        } else if ($.commands[1] === `TBPHA`) {
            // console.log(`TBPHA`);
            TBPHA();
        } else {
            console.error(`Unknown command`, $.commands[1]);
        }
        delete $.commands[1];
    }
};

const backup = () => {
    for (let i = 1; i <= 9; i++) {
        $.FB[i] = $.F[i];
        $.BB[i] = $.B[i];
        $.LB[i] = $.L[i];
        $.RB[i] = $.R[i];
        $.UB[i] = $.U[i];
        $.DB[i] = $.D[i];
    }
};

const restore = () => {
    for (let i = 1; i <= 9; i++) {
        $.F[i] = $.FB[i];
        $.B[i] = $.BB[i];
        $.L[i] = $.LB[i];
        $.R[i] = $.RB[i];
        $.U[i] = $.UB[i];
        $.D[i] = $.DB[i];
    }
};

/**
 * Motor A
 *   variables:
 *     stepper pin: X
 *     direction pin: Y
 *     direction: 0 or 1
 *     TODO: hold/release motor
 *   messages:
 */
const turnMotorAClockwise = () => {
};
const turnMotorACounterclockwise = () => {
};
const holdMotorA = () => {
};
const releaseMotorA = () => {
};

/**
 * TODO: Motor B
 */
const turnMotorBClockwise = () => {
};
const turnMotorBCounterclockwise = () => {
};
const holdMotorB = () => {
};
const releaseMotorB = () => {
};

// Turn cube clockwise on X-axis
const TA = () => {
    releaseMotorB();
    turnMotorAClockwise();
    holdMotorB();
    releaseMotorA();
    turnMotorACounterclockwise();
    holdMotorA();

    // TODO: simultaneously
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
    restore();
};

// Turn cube counterclockwise on X-axis
const TAP = () => {
    TA();
    TA();
    TA();
};

// Turn cube clockwise on Y-axis
const TB = () => {
    releaseMotorA();
    turnMotorBClockwise();
    holdMotorA();
    releaseMotorB();
    turnMotorBCounterclockwise();
    holdMotorB();

    // TODO: simultaneously
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
    restore();
};

// Turn cube counterclockwise on Y-axis
const TBP = () => {
    TB();
    TB();
    TB();
}

// Turn F clockwise
const TAHB = () => {
    turnMotorAClockwise();
    releaseMotorA();
    turnMotorACounterclockwise();
    holdMotorA();

    // TODO: simultaneously
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
    restore();
};

// Turn F counterclockwise
const TAPHB = () => {
    TAHB();
    TAHB();
    TAHB();
};

// Turn D clockwise
const TBHA = () => {
    turnMotorBClockwise();
    releaseMotorB();
    turnMotorBCounterclockwise();
    holdMotorB();

    // TODO: simultaneously
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
    restore();
};

// Turn D counterclockwise
const TBPHA = () => {
    TBHA();
    TBHA();
    TBHA();
};

// TODO: Find better name for variable and method
const findSide = () => {
    for (let i = 0; i < 2; i++) { // repeat 2 times
        for (let j = 0; j < 4; j++) { // repeat 4 times
            if ($.F[5] === $.searchedSideColor) {
                return;
            }
            $.commandText = `TB`;
            executeCommands();
        }
        $.commandText = `TA`;
        executeCommands();
    }
};

backup();
console.log(`Shuffle cube`);
shuffle(); // TODO: Remove
logCube($);

console.log(`Make daisy`);
findSide($.searchedSideColor = `y`);
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
        // console.log(`Move white tile from side to yellow front`);
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
    findSide($.searchedSideColor = `y`);
}
logCube($);

if (!($.F[5] === `y` && $.F[2] === `w` && $.F[4] === `w` && $.F[6] === `w` && $.F[8] === `w`)) {
    console.error(`Wrong white daisy!`);
}

console.log(`Finish white cross`);
for (let i = 0; i < 4; i++) { // repeat 4 times
    while (!($.F[8] === `w` && $.D[2] === $.D[5])) {
        executeCommands($.commandText = `TAHB`);
    }
    executeCommands($.commandText = `TBHA TBHA TA`);
}
executeCommands($.commandText = `TB TA`);
logCube($);

if (!($.D[5] === `y`
        && $.U[2] === `w` && $.U[4] === `w` && $.U[5] === `w` && $.U[6] === `w` && $.U[8] === `w`
        && $.F[2] === $.F[5]
        && $.B[2] === $.B[5]
        && $.L[2] === $.L[5]
        && $.R[2] === $.R[5]
    )) {
    console.error(`Wrong white cross!`);
}

const righty = () => {
    executeCommands($.commandText = `TAHB TBHA TAPHB TBPHA`);
};

console.log(`Finish white side`);
const sides = createList([`b`, `o`, `o`, `g`, `g`, `r`, `r`, `b`]);
for (let i = 1; i <= 4; i++) {
    const c1 = sides[(i - 1) * 2 + 1];
    const c2 = sides[(i - 1) * 2 + 2];

    console.log(`Finish edge w`, colorizeBlock(c1), colorizeBlock(c2));
    logCube($);

    console.log(`Move away from white side`);
    for (let j = 0; j < 4; j++) {
        if (
            ($.F[3] === `w` || $.U[9] === `w` || $.R[1] === `w`) &&
            ($.F[3] === c1 || $.U[9] === c1 || $.R[1] === c1) &&
            ($.F[3] === c2 || $.U[9] === c2 || $.R[1] === c2)
        ) {
            righty();
        } else {
            executeCommands($.commandText = `TB`);
        }
    }
    logCube($);

    console.log('Colored edge on correct side, F,U,R = F,R,`w`');
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

    console.log('Fix white edge');
    while ($.U[9] !== `w` || $.F[3] !== $.F[5] || $.R[1] !== $.R[5]) {
        righty();
    }
    logCube($);
}

for (let i = 1; i <= 9; i++) {
    if ($.U[i] !== `w`) {
        console.error(`U isn't completely white`);
    }
}
for (let i = 1; i <= 3; i++) {
    if (
        $.F[i] !== $.F[5]
        || $.B[i] !== $.B[5]
        || $.L[i] !== $.L[5]
        || $.R[i] !== $.R[5]
    ) {
        console.error(`T's aren't complete`);
    }
}

console.log(`Finish second layer`);

console.log(`Done`);
logCube($);
