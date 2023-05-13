import { PutItemCommand, QueryCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import Ajv, { JSONSchemaType } from "ajv"
import bcrypt from "bcrypt"
import { Next } from "koa"
import { CustomContext } from "src/util/interface/KoaRelated"
import { client } from "../../db/dynamo/client"
import { signAccess, signRefresh } from "../../util/helper/jwt"

const ajv = new Ajv()

interface Ctx {
    email: string
    password: string
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        email: { type: "string" },
        password: { type: "string" },
    },
    required: ["email", "password"],
    additionalProperties: false
}

const validateBody = ajv.compile(schema)

export const login = async (ctx: CustomContext, next: Next): Promise<void> => {
    if (!validateBody(ctx.request.body)) {
        ctx.response.status = 400
        ctx.response.message = "Invalid request body"
        return next()
    }
    const {
        email,
        password
    } = ctx.request.body
    let result;
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
    if (!result || !result.Items || result.Count === 0) {
        ctx.response.status = 404
        ctx.response.message = "User not found"
        return next()
    }

    const user = unmarshall(result.Items[0]);
    const passwordWrong = await bcrypt.compare(password, user.password)
    if (!passwordWrong) {
        ctx.response.status = 401
        ctx.response.message = "Wrong password"
        return next()
    }

    const refreshToken = signRefresh(user.userId)
    try {
        await client.send(new PutItemCommand({
            TableName: "RefreshToken",
            Item: marshall({
                refreshToken
            })
        }))
    } catch (err) {
        console.log(err)
        ctx.response.status = 500
        ctx.response.message = "Unknown Error"
        return next()
    }
    ctx.cookies.set("access_token", signAccess(user.userId), { httpOnly: true, maxAge: 1000 * 60 * 60 })
    ctx.cookies.set("refresh_token", refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 14 })
    
    delete user.password
    ctx.response.status = 201
    ctx.response.body = user

    return next()
}