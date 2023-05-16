import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Next } from "koa";
import { Types } from "mongoose";
import { User } from "../db/mongoose/userModel";
import { signAccess } from "../util/helper/signToken";
import { verifyAccess } from "../util/helper/verifyToken";
import { RefreshTokenNotFoundError } from "../util/interface/Error";
import { AllContext } from "../util/interface/KoaRelated";
import { UserDocument } from "../util/interface/User";
import { ACCESS_TOKEN_MAX_AGE } from "../util/constants/tokenMaxAge";

export const loginChecker = async (ctx: AllContext, next: Next) => {
    const accessToken = ctx.cookies.get("access_token");
    const refreshToken = ctx.cookies.get("refresh_token");
    if (!refreshToken) {
        ctx.request.userData = { user: null, error: "No login data" }
        return next()
    }

    let userId: Types.ObjectId
    try {
        if (!accessToken)
            throw new TokenExpiredError("", new Date())
        userId = verifyAccess(accessToken);
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            try {
                userId = verifyAccess(refreshToken);
                ctx.cookies.set("access_token", signAccess(userId), { httpOnly: true, maxAge: 1000 * ACCESS_TOKEN_MAX_AGE })
            } catch (err) {
                if (err instanceof TokenExpiredError)
                    ctx.request.userData = { user: null, error: "Login expired" }
                else if (err instanceof JsonWebTokenError || err instanceof RefreshTokenNotFoundError)
                    ctx.request.userData = { user: null, error: "Invalid login data" }
                else
                    ctx.request.userData = { user: null, error: "Unknown error" }
                return
            }
        }
        else if (err instanceof JsonWebTokenError) {
            ctx.request.userData = { user: null, error: "Invalid login data" }
            return
        }
        else {
            console.error(err)
            ctx.request.userData = { user: null, error: "Unknown error" }
            return
        }
    }

    let userDoc: UserDocument | null
    try {
        userDoc = await User.findById(userId)
    } catch (err) {
        console.error(err)
        ctx.request.userData = { user: null, error: "Unknown error" }
        return
    }

    if (userDoc === null) {
        ctx.request.userData = { user: null, error: "Logged in as deleted user" }
        return
    }

    ctx.request.userData = { user: userDoc }
    return next()
}