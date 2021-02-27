import { Task } from "../ADT";
import { Request } from "../http";
import { RequestConfigurations } from "./request";
export type TaskFromConfig = (input: RequestConfigurations) => Task<Request>;
export type TaskFromRequest = (input: Request) => Task<Request>;
export type TaskFunction = TaskFromConfig & TaskFromRequest;
