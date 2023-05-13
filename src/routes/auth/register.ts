import { Context, Next } from "koa"
import Ajv, { JSONSchemaType } from "ajv"
import { client } from "../../db/client"
import { GetItemCommand, PutItemCommand, QueryCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import { User, UserF } from "../../util/interface/User"

const ajv = new Ajv()

interface Ctx {
    email: string
    name: string
    password: string
    birth: string
    sex: "1" | "2" | "3" | "4"
    contact: string
    address: string
    job: string
    purpose?: string
    belong?: string
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        email: { type: "string" },
        name: { type: "string" },
        password: { type: "string" },
        birth: { type: "string" },
        sex: { type: "string" },
        contact: { type: "string" },
        address: { type: "string" },
        job: { type: "string" },
        purpose: { type: "string", nullable: true },
        belong: { type: "string", nullable: true }
    },
    required: ["email", "name", "password", "birth", "sex", "contact", "address", "job"],
    additionalProperties: true
}

const validateBody = ajv.compile(schema)

export const register = async (ctx: Context, next: Next): Promise<void> => {
    if (!validateBody(ctx.request.body)) {
        ctx.response.status = 400
        ctx.response.message = "Invalid request body"
        return next()
    }
    const {
        email,
        name,
        password,
        birth,
        sex,
        contact,
        address,
        job,
        purpose,
        belong
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
    if (result && result.Count && result.Count > 0) {
        ctx.response.status = 409
        ctx.response.message = "User already exists"
        return next()
    }

    const userF: UserF = {
        userId: uuidv4(),
        email,
        name,
        birth,
        sex,
        contact,
        address,
        job,
        purpose: purpose ? purpose : "Unspecified",
        belong: belong ? purpose : "Unspecified",
        scrap: []
    };
    const passwordHashed = await bcrypt.hash(password, process.env.SALT!)
    try {
        await client.send(new PutItemCommand({
            TableName: "User",
            Item: marshall({
                ...userF,
                password: passwordHashed
            })
        }))
    } catch (err) {
        console.error(err)
        ctx.response.status = 500
        ctx.response.message = "Error connecting to DB"
        return next()
    }
    
    ctx.response.status = 201
    ctx.response.message = "Success"
    ctx.response.body = userF
    return next()
}