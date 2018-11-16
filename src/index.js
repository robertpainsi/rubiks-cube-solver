'use strict';

import {createList} from "./pocket_code";
import {logCube} from "./utils";

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
    commandText: '',
};

const direction = {
    cw: 0,
    ccw: 1,
};

const shuffle = () => {
    const commandsPool = [`TA`, `TB`, `TAHB`, `TBHA`];
    const commands = [];
    for (let i = 0; i < 256; i++) {
        commands.push(commandsPool[Math.floor(Math.random() * commandsPool.length)]);
    }
    $.commandText = commands.join(' ');
    executeCommands();
};

const parseCommands = () => {
    while ($.commands.length) {
        delete $.commands[1];
    }
    let insertNewItem = true;
    for (let i = 0; i < $.commandText.length; i++) { // TODO: Adapt to PC text indices
        let c = $.commandText[i];
        if (c === ' ') {
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
    $.commandText = '';
};

const executeCommands = () => {
    parseCommands();
    while ($.commands.length) {
        if ($.commands[1] === 'TA') {
            // console.log('TA');
            TA();
        } else if ($.commands[1] === 'TB') {
            // console.log('TB');
            TB();
        } else if ($.commands[1] === 'TAHB') {
            // console.log('TAHB');
            TAHB();
        } else if ($.commands[1] === 'TBHA') {
            // console.log('TBHA');
            TBHA();
        } else {
            console.error('Unknown command', );
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

backup();
shuffle(); // TODO: Remove
logCube($);

logCube($);
