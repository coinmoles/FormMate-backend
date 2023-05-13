import { Next } from "koa"
import Ajv, { JSONSchemaType } from "ajv"
import { CustomContext } from "src/util/interface/KoaRelated"

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

export const putFormItem = async (ctx: CustomContext, next: Next): Promise<void> => {
    if (!validateBody(ctx.request.body)) {
        ctx.response.status = 400
    }
    
    return next()
}