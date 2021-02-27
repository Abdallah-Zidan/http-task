export interface RequestInfo {
  path: string;
  protocol: string;
  host: string;
  method: string;
  timeout: number;
}

export interface AbstractError {
  code: any;
  message: string;
}

export interface ParsingError extends AbstractError {
  hostname: string;
  errno: any;
  syscall: any;
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export interface RequestConfigurations {
    /**
     * request url in that format <protocol>//<domain>:<port><uri>
     * examples :
     *  http://localhost:4200/test 
     *  http://localhost/test
     *  https://www.example.com/
     */
    url: string;
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
    timeout?: number;
    /**
     * request body in case of | 'POST' | 'PUT' | 'DELETE' | 'PATCH' methods
     * @default {}
     */
    body?: object;
    /**
     * request headers as javascript object
     * @default {"Content-Type":"application/json"}
     */
    headers?: any;
    /**
     * request method 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
     * @default 'GET'
     */
    method?: Method;
    /**
     * maximum number of redirects to follow in case of receiving redirect status code
     * @default 5
     */
    maxRedirects?: number;
    /**
    * Optionally override the trusted CA certificates. Default is to trust
    * the well-known CAs curated by Mozilla. Mozilla's CAs are completely
    * replaced when CAs are explicitly specified using this option.
    */
    ca?: string | Buffer | Array<string | Buffer>;
    /**
     *  Cert chains in PEM format. One cert chain should be provided per
     *  private key. Each cert chain should consist of the PEM formatted
     *  certificate for a provided private key, followed by the PEM
     *  formatted intermediate certificates (if any), in order, and not
     *  including the root CA (the root CA must be pre-known to the peer,
     *  see ca). When providing multiple cert chains, they do not have to
     *  be in the same order as their private keys in key. If the
     *  intermediate certificates are not provided, the peer will not be
     *  able to validate the certificate, and the handshake will fail.
     */
    cert?: string | Buffer | Array<string | Buffer>;
}