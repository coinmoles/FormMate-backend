import assert from "assert"
import { Next } from "koa"
import { RefreshToken } from "../../db/mongoose/refreshTokenModel"
import { setResponse } from "../../util/helper/setResponse"
import { AllContext } from "../../util/interface/KoaRelated"

export const logout = async (ctx: AllContext, next: Next): Promise<void> => {
    const refreshToken = ctx.cookies.get("refresh_token")
    assert(refreshToken)
    ctx.cookies.set("access_token", null)
    ctx.cookies.set("refresh_token", null)
    
    try {
        RefreshToken.deleteToken(refreshToken)
    } catch (err) {
        console.error(err)
        setResponse(ctx, 500, "Error connecting to MongoDB")
        return
    }

    setResponse(ctx, 204, "Succesfully logged out")
    return next()
}