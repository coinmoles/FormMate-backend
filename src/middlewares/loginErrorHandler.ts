import { Next } from "koa";
import { AllContext } from "../util/interface/KoaRelated";
import { setResponse } from "../util/helper/setResponse";

export const loginErrorHandler = async (ctx: AllContext, next: Next) => {
    const user = ctx.request.userData.user

    if (!user) {
        const errorMessage = ctx.request.userData.error
        let errorStatus: number
        if (errorMessage === "Login expired" || errorMessage === "Invalid login data" ||
            errorMessage === "No login data" || errorMessage === "Logged in as deleted user")
            errorStatus = 401
        else
            errorStatus = 500
        
        ctx.cookies.set("access_token", null)
        ctx.cookies.set("refresh_token", null)
        setResponse(ctx, errorStatus, errorMessage)
        return
    }

    return next()
}