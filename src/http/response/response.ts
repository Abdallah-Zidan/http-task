import { parse, compactObj, trim } from "../../utility";
import { Types, mapContentType } from "./content-types";
import { Semantic } from "../semantics";
import { parseHeaders } from "./headers";
const isString = (val: any) => typeof val === "string";

export const getContentType = (content: any) => {
  if (!content || !isString(content)) return {};
  const [contentType, charset] = content && content.split(";").map(trim);
  return { contentType, charset };
};

export const extractInitialInfo = (res: any) =>
  compactObj({
    status: res && res.statusCode,
    statusText: res && res.statusMessage,
    ok: res ? res.statusCode < 400 : false,
    contentType: getContentType(res.headers["content-type"]).contentType,
  });

export function formOkResponse(
  response: any,
  data: any,
  semantic: Semantic,
  headers: any
) {
  const type = mapContentType(response.contentType);

  if (data && type === Types.JSON) data = parse(data.toString());
  else if (data && (type === Types.XML || type === Types.HTML))
    data = data.toString();

  return compactObj({
    semantic,
    ...response,
    data,
    headers: parseHeaders(headers),
  });
}
