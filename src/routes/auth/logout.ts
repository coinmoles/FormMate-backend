import { Next } from "koa"
import { client } from "../../db/dynamo/client"
import { CustomContext } from "../../util/interface/KoaRelated"
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"

export const logout = async (ctx: CustomContext, next: Next): Promise<void> => {
    const user = ctx.request.user
    const refreshToken = ctx.cookies.get("refresh_token")    
    ctx.cookies.set("access_token", null)
    ctx.cookies.set("refresh_token", null)
    
    if ("errorType" in user) {
        const errorType = user.errorType
        if (errorType === "Token Expired") {
            ctx.response.status = 401
            ctx.response.message = "Login Expired"
            return next()
        }
        else if (errorType === "User Not Found" || errorType === "Wrong Token") {
            ctx.response.status = 401
            ctx.response.message = "No login data"
            return next()
        }
        else {
            ctx.response.status = 500
            ctx.response.message = "Unknown Error"
            return next()
        }
    }
    try {
        await client.send(new DeleteItemCommand({
            TableName: "RefreshToken",
            Key: marshall({
                refreshToken 
            }),

        }))
    } catch (err) {
        console.log(err)
        ctx.response.status = 500
        ctx.response.message = "Unknown Error"
        return next()
    }

    ctx.response.status = 204
    ctx.response.message = "Success"
    return next()
}