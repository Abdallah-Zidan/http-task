import { AxiosError, AxiosResponse } from "axios";
import { Task } from "../task";

export type ResolveFunction<R> = (d: R) => any;
export type RejectFunction<E> = (e: E) => any;

export type RejectionOrObject<R, E> =
  | RejectFunction<E>
  | ForkMethodObject<R, E>;

export type ForkMethodObject<E, R> = {
  reject: RejectFunction<E>;
  resolve: ResolveFunction<R>;
};

export type ForkMethod<E, R> = (
  reject: RejectionOrObject<R, E>,
  resolve: ResolveFunction<R>
) =>  Task<any, any, any> & any;

export type MappableFunction<T> = (d: T) => T;
export type ChainableFunction<T, R> = (d: R) => T;
export interface MappableFunctor<T> {
  map: (fn: MappableFunction<T>) => MappableFunctor<T>;
}

export type ObjectMappingFunction = (arr: [k: string, v: any]) => any;

export interface RequestError extends AxiosError {
  code?: string;
  url: string;
  method: string;
  timeout: number;
  statusText?: string;
  status?: number;
  isAxiosError: boolean;
  message: string;
  data?: object;
  requestData?: object;
}

export interface RequestResponse extends AxiosResponse {
  data: object;
  status: number;
  statusText: string;
  headers: object;
  config: object;
}
