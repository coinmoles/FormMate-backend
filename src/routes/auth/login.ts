import Ajv, { JSONSchemaType } from "ajv"
import ajvErrors from "ajv-errors"
import { Next } from "koa"
import { RefreshToken } from "../../db/mongoose/refreshTokenModel"
import { User } from "../../db/mongoose/userModel"
import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from "../../util/constants/maxLengths"
import { EMAIL_REGEX } from "../../util/constants/regex"
import { signAccess, signRefresh } from "../../util/helper/signToken"
import { setResponse } from "../../util/helper/setResponse"
import { AllContext } from "../../util/interface/KoaRelated"
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../../util/constants/tokenMaxAge"

const ajv = new Ajv({ allErrors: true })
ajvErrors(ajv)

interface Ctx {
    email: string
    password: string
}

const schema: JSONSchemaType<Ctx> = {
    type: "object",
    properties: {
        email: { type: "string", maxLength: MAX_EMAIL_LENGTH, pattern: EMAIL_REGEX.source },
        password: { type: "string", maxLength: MAX_PASSWORD_LENGTH },
    },
    required: ["email", "password"],
    additionalProperties: false
}

const validateBody = ajv.compile(schema)

export const login = async (ctx: AllContext, next: Next): Promise<void> => {
    if (!validateBody(ctx.request.body)) {
        setResponse(ctx, 400, "Invalid request body")
        ctx.body = validateBody.errors
        return
    }
    const { email, password } = ctx.request.body
    
    let userDoc
    try {
        userDoc = await User.findByEmail(email)
    } catch(err) {
        console.error(err)
        setResponse(ctx, 500, "Error connecting to MongoDB")
        return
    }
    if (userDoc === null) {
        setResponse(ctx, 404, "User not found")
        return
    }

    if (!(await userDoc.validatePassword(password))) {
        setResponse(ctx, 401, "Wrong password")
        return
    }

    const accessToken = signAccess(userDoc._id)
    const refreshToken = signRefresh(userDoc._id)
    try { 
        await RefreshToken.registerToken(refreshToken)
    } catch (err){
        console.error(err)
        setResponse(ctx, 500, "Error connecting to MongoDB")
        return
    }

    ctx.cookies.set("access_token", accessToken, { httpOnly: true, maxAge: 1000 * ACCESS_TOKEN_MAX_AGE})
    ctx.cookies.set("refresh_token", refreshToken, { httpOnly: true, maxAge: 1000 * REFRESH_TOKEN_MAX_AGE })

    setResponse(ctx, 201, "Succesfully logged in", userDoc.prettify())
    return next()
}