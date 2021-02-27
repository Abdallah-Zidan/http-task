export enum Types {
  JSON = "application/json",
  XML = "text/xml",
  HTML = "text/html",
}

export function mapContentType(contentType:string) {
  if (/^application\/json/.test(contentType)) return Types.JSON;
  else if (/^text\/xml/.test(contentType)) return Types.XML;
  else if (/^text\/html/.test(contentType)) return Types.HTML;
  else return contentType;
}

