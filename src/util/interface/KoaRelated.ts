import { Context, DefaultState, Request } from "koa";
import { User } from "./User";

export interface CustomState extends DefaultState {}
export interface CustomContext extends Context {
    request: Request & {
        user: User | { errorType: "Wrong Token" | "User Not Found" | "Token Expired" | "Unknown Error"}
    }
}