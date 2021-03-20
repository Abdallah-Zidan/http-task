import EventEmitter from "events";
import { compose, map } from "../utility/functions";
import {
  ForkMethod,
  MappableFunction,
  ChainableFunction,
  TaskableMapper,
  EventType,
  EventHandler,
} from "../types";

import validateCallbacks from "./check";

class TaskEmitter extends EventEmitter {}

export enum State {
  FULLFILLED = "FULLFILLED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}

export const Events = {
  REJECTED: "REJECTED",
  FULLFILLED: "FULLFILLED",
  COMPLETE: "COMPLETE",
  START: "START",
};

const isValidEvent = (ev: EventType) => Events[ev];
const emit = (listener: EventEmitter, events: any[], state: any, data: any) =>
  events.forEach((e) => listener.emit(e, { state, data }));

export class Task<T, R, E> {
  fork: ForkMethod<E, R>;
  taskable: T;
  state = State.PENDING;

  protected listener = new TaskEmitter();

  constructor(fork: ForkMethod<E, R>, taskable: T) {
    this.fork = (rej, res) => {
      let { reject, resolve } = validateCallbacks(rej, res);
      emit(this.listener, [Events.START], this.state, taskable);
      fork(this.onRej(reject), this.onRes(resolve));
      return this;
    };
    this.taskable = taskable;
  }

  protected onRej(rej: any) {
    return (e: any) => {
      rej(e);
      this.state = State.REJECTED;
      emit(this.listener, [Events.REJECTED, Events.COMPLETE], this.state, e);
    };
  }

  protected onRes(res: any) {
    return (d: any) => {
      res(d);
      this.state = State.FULLFILLED;
      emit(this.listener, [Events.FULLFILLED, Events.COMPLETE], this.state, d);
    };
  }

  static of<T, R, E>(fork: ForkMethod<E, R>, taskable: T) {
    return new Task<T, R, E>(fork, taskable);
  }

  static resolve(d: any, t: any) {
    return Task.of((_, res) => {
      res(d);
    }, t);
  }

  static reject(e: any, t: any) {
    return Task.of((rej, _) => {
      if (typeof rej === "function") rej(e);
    }, t);
  }

  static from<T, R, E>(task: Task<T, R, E>) {
    let t = new Task<T, R, E>(task.fork, task.taskable);
    t.state = State.PENDING;
    return t;
  }

  map(f: MappableFunction<R>) {
    return new Task<T, R, E>((reject, resolve) => {
      this.fork(reject, compose(resolve, f));
    }, this.taskable);
  }

  chain(fn: ChainableFunction<Task<T, R, E>, R>) {
    return new Task<T, R, E>(
      (reject, resolve) =>
        this.fork(reject, (x: R) => {
          return fn(x).fork(reject, resolve);
        }),
      this.taskable
    );
  }

  mapTaskable(f: TaskableMapper<T>) {
    return new Task<T, R, E>(this.fork, f(this.taskable));
  }

  pipe(...fns: MappableFunction<R>[]) {
    return fns.reduce((p, f) => map(f, p), this);
  }

  compose(...fns: MappableFunction<R>[]) {
    return fns.reduceRight((p, f) => map(f, p), this);
  }

  promise() {
    return new Promise<R>((resolve, reject) => {
      this.fork(reject, resolve);
    });
  }

  listen(event: EventType, handler: EventHandler) {
    if (isValidEvent(event)) this.listener.once(event, handler);
  }
}
