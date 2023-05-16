import { Context, DefaultState, Request } from "koa";
import { UserDocument } from "./User";

export interface CustomState extends DefaultState {}
export interface AllContext extends Context {
    request: Request & {
        userData: UserData | NoUserData
    }
}

interface UserData {
    user: UserDocument
}

interface NoUserData {
    user: null
    error: "Login expired" | "Invalid login data" | "No login data" | 
        "Logged in as deleted user" | "Unknown error"
}