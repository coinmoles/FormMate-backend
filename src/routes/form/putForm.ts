import { GetItemCommand, PutItemCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import Ajv, { JSONSchemaType } from "ajv"
import { Next } from "koa"
import { client } from "../../db/dynamo/client"
import { CustomContext } from "src/util/interface/KoaRelated"
import { elasticClient } from "../../db/elastic/elasticClient"

const ajv = new Ajv()

interface Ctx {
    title?: string
    category?: string,
    userA?: string,
    userB?: string,
    status?: "public" | "private"
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        title: { type: "string", nullable: true },
        category: { type: "string", nullable: true },
        userA: { type: "string", nullable: true },
        userB: { type: "string", nullable: true },
        status: { type: "string", nullable: true },
    },
    required: [],
    additionalProperties: false
}


const validateBody = ajv.compile(schema)

export const putForm = async (ctx: CustomContext, next: Next): Promise<void> => {
    const { formid } = ctx.params

    if (!validateBody(ctx.request.body)) {
        ctx.response.status = 400
        ctx.response.message = "Invalid request body"
        return next()
    }

    let result
    try {
        result = await client.send(new GetItemCommand({
            TableName: "forms",
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
    if (!result || !result.Item) {
        ctx.response.status = 404
        ctx.response.message = "Form not found"
        return next()
    }
    const form = unmarshall(result.Item)

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

    if (user.userId !== form.author) {
        ctx.response.status = 403
        return next()
    }

    const {
        title,
        category,
        userA,
        userB,
        status
    } = ctx.request.body

    const newForm = {
        ...form,
        title: title ? title : form.title,
        category: category ? category : form.title,
        userA: userA ? userA : form.userA,
        userB: userB ? userB : form.userB,
        useCount: form.useCount,
        status: status ? status : form.status,
        updated: new Date().toISOString()
    }

    try {
        await elasticClient.index({
            index: "Form",
            id: formid,
            body: newForm
        })
        await client.send(new PutItemCommand({
            TableName: "Form",
            Item: marshall(newForm)
        }))
    } catch (err) {
        console.log(err)
        ctx.response.status = 500
        ctx.response.message = "Unknown Error"
        return next()
    }

    ctx.response.status = 200
    ctx.response.message = "Success"
    ctx.response.body = newForm
    return next()
}