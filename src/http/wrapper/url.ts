import { curry } from "../../utility";

export enum Protocol {
  HTTPS = "https",
  HTTP = "http",
}

function isProtocol(protocol: string) {
  return protocol === "https:" || protocol === "http:";
}

function isValidPort(port: any) {
  return port === "" || (!isNaN(+port) && +port > 1);
}

const error1 = (error: any) =>
  Promise.reject({
    code: 1,
    message: "error parsing invalid url",
    error: error.message,
  });

const error = curry((code: any, message: string, url: string) =>
  Promise.reject({
    code,
    message,
    url,
  })
);

const error2 = error(2, "invalid protocol");
const error3 = error(3, "invalid port");

export function parseURL(urlString: string) {
  let url;

  try {
    url = new URL(urlString);
  } catch (e) {
    return error1(e);
  }

  if (!url.origin || !isProtocol(url.protocol)) return error2(url);

  if (!isValidPort(url.port)) return error3(url);
  else return Promise.resolve(url);
}

export function getProtocol(url: URL) {
  if (url && url.protocol && url.protocol.startsWith("https"))
    return Protocol.HTTPS;
  else return Protocol.HTTP;
}

function getPort(url: URL) {
  if (url.port !== "") return +url.port;
  if (getProtocol(url) === Protocol.HTTPS) return 443;
  return 80;
}

export async function urlToConfig(url: string) {
  const urlParts = await parseURL(url);
  return {
    host: urlParts.hostname,
    path: urlParts.pathname,
    port: getPort(urlParts),
    isSSL: getProtocol(urlParts) === Protocol.HTTPS,
  };
}
