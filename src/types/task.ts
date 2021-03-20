import { State, Task } from "../task";
import { Request } from "../http";
import { RequestConfigurations } from "./request";
import { AxiosError, AxiosResponse } from "axios";
export type TaskFromConfig = (
  input: RequestConfigurations
) => Task<Request, AxiosResponse, AxiosError>;
export type TaskFromRequest = (
  input: Request
) => Task<Request, AxiosResponse, AxiosError>;
export type TaskFunction = TaskFromConfig & TaskFromRequest;
export type TaskableMapper<T> = (t: T) => T;

export type EventType = "START" | "FULLFILLED" | "REJECTED" | "COMPLETE";
export type EventHandler = ({
  state,
  data,
}: {
  state: State;
  data: any;
}) => void;
