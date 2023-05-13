import { GetItemCommand, PutItemCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import Ajv, { JSONSchemaType } from "ajv"
import { Next } from "koa"
import { FormItem } from "src/util/interface/FormItem"
import { CustomContext } from "src/util/interface/KoaRelated"
import { v4 as uuidv4 } from "uuid"
import { client } from "../../db/client"

const ajv = new Ajv()

// TODO: get FORM and do stuff

interface Ctx {
    formItemId: string
    formId: string
    article: number
    paragraph: number
    content: string
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        formItemId: { type: "string" },
        formId: { type: "string" },
        article: { type: "number" },
        paragraph: { type: "number" },
        content: { type: "string" }
    },
    required: ["formItemId", "formId", "article", "paragraph", "content"],
    additionalProperties: false
}

const validateBody = ajv.compile(schema)

export const patchFormItem = async (ctx: CustomContext, next: Next): Promise<void> => {
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

    if (!Array.isArray(ctx.request.body)) {
        if (!validateBody(ctx.request.body)) {
            ctx.response.status = 400
            ctx.response.message = "Invalid request body"
            return next()
        }
        const { formId } = ctx.request.body
        
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

        const formItem: FormItem = {
            ...ctx.request.body,
            useCount: 0,
            created: new Date().toLocaleDateString(),
            updated: new Date().toLocaleDateString()
        }

        try {
            await client.send(new PutItemCommand({
                TableName: "FormItem",
                Item: marshall(formItem)
            }))
        } catch (err) {
            console.log(err)
            ctx.response.status = 500
            ctx.response.message = "Unknown Error"
            return next()
        }

        ctx.response.status = 200
        ctx.response.message = "Success"
        ctx.response.body = formItem
        return next()
    }
    else {
        const bodyList: { status: number, message: string, resource?: FormItem }[] = []
        for (const formItemData of ctx.request.body) {
            if (!validateBody(formItemData)) {
                bodyList.push({
                    status: 400,
                    message: "Invalid request body"
                })
                continue
            }

            const formItem: FormItem = {
                ...formItemData,
                useCount: 0,
                created: new Date().toLocaleDateString(),
                updated: new Date().toLocaleDateString()
            }

            try {
                await client.send(new PutItemCommand({
                    TableName: "FormItem",
                    Item: marshall(formItem)
                }))
            } catch (err) {
                console.log(err)
                bodyList.push({
                    status: 500,
                    message: "Unknown error"
                })
            }

            bodyList.push({
                status: 200,
                message: "Success",
                resource: formItem
            })
        }

        ctx.response.status = 207
        ctx.response.body = bodyList
        return next()
    }
}