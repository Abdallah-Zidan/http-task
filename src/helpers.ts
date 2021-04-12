import { Request } from "./http";
import { RequestConfigurations, TaskFunction, RetryConfig } from "./types";
import { Task } from "./task";
import { AxiosError, AxiosResponse } from "axios";

export function request(config: RequestConfigurations) {
  return Request.of(config);
}
export function sendRequest(config: RequestConfigurations) {
  return request(config).send();
}

export const task: TaskFunction = (input: Request | RequestConfigurations) => {
  if (input instanceof Request) return input.sendTask();
  return Request.of(input).sendTask();
};

export function from(task: Task<Request, AxiosResponse, AxiosError>) {
  return Task.from(task);
}

export function retryableTask(
  input: Request | RequestConfigurations,
  retryConfig: RetryConfig
) {
  if (input instanceof Request) return input.sendRetryable(retryConfig);
  return Request.of(input).sendRetryable(retryConfig);
}
