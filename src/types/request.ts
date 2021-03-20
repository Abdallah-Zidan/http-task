import { AxiosError, AxiosRequestConfig } from "axios";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export interface RequestConfigurations extends AxiosRequestConfig {
  /**
   * dont't reject request if failed to verify ssl
   * if false it will be rejected if true it will not be rejected
   * it's the opposide of rejectUnauthorized
   * @default false
   */
  allowUnauthorized?: boolean;
  /**
   * reject the request if failed to verify ssl
   * if true it will be rejected if false it will not be rejected
   * it's the opposide of allowUnauthorized
   * @default true
   */
  rejectUnauthorized?: boolean;
  /**
   * timeout for request in milliseconds
   * @default 0
   */

  /**
   * request headers as javascript object
   * @default {"Content-Type":"application/json"}
   */
  headers?: any;

  /**
   * if true enables some default interceptors that transforms
   * response and error responses
   * @default false
   */
  enableDefaultInterceptors?: boolean;
}

export interface RetryConfig {
  retries?: number;
  delay?: number;
  onRetry?: (e: AxiosError, retries: number) => any;
}
