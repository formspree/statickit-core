// @ts-ignore
import { btoa } from './base64';
import { version } from '../package.json';

/**
 * Base-64 encodes a (JSON-castable) object.
 *
 * @param obj - The object to encode.
 */
export const encode64 = (obj: object): string => {
  return btoa(JSON.stringify(obj));
};

/**
 * Appends a key-value pair to a target.
 *
 * @param target - An object or FormData instance to mutate.
 * @param key - The key to append.
 * @param value - The value to append.
 */
export const append = (
  target: { [key: string]: any } | FormData,
  key: string,
  value: string
): void => {
  if (target instanceof FormData) {
    target.append(key, value);
  } else {
    target[key] = value;
  }
};

/**
 * Converts a snake case string to camel case.
 *
 * @param str - A string to convert to camel case.
 */
export const toCamel = (str: string): string => {
  return str.replace(/([-_][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

/**
 * Converts the top-level keys of an object to camel case.
 * This function returns a new object (instead of mutating in place).
 *
 * @param obj - An object with string keys.
 */
export const camelizeTopKeys = (obj: {
  [key: string]: any;
}): { [key: string]: any } => {
  let newObject: { [key: string]: any } = {};

  for (let [key, value] of Object.entries(obj)) {
    newObject[toCamel(key)] = value;
  }

  return newObject;
};

/**
 * Generates a client header.
 *
 * @param givenLabel
 */
export const clientHeader = (givenLabel: string | undefined): string => {
  const label = `@statickit/core@${version}`;
  if (!givenLabel) return label;
  return `${givenLabel} ${label}`;
};

/**
 * The current timestamp.
 */
export const now = (): number => {
  // @ts-ignore
  return 1 * new Date();
};
