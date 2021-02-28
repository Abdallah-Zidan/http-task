import { compose, map } from "../utility/functions";
import { ForkMethod, MappableFunction, ChainableFunction } from "../types";
import { RequestResponse } from "../types/response";
import { TaskRejectionType } from "../types/errors";

enum State {
  FULLFILLED = "FULLFILLED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}


export class Task<T> {
  fork: ForkMethod<TaskRejectionType, RequestResponse>;
  request: T;
  state = State.PENDING;
  constructor(
    fork: ForkMethod<TaskRejectionType, RequestResponse>,
    request: T
  ) {
    this.fork = (rej, res) => fork(this.onRej(rej), this.onRes(res));
    this.request = request;
  }

  onRej(rej: any) {
    return (e: any) => {
      if (this.state === State.PENDING) {
        this.state = State.REJECTED;
        rej(e);
      }
    };
  }

  onRes(res: any) {
    return (d: any) => {
      if (this.state === State.PENDING) {
        this.state = State.FULLFILLED;
        res(d);
      }
    };
  }

  static of<T>(
    fork: ForkMethod<TaskRejectionType, RequestResponse>,
    request: T
  ) {
    return new Task<T>(fork, request);
  }

  static resolve<T>(d: any, t: T) {
    return new Task<T>((_, res) => {
      res(d);
    }, t);
  }

  static reject<T>(e: any, t: T) {
    return new Task<T>((reject) => {
      reject(e);
    }, t);
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

  mapRequest(f: any) {
    this.request = f(this.request);
    return this;
  }
  pipe(...fns: MappableFunction[]) {
    return fns.reduce((p, f) => map(f, p), this);
  }

  compose(...fns: MappableFunction[]) {
    return fns.reduceRight((p, f) => map(f, p), this);
  }

  promise() {
    return new Promise((resolve, reject) => {
      this.fork(reject, resolve);
    });
  }

  static fromPromise(p: any) {
    return new Task((reject, resolve) => {
      p.then(resolve).catch(reject);
    }, null);
  }
}