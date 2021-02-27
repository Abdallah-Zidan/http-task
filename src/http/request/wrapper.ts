import { TaskFunction } from "./../../types/task";
import { RequestConfigurations } from "./../../types";
import { compactObj } from "../../utility";
import { urlToConfig } from "./url";
import { sendRequest, manageUnauthorized } from "../adapter";
import { Types } from "../response/content-types";
import { Task, checkRejectionCallback } from "../../ADT";

async function formConfigurations(url: string, config: any) {
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
  return new Task((reject, resolve) => {
    // if (checkIfObject(reject)) {
    //   resolve = reject.resolve;
    //   reject = reject.reject;
    // }
    checkRejectionCallback(reject);
    let request = sendRequest(resolve, reject);
    formConfigurations(config.url, { ...config, url: undefined })
      .then(request)
      .catch(reject);
  }, request);
}

export class Request {
  #config: RequestConfigurations;

  #defaultHeaders = {
    "Content-Type": "application/json",
  };

  constructor(config: RequestConfigurations) {
    let headers = config.headers
      ? {
          ...this.#defaultHeaders,
          ...config.headers,
        }
      : this.#defaultHeaders;

    this.#config = {
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
    else this.#config.headers["Content-Type"] = type;
    return this;
  }

  get config() {
    return this.#config;
  }

  addConfig(config: RequestConfigurations) {
    this.#config = {
      ...this.#config,
      ...config,
      rejectUnauthorized: manageUnauthorized({ config, old: this.#config }),
    };
    return this;
  }

  allowUnauthorized() {
    this.#config.rejectUnauthorized = false;
    return this;
  }

  send() {
    return initRequest(compactObj(this.#config));
  }

  sendTask() {
    return initTask(compactObj(this.#config), this);
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
