import { defined } from "../utility";

export const checkRejectionCallback = (rejFun: any) => {
  if (!rejFun || typeof rejFun !== "function")
    throw new Error(
      "you must handle rejection by providing {reject : [Function]} which will receive rejection error"
    );
};

const callable = (d:any) => typeof d === "function";

export const checkIfObject = (rej: any) =>
  typeof rej === "object" &&
  defined(rej.resolve) &&
  defined(rej.reject) &&
  callable(rej.reject) &&
  callable(rej.resolve);
