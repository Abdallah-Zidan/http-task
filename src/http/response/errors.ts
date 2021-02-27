import { dropAttr } from "./../../utility/operators";
import { ParsingError } from "./../../types";
import { curry, compactObj } from "../../utility";
import { Semantic } from "../semantics";

export const getRequestInfo = (req: any) =>
  compactObj(dropAttr(["nativeProtocols"], req._options));
export const parseError = (err: ParsingError) => compactObj(err);

const formError = curry(
  (semantic: Semantic, isRequest: boolean, req: any, e: any) => {
    return compactObj({
      semantic,
      ...parseError(e),
      requestError: isRequest,
      responseError: !isRequest,
      config: getRequestInfo(req),
    });
  }
);

export const timeoutErr = formError(Semantic.TIMEOUT, true);
export const requestErr = formError(Semantic.REQUEST_ERROR, true);
export const responseErr = formError(Semantic.RESPONSE_ERROR, false);
export const incompleteErr = formError(Semantic.INCOMPLETE_RESPONSE, false);
export const notfoundErr = formError(Semantic.NOT_FOUND, false);
