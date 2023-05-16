import Ajv, { JSONSchemaType } from "ajv"
import ajvErrors from "ajv-errors"
import { Next } from "koa"
import { User } from "../../db/mongoose/userModel"
import { MAX_ADDRESS_LENGTH, MAX_BIRTH_LENGTH, MAX_CONTACT_LENGTH, MAX_EMAIL_LENGTH, MAX_JOB_LENGTH, MAX_NAME_LENGTH, MAX_OCCUPATION_LENGTH, MAX_PASSWORD_LENGTH, MAX_PURPOSE_LENGTH, MAX_SEX_LENGTH, MAX_SIGN_LENGTH } from "../../util/constants/maxLengths"
import { BIRTH_REGEX, CONTACT_REGEX, EMAIL_REGEX, SEX_REGEX } from "../../util/constants/regex"
import { setResponse } from "../../util/helper/setResponse"
import { AllContext } from "../../util/interface/KoaRelated"
import { UserDocument } from "../../util/interface/User"

const ajv = new Ajv({ allErrors: true })
ajvErrors(ajv)

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
    occupation?: string
    sign?: string
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        email: {
            type: "string", maxLength: MAX_EMAIL_LENGTH,
            pattern: EMAIL_REGEX.source
        },
        name: { type: "string", maxLength: MAX_NAME_LENGTH },
        password: { type: "string", maxLength: MAX_PASSWORD_LENGTH },
        birth: {
            type: "string", maxLength: MAX_BIRTH_LENGTH,
            pattern: BIRTH_REGEX.source
        },
        sex: {
            type: "string", maxLength: MAX_SEX_LENGTH,
            pattern: SEX_REGEX.source
        },
        contact: {
            type: "string", maxLength: MAX_CONTACT_LENGTH,
            pattern: CONTACT_REGEX.source
        },
        address: { type: "string", maxLength: MAX_ADDRESS_LENGTH },
        job: { type: "string", maxLength: MAX_JOB_LENGTH },
        purpose: { type: "string", nullable: true, maxLength: MAX_PURPOSE_LENGTH },
        occupation: { type: "string", nullable: true, maxLength: MAX_OCCUPATION_LENGTH },
        sign: { type: "string", nullable: true, maxLength: MAX_SIGN_LENGTH },
    },
    required: ["email", "name", "password", "birth", "sex", "contact", "address", "job"],
    additionalProperties: false
}

const validateBody = ajv.compile(schema)

export const register = async (ctx: AllContext, next: Next): Promise<void> => {
    if (!validateBody(ctx.request.body)) {
        setResponse(ctx, 400, "Invalid request body")
        ctx.body = validateBody.errors
        return
    }
    const { email } = ctx.request.body;

    let exist: boolean
    try {
        exist = await User.checkExist(email)
    } catch (err) {
        console.error(err)
        setResponse(ctx, 500, "Error connecting to MongoDB")
        return
    }
    if (exist) {
        setResponse(ctx, 409, "Account already exists")
        return
    }

    let userDoc: UserDocument
    try {
        userDoc = await User.register({ ...ctx.request.body, scrape: [] })
    } catch (err) {
        console.error(err)
        setResponse(ctx, 500, "Error connecting to MongoDB")
        return
    }

    setResponse(ctx, 201, "Successfully registered", userDoc.prettify())
    return next()
}