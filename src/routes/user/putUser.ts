import { PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import Ajv, { JSONSchemaType } from "ajv"
import { Next } from "koa"
import { client } from "../../db/dynamo/client"
import { CustomContext } from "../../util/interface/KoaRelated"

const ajv = new Ajv()

interface Ctx {
    email?: string
    name?: string
    password?: string
    birth?: string
    sex?: "1" | "2" | "3" | "4"
    contact?: string
    address?: string
    job?: string
    purpose?: string
    belong?: string
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        email: { type: "string", nullable: true },
        name: { type: "string", nullable: true },
        password: { type: "string", nullable: true },
        birth: { type: "string", nullable: true },
        sex: { type: "string", nullable: true },
        contact: { type: "string", nullable: true },
        address: { type: "string", nullable: true },
        job: { type: "string", nullable: true },
        purpose: { type: "string", nullable: true },
        belong: { type: "string", nullable: true }
    },
    required: [],
    additionalProperties: false
}

const validateBody = ajv.compile(schema)

export const putUser = async (ctx: CustomContext, next: Next): Promise<void> => {
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

    const newUser: any = {
        ...user,
        email: email ? email : user.email,
        name: name ? name : user.name,
        password: password ? password : user.password,
        birth: birth ? birth : user.birth,
        sex: sex ? sex : user.sex,
        contact: contact ? contact : user.contact,
        address: address ? address : user.address,
        job: job ? job : user.job,
        purpose: purpose ? purpose : user.purpose,
        belong: belong ? belong : user.belong
    }

    try {
        await client.send(new PutItemCommand({
            TableName: "User",
            Item: marshall(newUser)
        }))
    } catch (err) {
        console.log(err)
        ctx.response.status = 500
        ctx.response.message = "Unknown Error"
        return next()
    }
    
    ctx.response.status = 200
    ctx.response.message = "Success"
    delete newUser.password
    ctx.response.body = newUser
    return next()
}