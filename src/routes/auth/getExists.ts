import { Next } from "koa"
import { client } from "../../db/client"
import { CustomContext } from "../../util/interface/KoaRelated"
import { QueryCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"

export const getExists = async (ctx: CustomContext, next: Next): Promise<void> => {
    const { email } = ctx.params
    if (!email)
        ctx.response.body = false

    let result
    try {
        result = await client.send(new QueryCommand({
            TableName: "User",
            IndexName: "emailIndex",
            KeyConditionExpression: "email = :v_email",
            ExpressionAttributeValues: {
                ":v_email": { "S": email }
            },
        }))
    } catch (err) {
        if (!(err instanceof ResourceNotFoundException)) {
            console.log(err)
            ctx.response.status = 500;
            ctx.response.message = "Error connecting to DB"
            return next()
        }
    }
    if (!result || !result.Count || result.Count === 0)
        ctx.response.body = false
    else
        ctx.response.body = true
    
    ctx.response.status = 200
    ctx.response.message = "Success"
    return next()
}