import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { compactObj } from "../utility";
import { RequestError, RequestResponse } from "../types";

function extractConfig(config: any) {
  return compactObj({
    url: config.url,
    headers: config.headers,
    timeout: config.timeout !== 0 ? config.timeout : undefined,
    method: config.method,
    body: config.data,
    rejectUnAuthorized: config.rejectUnauthorized,
  });
}

function extractImportantHeaders(headers: any) {
  return compactObj({
    expires: headers.expires,
    connection: headers.connection,
    server: headers.server,
    contentType: headers["content-type"],
    xPoweredBy: headers["x-powered-by"],
    accessControlAllowCredentials: headers["access-control-allow-credentials"],
  });
}

function defaultRequestError(e: AxiosError): RequestError {
  return compactObj({
    code: e?.code,
    url: e?.config?.url,
    method: e?.config?.method,
    timeout: e?.config?.timeout,
    statusText: e?.response?.statusText,
    status: e?.response?.status,
    isAxiosError: e?.isAxiosError,
    message: e?.message,
    data: e?.response?.data,
    requestData: e?.config?.data,
  });
}

export function responseInterceptor(response: AxiosResponse): RequestResponse {
  return compactObj({
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: extractImportantHeaders(response.headers),
    config: extractConfig(response.config),
  });
}
export function requestInterceptor(config: AxiosRequestConfig) {
  return config;
}

export function errorInterceptor(err: AxiosError) {
  return Promise.reject(defaultRequestError(err));
}
