import { DeleteItemCommand, GetItemCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"
import { Next } from "koa"
import { client } from "../../db/dynamo/client"
import { CustomContext } from "../../util/interface/KoaRelated"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { elasticClient } from "../../db/elastic/elasticClient"

export const deleteFormItem = async (ctx: CustomContext, next: Next): Promise<void> => {
    const { formitemid } = ctx.params

    let result
    try {
        result = await client.send(new GetItemCommand({
            TableName: "FormItem",
            Key: marshall({
                formItemId: formitemid
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
    if (!result || !result.Item) {
        ctx.response.status = 404
        ctx.response.message = "FormItem not found"
        return next()
    }
    const { formId } = unmarshall(result.Item)

    let resultForm
    try {
        resultForm = await client.send(new GetItemCommand({
            TableName: "Form",
            Key: marshall({
                formId
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
    if (!resultForm || !resultForm.Item) {
        ctx.response.status = 404
        ctx.response.message = "Form not found"
        return next()
    }
    const { author } = unmarshall(resultForm.Item)


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

    if (user.userId !== author) {
        ctx.response.status = 403
        return next()
    }

    try {
        await elasticClient.delete({
            index: "formitems",
            id: formitemid
        })
        await client.send(new DeleteItemCommand({
            TableName: "FormItem",
            Key: marshall({
                formItemId: formitemid
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