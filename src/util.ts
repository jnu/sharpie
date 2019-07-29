/**
 * Output debug message.
 */
export const _debug = (...args: {}[]) => {
  if (process.env.NODE_ENV !== "production") {
    // tslint:disable-next-line:no-console
    console.debug(...args);
  }
};

/**
 * Supply default properties where they are missing to an object.
 */
export const defaults = <T>(o: T | undefined, d: T): T => {
  if (!o) {
    return {...d};
  }
  return {...d, ...o};
};

/**
 * The identity function.
 */
export const identity = <T>(x: T) => x;

/**
 * Insert an element into an array, keeping items sorted.
 *
 * Optionally supply a key function to sort by.
 */
export const sortedInsert = <T, U>(A: T[], x: T, key: (a: T) => T|U = identity) => {
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
    } else {
      low = mid;
    }
  }

  const index = val <= key(A[low]) ? low : high;
  A.splice(index, 0, x);
};
