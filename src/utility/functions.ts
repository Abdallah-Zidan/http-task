import {
  MappableFunction,
  MappableFunctor,
  ObjectMappingFunction,
} from "../types";
export function curry(fn: Function) {
  let arity = fn.length;
  return function $curry(...args: any[]) {
    if (args.length === arity) return fn(...args);
    else return fn.bind(null, ...args);
  };
}

export const compose = (...fns: Function[]) => (...args: any[]) =>
  fns.reduceRight((p, f) => [f.call(null, ...p)], args)[0];

export const pipe = (...fns: Function[]) => (...args: any[]) =>
  fns.reduce((p, f) => [f.call(null, ...p)], args)[0];

export const map = curry((fn: MappableFunction, f: MappableFunctor) =>
  f.map(fn)
);
export const isArray = (v: any) => v && Array.isArray(v);
export const defined = (v: any) => v !== null && v !== undefined;
export const definedS = (v: any) =>
  defined(v) && v !== "null" && v !== "undefined";
export const isUndefined = (v: any) => !defined(v);
export const isUndefinedS = (v: any) => !definedS(v);

export const mapObject = curry(
  (fn: ObjectMappingFunction, obj: object) => obj && Object.entries(obj).map(fn)
);
export function trim(str: string) {
  return str.trim();
}
