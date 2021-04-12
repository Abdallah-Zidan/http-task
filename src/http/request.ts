import { Types } from "./content-types";
import axios, { AxiosInstance } from "axios";
import { RequestConfigurations, RetryConfig } from "../types";
import { manageUnauthorized } from "./manage-auth";
import { errorInterceptor, responseInterceptor } from "./default-interceptors";
import { initRequest, initRetryable, initTask } from "./main-functions";

const mergeHeaders = (config: any, headers: any) =>
  config.headers ? { ...headers, ...config.headers } : headers;

export class Request {
  config!: RequestConfigurations;
  client: AxiosInstance;

  protected defaultHeaders = {
    "Content-Type": "application/json",
  };

  constructor(config: RequestConfigurations) {
    this.manageConfig(config);
    this.client = axios.create();
    if (config.enableDefaultInterceptors)
      this.client.interceptors.response.use(
        responseInterceptor,
        errorInterceptor
      );
  }

  private manageConfig(config: RequestConfigurations) {
    let headers = mergeHeaders(config, this.defaultHeaders);
    let rejectUnauthorized = manageUnauthorized({ config });
    this.config = { ...config, headers, rejectUnauthorized };
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
    let rejectUnauthorized = manageUnauthorized({ config, old: this.config });
    this.config = { ...this.config, ...config, rejectUnauthorized };
    return this;
  }

  allowUnauthorized() {
    this.addConfig({
      allowUnauthorized: true,
    });
    return this;
  }

  getConfig = () => {
    return this.config;
  };
  send() {
    return initRequest(this.getConfig, this.client);
  }

  sendTask = () => {
    return initTask(this.getConfig, this.client, this);
  };

  sendRetryable(retryConfig: RetryConfig) {
    return initRetryable(this.getConfig, this.client, this, retryConfig);
  }
}
