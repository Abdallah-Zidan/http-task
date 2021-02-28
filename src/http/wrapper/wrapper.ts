import { urlToConfig } from "./url";
import { Types } from "../response";
import { compactObj } from "../../utility";
import { Task, checkRejectionCallback } from "../../task";
import { sendRequest, manageUnauthorized } from "../adapter";
import {
  TaskFunction,
  ConfigurationsError,
  RequestConfigurations,
} from "../../types";

async function formConfigurations(
  url: string,
  config: any
): Promise<ConfigurationsError | any> {
  const urlConfig = await urlToConfig(url);
  return {
    ...urlConfig,
    ...compactObj(config),
  };
}

function initRequest(config: any) {
  return new Promise((resolve, reject) => {
    let request = sendRequest(resolve, reject);
    formConfigurations(config.url, { ...config, url: undefined })
      .then(request)
      .catch(reject);
  });
}

function initTask(config: any, request: Request) {
  return new Task((reject, resolve: any) => {
    checkRejectionCallback(reject);
    let request = sendRequest(resolve, reject);
    formConfigurations(config.url, { ...config, url: undefined })
      .then(request)
      .catch(reject);
  }, request);
}

export class Request {
  config!: RequestConfigurations;

  private defaultHeaders = {
    "Content-Type": "application/json",
  };

  constructor(config: RequestConfigurations) {
    this.manageConfig(config);
  }

  private manageConfig(config: RequestConfigurations) {
    let headers = config.headers
      ? {
          ...this.defaultHeaders,
          ...config.headers,
        }
      : this.defaultHeaders;

    this.config = {
      ...config,
      headers,
      rejectUnauthorized: manageUnauthorized({ config }),
    };
  }

  static of(config: RequestConfigurations) {
    return new Request({ ...config });
  }

  static from(request: Request) {
    return new Request({ ...request.config });
  }

  setContentType(type: Types) {
    if (!Object.values(Types).includes(type))
      throw new Error("trying to set invalid or unsupported content type");
    else this.config.headers["Content-Type"] = type;
    return this;
  }

  addConfig(config: RequestConfigurations) {
    this.config = {
      ...this.config,
      ...config,
      rejectUnauthorized: manageUnauthorized({ config, old: this.config }),
    };
    return this;
  }

  allowUnauthorized() {
    this.config.rejectUnauthorized = false;
    return this;
  }

  send() {
    return initRequest(compactObj(this.config));
  }

  sendTask() {
    return initTask(compactObj(this.config), this);
  }
}

export function request(config: RequestConfigurations) {
  return Request.of(config);
}
export function doRequest(config: RequestConfigurations) {
  return request(config).send();
}

export const task: TaskFunction = (input: Request | RequestConfigurations) => {
  if (input instanceof Request) return input.sendTask();
  return Request.of(input).sendTask();
};
