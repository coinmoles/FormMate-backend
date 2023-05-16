import Ajv, { JSONSchemaType } from "ajv"
import { Next } from "koa"
import { Form } from "../../util/interface/Form"
import { AllContext } from "../../util/interface/KoaRelated"
import { elasticClient } from "../../db/elastic/elasticClient"

const ajv = new Ajv()

interface Ctx {
    searchString: string
    size?: number
    from?: number
    sort?: string
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        searchString: { type: "string" },
        size: { type: "number", nullable: true },
        from: { type: "number", nullable: true },
        sort: { type: "string", nullable: true }
    },
    required: ["searchString"],
    additionalProperties: false
}

const validateBody = ajv.compile(schema)

export const searchFormItem = async (ctx: AllContext, next: Next): Promise<void> => {
    // if (!validateBody(ctx.request.body)) {
    //     ctx.response.status = 400
    //     ctx.response.message = "Invalid request body"
    //     return next()
    // }
    // const { searchString, size, from } = ctx.request.body
    // let searchResult
    // try {
    //      searchResult = await elasticClient.search({
    //         index: "formitems",
    //         size: size ? size : 10,
    //         from: from ? from : 0,
    //         query: {
    //             match: {
    //                 content: searchString
    //             }
    //         }
    //     })
    // }
    // catch (err) {
    //     console.log(err)
    //     ctx.response.status = 500
    //     ctx.response.message = "Unknown Error"
    //     return next()
    // }

    // ctx.response.status = 200
    // ctx.response.body = searchResult.hits.hits.map((item) => item._source)
    // return next()
}