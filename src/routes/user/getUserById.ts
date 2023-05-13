import { Next } from "koa"
import { client } from "../../db/client"
import { CustomContext } from "../../util/interface/KoaRelated"
import { GetItemCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

export const getUserById = async (ctx: CustomContext, next: Next): Promise<void> => {
    const { userid }: { userid: string } = ctx.params
    
    let result
    try {
        result = await client.send(new GetItemCommand({
            TableName: "User",
            Key: marshall({
                userId: userid
            })
        }))
    } catch(err) {
        if (!(err instanceof ResourceNotFoundException)) {
            console.log(err)
            ctx.response.status = 500
            ctx.response.message = "Unknown Error"
            return next()
        }
    }
    if (!result || !result.Item) {
        ctx.response.status = 404
        ctx.response.message = "User not found"
        return next()
    }
    
    const user = unmarshall(result.Item)
    delete user.password
    ctx.response.status = 200
    ctx.response.message = "Success"
    ctx.response.body = user
    return next()
}