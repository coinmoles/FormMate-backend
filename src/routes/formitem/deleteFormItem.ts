import { Context, Next } from "koa"
import Ajv, { JSONSchemaType } from "ajv"

const ajv = new Ajv()

interface Ctx {

}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {

    },
    required: [],
    additionalProperties: true
}

const validateBody = ajv.compile(schema)

export const deleteFormItem = async (ctx: Context, next: Next): Promise<void> => {
    if (!validateBody(ctx.request.body)) {
        ctx.response.status = 400
    }
    
    return next()
}