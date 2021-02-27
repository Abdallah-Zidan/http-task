import { compose, map } from "./../utility/functions";
import { ForkMethod, MappableFunction, ChainableFunction } from "../types";

export class Task<T> {
  fork: ForkMethod;
  request: T;
  constructor(fork: ForkMethod, request: T) {
    this.fork = fork;
    this.request = request;
  }

  static of(fork: ForkMethod, request: any) {
    return new Task(fork, request);
  }

  static resolve(d: any) {
    return new Task((_, res) => {
      res(d);
    }, null);
  }

  static reject(e: any) {
    return new Task((reject) => {
      reject(e);
    }, null);
  }

  map(f: MappableFunction) {
    return new Task((reject, resolve) => {
      this.fork(reject, compose(resolve, f));
    }, this.request);
  }

  chain(fn: ChainableFunction<Task<T>>) {
    return new Task(
      (reject, resolve) =>
        this.fork(reject, (x) => {
          return fn(x).fork(reject, resolve);
        }),
      this.request
    );
  }

  pipe(...fns: MappableFunction[]) {
    return fns.reduce((p, f) => map(f, p), this);
  }

  compose(...fns: MappableFunction[]) {
    return fns.reduceRight((p, f) => map(f, p), this);
  }
}
