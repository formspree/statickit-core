import { btoa } from './base64';

/**
 * Base-64 encodes a (JSON-castable) object.
 *
 * @param {object} obj - The object to encode.
 * @returns {string}
 */
export const encode = obj => {
  return btoa(JSON.stringify(obj));
};

/**
 * Appends a key-value pair to a target.
 *
 * @param {object|FormData} target
 * @param {string} key
 * @param {string} value
 */
export const append = (target, key, value) => {
  if (target.append) {
    target.append(key, value);
  } else {
    target[key] = value;
  }
};
