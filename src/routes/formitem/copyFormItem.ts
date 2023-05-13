import { GetItemCommand, PutItemCommand, ResourceNotFoundException, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import Ajv, { JSONSchemaType } from "ajv"
import { Next } from "koa"
import { CustomContext } from "../../util/interface/KoaRelated"
import { v4 as uuidv4 } from "uuid"
import { client } from "../../db/dynamo/client"
import { elasticClient } from "../../db/elastic/elasticClient"

const ajv = new Ajv()

// TODO: get FORM and do stuff

interface Ctx {
    formItemId: string,
    formId: string
    article: number
    paragraph: number
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        formItemId: { type: "string" },
        formId: { type: "string" },
        article: { type: "number" },
        paragraph: { type: "number" }
    },
    required: ["formId", "formItemId", "article", "paragraph"],
    additionalProperties: false
}

const validateBody = ajv.compile(schema)

export const copyFormItem = async (ctx: CustomContext, next: Next): Promise<void> => {
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

    if (!validateBody(ctx.request.body)) {
        ctx.response.status = 400
        ctx.response.message = "Invalid request body"
        return next()
    }

    const { formItemId, formId, article, paragraph } = ctx.request.body

    let resultFormItem
    try {
        resultFormItem = await client.send(new GetItemCommand({
            TableName: "FormItem",
            Key: marshall({
                formItemId
            })
        }))
    } catch (err) {
        if (!(err instanceof ResourceNotFoundException)) {
            console.log(err)
            ctx.response.status = 500
            ctx.response.message = "Unknown Error"
            return next()
        }
    }
    if (!resultFormItem || !resultFormItem.Item) {
        ctx.response.status = 404
        ctx.response.message = "FormItem not found"
        return next()
    }
    const formItem = unmarshall(resultFormItem.Item)

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
            ctx.response.status = 500
            ctx.response.message = "Unknown Error"
            return next()
        }
    }
    if (!resultForm || !resultForm.Item) {
        ctx.response.status = 404
        ctx.response.message = "Form not found"
        return next()
    }
    const form = unmarshall(resultForm.Item)

    if (user.userId !== form.author) {
        ctx.response.status = 403
        ctx.response.message = "Forbidden"
        return next()
    }

    const newFormItem = {
        ...formItem,
        formItemId: uuidv4(),
        formId,
        created: new Date().toLocaleDateString(),
        updated: new Date().toLocaleDateString(),
        article,
        paragraph,
        count: 0
    }
    console.log()

    try {
        await elasticClient.index({
            index: "formitems",
            id: newFormItem.formItemId,
            body: newFormItem
        })
        await client.send(new UpdateItemCommand({
            TableName: "FormItem",
            Key: marshall({
                formItemId
            }),
            ExpressionAttributeValues: marshall({
                "\:val": 1
            }),
            UpdateExpression: "set useCount = useCount + \:val"
        }))
        await client.send(new UpdateItemCommand({
            TableName: "Form",
            Key: marshall({
                formId: formItem.formId
            }),
            ExpressionAttributeValues: marshall({
                "\:val": 1
            }),
            UpdateExpression: "set useCount = useCount + \:val"
        }))
        await client.send(new PutItemCommand({
            TableName: "FormItem",
            Item: marshall(newFormItem)
        }))
    } catch (err) {
        console.log(err)
        ctx.response.status = 500
        ctx.response.message = "Unknown Error"
        return next()
    }

    ctx.response.status = 201
    ctx.response.message = "Success"
    ctx.response.body = newFormItem
    return next()
}