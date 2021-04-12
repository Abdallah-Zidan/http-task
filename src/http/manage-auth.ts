
import { defined } from "../utility";

type AuthConfig =  {
  config: any;
  old?: any;
}

export function manageUnauthorized({
  config,
  old,
}: AuthConfig) {
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
