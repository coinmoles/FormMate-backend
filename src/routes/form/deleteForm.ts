import { DeleteItemCommand, GetItemCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { Next } from "koa"
import { CustomContext } from "src/util/interface/KoaRelated"
import { client } from "../../db/client"

export const deleteForm = async (ctx: CustomContext, next: Next): Promise<void> => {
    const { formid } = ctx.params
    
    let result
    try {
        result = await client.send(new GetItemCommand({
            TableName: "Form",
            Key: marshall({ 
                formId: formid 
            })
        }))
    } catch (err) {
        if (!(err instanceof ResourceNotFoundException)) {
            console.log(err)
            ctx.response.status = 500;
            ctx.response.message = "Error connecting to DB"
            return next()
        }
    }
    if (!result || !result.Item){
        ctx.response.status = 404
        ctx.response.message = "Form not found"
        return next()
    }
    const { author, formId } = unmarshall(result.Item)

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

    if (user.userId !== author){
        ctx.response.status = 403
        return next()
    }

    try {
        await client.send(new DeleteItemCommand({
            TableName: "Form",
            Key: marshall({
                formId 
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