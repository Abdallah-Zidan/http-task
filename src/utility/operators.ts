import { MappableFunction } from "../types";
import { curry, defined, isArray,trim } from "./functions";
export const toUpper = (str: string) => str && str.toUpperCase();
export const toLower = (str: string) => str && str.toLowerCase();
export const head = (arr: any[]) => isArray(arr) && arr[0];
export const prop = curry((name: any, obj: any) => obj && obj[name]);
export const split = curry((d: string, str: string) => str.split(d));
export const capitalize = (str: string) =>
  str && str[0].toUpperCase() + str.substring(1).toLowerCase();
export const tap = curry((fn: MappableFunction, d: any) => {
  fn(d);
  return d;
});

export const log: (d: any) => void = tap(console.log);
export const injectObj = curry(
  (k: string, v: any, obj: object) => obj && { ...obj, [k]: v }
);
export const push = curry((v: any, arr: any[]) => isArray(arr) && [...arr, v]);

export const parse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return str;
  }
};

export const filterAttr = curry((attr: string[], obj: any) => {
  if (!isArray(attr)) return obj;
  let out: any = {};
  attr.forEach((k) => {
    out[k] = obj[k];
  });
  return compactObj(out);
});

export const dropAttr = curry((attr: string[], obj: any) => {
  if (!isArray(attr)) return obj;
  let out = { ...obj };

  attr.forEach((k) => {
    delete out[k];
  });
  return out;
});
export const toBoolean = (str: string) =>
  trim(str) === "true" ? true : trim(str) === "false" ? false : trim(str);
export function compact(arr: any[]) {
  return arr.filter(defined);
}
export function compactObj(obj: object) {
  let output: any = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (defined(v)) output[k] = v;
  });

  return output;
}

