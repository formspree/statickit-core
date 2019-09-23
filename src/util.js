import './base64';

/**
 * Base-64 encodes a (JSON-castable) object.
 *
 * @param {Object} obj
 */
export const encode = obj => {
  window.btoa(JSON.stringify(obj));
};

/**
 * Appends a key-value pair to a target.
 *
 * @param {Object|FormData} target
 * @param {String} key
 * @param {String} value
 */
export const append = (target, key, value) => {
  if (target.append) {
    target.append(key, value);
  } else {
    data[key] = value;
  }
};
