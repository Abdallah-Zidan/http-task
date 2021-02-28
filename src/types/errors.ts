import { AbstractResponse } from "./response";
export interface AbstractError {
  code: any;
  message: string;
}

export interface ParsingError extends AbstractError {
  hostname: string;
  errno: any;
  syscall: any;
}

export interface Config {
  maxRedirects: number;
  maxBodyLength?: number;
  protocol?: string;
  path?: string;
  port?: number;
  isSSL?: boolean;
  timeout?: number;
  headers?: object;
  rejectUnauthorized?: boolean;
  hostname?: string;
  pathname?: string;
}

export interface RequestError extends AbstractResponse {
  requestError?: boolean;
  responseError?: boolean;
  config?: Config;
}

export interface ResponseError extends RequestError {
  status?: number;
  statusText?: string;
  ok?: boolean;
  contentType?: string;
  data?: object;
}

export interface ConfigError {
  url: URL;
  message: string;
  code: number;
}

export type ConfigurationsError = ParsingError | ConfigError;
export type TaskRejectionType = ConfigurationsError | RequestError | ResponseError;

