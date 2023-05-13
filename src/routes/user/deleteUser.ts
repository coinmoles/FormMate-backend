import { DeleteItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import { Next } from "koa"
import { client } from "../../db/dynamo/client"
import { CustomContext } from "../../util/interface/KoaRelated"

export const deleteUser = async (ctx: CustomContext, next: Next): Promise<void> => {
    const user = ctx.request.user
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
            TableName: "User",
            Key: marshall({
                userId: user.userId 
            }),

        }))
    } catch (err) {
        console.log(err)
        ctx.response.status = 500
        ctx.response.message = "Unknown Error"
        return next()
    }

    ctx.cookies.set("access_token", null)
    ctx.cookies.set("refresh_token", null)
    ctx.response.status = 204
    ctx.response.message = "Success"
    return next()
}