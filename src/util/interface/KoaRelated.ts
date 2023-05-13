import { DefaultContext, DefaultState } from "koa";
import { User } from "./User";

export interface CustomState extends DefaultState {}
export interface CustomContext extends DefaultContext {
    request: DefaultContext & {
        user: User | { errorType: "Wrong Token" | "User Not Found" | "Token Expired" | "Unknown Error"}
    }
}