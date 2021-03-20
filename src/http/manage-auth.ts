import { defined } from "../utility";

export function manageUnauthorized({
  config,
  old,
}: {
  config: any;
  old?: any;
}) {
  if (
    !defined(config.allowUnauthorized) &&
    !defined(config.rejectUnauthorized)
  ) {
    return old ? old.rejectUnauthorized : true;
  }

  let result;

  if (defined(config.allowUnauthorized)) {
    result = !config.allowUnauthorized;
  }

  if (defined(config.rejectUnauthorized)) {
    result = config.rejectUnauthorized;
  }
  return result;
}
