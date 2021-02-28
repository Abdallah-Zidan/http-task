import { curry, defined, parse } from "../../../utility";
import {
  incompleteErr,
  notfoundErr,
  responseErr,
  timeoutErr,
  requestErr,
} from "../../response/errors";
import { Semantic } from "../../semantics";
import { extractInitialInfo, formOkResponse } from "../../response/response";
import { IncomingMessage } from "http";
import { RejectFunction, ResolveFunction } from "../../../types";
import { RequestResponse } from "../../../types/response";
import { TaskRejectionType } from "../../../types/errors";

declare function require(name: string): any;

const http = require("./follow-redirect").http;
const https = require("./follow-redirect").https;

function writeData(req: any, reject: any, config: any) {
  try {
    if (
      config.headers["Content-Type"] &&
      config.headers["Content-Type"].trim() === "application/json"
    )
      req.write(JSON.stringify(config.body));
    else req.write(config.body);
  } catch (e) {
    req.destroy();
    reject(
      requestErr(req, {
        ...e,
        message: "error writing post data into the request \n" + e.message,
      })
    );
  }
}

export const sendRequest = curry(
  (
    resolve: ResolveFunction<RequestResponse>,
    reject: RejectFunction<TaskRejectionType>,
    config: any
  ) => {
    let client = config.isSSL ? https : http;
    if (!defined(config.maxRedirects)) config.maxRedirects = 5;
    const req = client.request(config, (res: IncomingMessage) => {
      let response: any = {};
      let data = "";
      res.on("resume", () => {
        response = extractInitialInfo(res);
      });
      res.on("data", (chunk: any) => {
        data = data += chunk;
      });

      res.on("error", (e: any) => {
        req.destroy();
        reject(responseErr(req, e));
      });
      res.on("close", () => {
        if (!res.complete) {
          req.destroy();
          return reject(incompleteErr(req, {}));
        } else if (!response.ok) {
          reject({
            ...notfoundErr(req, {}),
            ...response,
            data: parse(data.toString()),
          });
        } else
          resolve(formOkResponse(response, data, Semantic.OK, res.headers));
      });
    });

    req.on("error", (e: any) => {
      req.destroy();
      reject(requestErr(req, e));
    });

    req.on("timeout", () => {
      req.destroy();
      return reject(timeoutErr(req, {}));
    });

    if (config.method !== "GET" && config.body) {
      writeData(req, reject, config);
    }
    req.end();
  }
);
