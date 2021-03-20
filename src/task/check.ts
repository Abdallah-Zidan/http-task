import { RejectFunction, ResolveFunction } from "../types";

const callable = (d: any) => typeof d === "function";
const isObject = (d: any) => typeof d === "object" && d !== null;

type ReturnType = {
  resolve: ResolveFunction<any>;
  reject: RejectFunction<any>;
};

export default function validateCallbacks(
  rejFunction: any,
  resFunction: any
): ReturnType {
  if (isObject(rejFunction)) {
    resFunction = rejFunction.resolve;
    rejFunction = rejFunction.reject;
  }

  if (!callable(rejFunction))
    throw new Error(
      "you must handle rejection by providing {reject : [Function]} which will receive rejection error"
    );

  if (!callable(resFunction)) resFunction = () => {};

  return { reject: rejFunction, resolve: resFunction };
}
