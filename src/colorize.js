'use strict';

export default {
    red: (s) => `\x1b[31m${s}\x1b[0m`,
    green: (s) => `\x1b[32m${s}\x1b[0m`,
    blue: (s) => `\x1b[34m${s}\x1b[0m`,
    yellow: (s) => `\x1b[33m${s}\x1b[0m`,
    orange: (s) => `\x1b[36m${s}\x1b[0m`,
}
