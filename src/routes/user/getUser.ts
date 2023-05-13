import { Next } from "koa"
import { client } from "../../db/client"
import { CustomContext } from "../../util/interface/KoaRelated"
import { GetItemCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

export const getUser = async (ctx: CustomContext, next: Next): Promise<void> => {
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

    const userAny: any = user
    delete userAny.password
    ctx.response.status = 200
    ctx.response.message = "Success"
    ctx.response.body = userAny
    return next()
}