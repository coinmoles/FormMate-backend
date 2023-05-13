import { Next } from "koa"
import Ajv, { JSONSchemaType } from "ajv"
import { CustomContext } from "src/util/interface/KoaRelated"
import { FormItem } from "src/util/interface/FormItem"
import { v4 as uuidv4 } from "uuid"
import { client } from "../../db/client"
import { PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"

const ajv = new Ajv()

// TODO: get FORM and do stuff

interface Ctx {
    formId: string
    article: number
    paragraph: number
    content: string
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        formId: { type: "string" },
        article: { type: "number" },
        paragraph: { type: "number" },
        content: { type: "string" }
    },
    required: ["formId", "article", "paragraph", "content"],
    additionalProperties: true
}

const validateBody = ajv.compile(schema)

export const postFormItem = async (ctx: CustomContext, next: Next): Promise<void> => {
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

        const formItem: FormItem = {
            formItemId: uuidv4(),
            ...ctx.request.body,
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
        
        ctx.response.status = 201
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
                formItemId: uuidv4(),
                ...formItemData,
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
                status: 201,
                message: "Success",
                resource: formItem
            })
        }

        ctx.response.status = 207
        ctx.response.body = bodyList
        return next()
    }
}