import https from "https";
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { RetryConfig } from "../types";
import { compactObj } from "../utility";
import { Task } from "../task";
import { Request } from "./request";
import validateCallbacks from "../task/check";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export function initRequest(config: any, client: AxiosInstance) {
  return client(
    compactObj({
      ...config(),
      httpsAgent: config.rejectUnauthorized && httpsAgent,
    })
  );
}

export function initTask(config: any, client: AxiosInstance, request: Request) {
  return new Task<Request, AxiosResponse, AxiosError>((rej, res) => {
    let { reject, resolve } = validateCallbacks(rej, res);
    initRequest(config, client).then(resolve).catch(reject);
  }, request);
}

export function retryRequest(
  config: any,
  client: AxiosInstance,
  retryConfig?: RetryConfig
): any {
  let {
    retries = 3,
    delay = 1000,
    onRetry = (_: AxiosError, _$: number) => {},
  } = retryConfig || {};
  return initRequest(config, client).catch((e) => {
    if (retries < 1) throw e;
    onRetry(e, retries);
    return new Promise((res, _) => {
      setTimeout(() => {
        res(
          retryRequest(config, client, {
            retries: retries - 1,
            delay: delay + 500,
            onRetry,
          })
        );
      }, delay);
    });
  });
}

export function initRetryable(
  config: any,
  client: AxiosInstance,
  request: Request,
  retryConfig?: RetryConfig
) {
  return new Task<Request, AxiosResponse, AxiosError>((reject, resolve) => {
    retryRequest(config, client, retryConfig).then(resolve).catch(reject);
  }, request);
}
