import { Type } from "ajv/dist/compile/util"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../constants/tokenMaxAge"

// access token 발급
export const signAccess = (userId: Types.ObjectId) => {
    const payload = { userId }
    return jwt.sign(payload, process.env.SECRET!, {
        algorithm: "HS256",
        expiresIn: ACCESS_TOKEN_MAX_AGE
    })
}

// refresh token 발급
export const signRefresh = (userId: Types.ObjectId) => {
    return jwt.sign({ userId }, process.env.SECRET!, { // refresh token은 payload 없이 발급
        algorithm: 'HS256',
        expiresIn: REFRESH_TOKEN_MAX_AGE,
    });
}
