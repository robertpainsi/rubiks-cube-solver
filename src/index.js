'use strict';

const $ = {
    // F: [`w`, `w`, `w`, `w`, `w`, `w`, `w`, `w`, `w`],
    // B: [`y`, `y`, `y`, `y`, `y`, `y`, `y`, `y`, `y`],
    // L: [`b`, `b`, `b`, `b`, `b`, `b`, `b`, `b`, `b`],
    // R: [`g`, `g`, `g`, `g`, `g`, `g`, `g`, `g`, `g`],
    // U: [`o`, `o`, `o`, `o`, `o`, `o`, `o`, `o`, `o`],
    // D: [`r`, `r`, `r`, `r`, `r`, `r`, `r`, `r`, `r`],
    F: [`y`, `r`, `g`, `r`, `w`, `o`, `o`, `o`, `w`,],
    B: [`y`, `r`, `y`, `b`, `y`, `b`, `b`, `b`, `o`,],
    L: [`r`, `w`, `r`, `y`, `b`, `y`, `w`, `r`, `y`,],
    R: [`r`, `y`, `b`, `w`, `g`, `o`, `o`, `g`, `w`,],
    U: [`g`, `b`, `o`, `g`, `r`, `g`, `b`, `g`, `w`,],
    D: [`g`, `y`, `b`, `w`, `o`, `o`, `g`, `w`, `r`,],

    FB: [],
    BB: [],
    LB: [],
    RB: [],
    UB: [],
    DB: [],
};
const logCube = () => {
    const cube = {
        F: [$.F.slice(0, 3), $.F.slice(3, 6), $.F.slice(6, 9)],
        B: [$.B.slice(0, 3), $.B.slice(3, 6), $.B.slice(6, 9)],
        L: [$.L.slice(0, 3), $.L.slice(3, 6), $.L.slice(6, 9)],
        R: [$.R.slice(0, 3), $.R.slice(3, 6), $.R.slice(6, 9)],
        U: [$.U.slice(0, 3), $.U.slice(3, 6), $.U.slice(6, 9)],
        D: [$.D.slice(0, 3), $.D.slice(3, 6), $.D.slice(6, 9)],
    };
    console.log(cube);
    console.log();
};

const direction = {
    cw: 0,
    ccw: 1,
};

const backup = () => {
    for (let i = 1; i <= 9; i++) {
        $.FB[i - 1] = $.F[i - 1];
        $.BB[i - 1] = $.B[i - 1];
        $.LB[i - 1] = $.L[i - 1];
        $.RB[i - 1] = $.R[i - 1];
        $.UB[i - 1] = $.U[i - 1];
        $.DB[i - 1] = $.D[i - 1];
    }
};

const restore = () => {
    for (let i = 1; i <= 9; i++) {
        $.F[i - 1] = $.FB[i - 1];
        $.B[i - 1] = $.BB[i - 1];
        $.L[i - 1] = $.LB[i - 1];
        $.R[i - 1] = $.RB[i - 1];
        $.U[i - 1] = $.UB[i - 1];
        $.D[i - 1] = $.DB[i - 1];
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
            $.FB[index - 1] = $.F[newIndex - 1];
            $.LB[index - 1] = $.D[newIndex - 1];
            $.RB[index - 1] = $.U[newIndex - 1];
            $.UB[index - 1] = $.L[newIndex - 1];
            $.DB[index - 1] = $.R[newIndex - 1];

            newIndex = k * 3 - (i - 1);
            $.BB[index - 1] = $.B[newIndex - 1];
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
            $.FB[index - 1] = $.L[index - 1];
            $.BB[index - 1] = $.R[index - 1];
            $.LB[index - 1] = $.B[index - 1];
            $.RB[index - 1] = $.F[index - 1];

            let newIndex = k * 3 - (i - 1);
            $.UB[index - 1] = $.U[newIndex - 1];
            newIndex = 9 - (3 * (k - 1)) - (3 - i);
            $.DB[index - 1] = $.D[newIndex - 1];
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
    backup(); // TODO: Should be optional
    for (let i = 1; i <= 3; i++) {
        for (let k = 1; k <= 3; k++) {
            let index = (i - 1) * 3 + k;
            $.BB[index - 1] = $.B[index - 1];
            let newIndex = 9 - (3 * (k - 1)) - (3 - i);
            $.FB[index - 1] = $.F[newIndex - 1];
        }
    }

    $.LB[3 - 1] = $.D[1 - 1];
    $.LB[6 - 1] = $.D[2 - 1];
    $.LB[9 - 1] = $.D[3 - 1];

    $.RB[1 - 1] = $.U[7 - 1];
    $.RB[4 - 1] = $.U[8 - 1];
    $.RB[7 - 1] = $.U[9 - 1];

    $.UB[7 - 1] = $.L[9 - 1];
    $.UB[8 - 1] = $.L[6 - 1];
    $.UB[9 - 1] = $.L[3 - 1];

    $.DB[1 - 1] = $.R[7 - 1];
    $.DB[2 - 1] = $.R[4 - 1];
    $.DB[3 - 1] = $.R[1 - 1];
    restore();
};

logCube();
backup();
let commands = `TAHB TA TAHB TAHB TB TAHB`;
commands.split(` `).forEach((command) => {
    switch (command) {
        case `TA`:
            TA();
            break;
        case `TB`:
            TB();
            break;
        case `TAHB`:
            TAHB();
            break;
    }
});

logCube();
