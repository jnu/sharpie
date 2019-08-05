"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._debug = (...args) => {
    if (process.env.NODE_ENV !== "production") {
        console.debug(...args);
    }
};
exports._error = (...args) => {
    if (process.env.NODE_ENV !== "production") {
        console.error(...args);
    }
};
exports.defaults = (o, d) => {
    if (!o) {
        return Object.assign({}, d);
    }
    return Object.assign({}, d, o);
};
exports.identity = (x) => x;
exports.sortedInsert = (A, x, key = exports.identity) => {
    const val = key(x);
    if (A.length === 0) {
        A.push(x);
        return;
    }
    let low = 0;
    let high = A.length;
    while (high - low > 1) {
        const mid = low + ((high - low) >> 1);
        const cmp = key(A[mid]);
        if (val < cmp) {
            high = mid;
        }
        else {
            low = mid;
        }
    }
    const index = val <= key(A[low]) ? low : high;
    A.splice(index, 0, x);
};
//# sourceMappingURL=util.js.map