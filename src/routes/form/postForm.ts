import { Next } from "koa"
import Ajv, { JSONSchemaType } from "ajv"
import { CustomContext } from "src/util/interface/KoaRelated"
import { Form } from "src/util/interface/Form"
import { v4 as uuidv4 } from "uuid"
import { client } from "../../db/client"
import { PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"

const ajv = new Ajv()

interface Ctx {
    title: string
    category?: string,
    userA?: string,
    userB?: string,
    status?: "public" | "private"
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        title: { type: "string" },
        category: { type: "string", nullable: true },
        userA: { type: "string", nullable: true },
        userB: { type: "string", nullable: true },
        status: { type: "string", nullable: true },
    },
    required: ["title"],
    additionalProperties: false
}

const validateBody = ajv.compile(schema)

export const postForm = async (ctx: CustomContext, next: Next): Promise<void> => {
    if (!validateBody(ctx.request.body)) {
        ctx.response.status = 400
        ctx.response.message = "Invalid request body"
        return next()
    }

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

    const {
        title,
        category,
        userA,
        userB,
        status
    } = ctx.request.body

    const form: Form = {
        formId: uuidv4(),
        author: user.userId,
        title,
        category: category ? category : "Uncategorized",
        userA: userA ? userA : null,
        userB: userB ? userB : null,
        useCount: 0,
        status: status ? status : "public",
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    }
    
    try {
        await client.send(new PutItemCommand({
            TableName: "Form",
            Item: marshall(form)
        }))
    } catch (err) {
        console.log(err)
        ctx.response.status = 500
        ctx.response.message = "Unknown Error"
        return next()
    }
    
    ctx.response.status = 201
    ctx.response.message = "Success"
    ctx.response.body = form
    return next()
}