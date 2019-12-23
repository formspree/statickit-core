// @ts-ignore
import { btoa } from './base64';

/**
 * Base-64 encodes a (JSON-castable) object.
 *
 * @param obj - The object to encode.
 */
export const encode = (obj: object): string => {
  return btoa(JSON.stringify(obj));
};

/**
 * Appends a key-value pair to a target.
 *
 * @param target
 * @param key
 * @param value
 */
export const append = (
  target: { [key: string]: any } | FormData,
  key: string,
  value: string
) => {
  if (target instanceof FormData) {
    target.append(key, value);
  } else {
    target[key] = value;
  }
};