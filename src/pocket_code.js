'use strict';

export const createList = (() => {
    const isIndex = (s) => (typeof s === 'string' || s instanceof String) && /^\d+$/.test(s);
    const handler = {
        apply: function (target, thisArg, argumentsList) {
            return target(argumentsList[0], argumentsList[1]) * 10;
        },
        deleteProperty(target, prop) {
            if (isIndex(prop)) {
                for (let i = parseInt(prop); i < target.length; i++) {
                    target[i - 1] = target[i];
                }
                target.length--;
                return true;
            } else {
                return delete target[prop];
            }
        },
        set: (obj, prop, value) => {
            if (isIndex(prop)) {
                return obj[prop - 1] = value;
            } else {
                return obj[prop] = value;
            }
        },
        get: (obj, prop) => {
            if (prop === 'push') {
                return function (v) {
                    obj[obj.length] = v;
                }
            } else if (prop === 'length') {
                return obj.length;
            } else {
                return isIndex(prop) ? obj[prop - 1] : obj[prop];
            }
        }
    };

    return (side) => new Proxy(side || [], handler);
})();
