/**
 * Base-64 encodes a (JSON-castable) object.
 *
 * @param {object} obj - The object to encode.
 * @returns {string}
 */
export declare const encode: (obj: any) => any;
/**
 * Appends a key-value pair to a target.
 *
 * @param {object|FormData} target
 * @param {string} key
 * @param {string} value
 */
export declare const append: (target: any, key: any, value: any) => void;
