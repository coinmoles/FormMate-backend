import { Next } from "koa"
import Ajv, { JSONSchemaType } from "ajv"
import { AllContext } from "../../util/interface/KoaRelated"

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

export const getForm = async (ctx: AllContext, next: Next): Promise<void> => {
    if (!validateBody(ctx.request.body)) {
        ctx.response.status = 400
    }
    
    return next()
}