import { GetItemCommand, PutItemCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import Ajv, { JSONSchemaType } from "ajv"
import { Next } from "koa"
import { client } from "../../db/dynamo/client"
import { CustomContext } from "../../util/interface/KoaRelated"
import { elasticClient } from "../../db/elastic/elasticClient"

const ajv = new Ajv()

// TODO: get FORM and do stuff

interface Ctx {
    article?: number
    paragraph?: number
    content?: string
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        article: { type: "number", nullable: true },
        paragraph: { type: "number", nullable: true },
        content: { type: "string", nullable: true }
    },
    required: [],
    additionalProperties: false
}

const validateBody = ajv.compile(schema)


export const putFormItem = async (ctx: CustomContext, next: Next): Promise<void> => {
    const { formitemid } = ctx.params

    if (!validateBody(ctx.request.body)) {
        ctx.response.status = 400
        ctx.response.message = "Invalid request body"
        return next()
    }

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
    if (!result || !result.Item){
        ctx.response.status = 404
        ctx.response.message = "FormItem not found"
        return next()
    }
    const formItem = unmarshall(result.Item)

    let resultForm
    try {
        resultForm = await client.send(new GetItemCommand({
            TableName: "Form",
            Key: marshall({ 
                formId: formItem.formId 
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
    if (!resultForm || !resultForm.Item){
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

    if (user.userId !== author){
        ctx.response.status = 403
        return next()
    }

    const {
        article,
        paragraph,
        content
    } = ctx.request.body
    const newFormItem = {
        ...formItem,
        article: article ? article : formItem.article,
        paragraph: paragraph ? paragraph : formItem.paragraph,
        content: content ? content : formItem.content,
        updated: new Date().toISOString()
    }
    try {
        await elasticClient.index({
            index: "formitems",
            id: formitemid,
            body: newFormItem
        })
        await client.send(new PutItemCommand({
            TableName: "Form",
            Item: marshall(newFormItem)
        }))
    } catch (err) {
        console.log(err)
        ctx.response.status = 500
        ctx.response.message = "Unknown Error"
        return next()
    }
    
    ctx.response.status = 200
    ctx.response.message = "Success"
    ctx.response.body = newFormItem
    return next()
}