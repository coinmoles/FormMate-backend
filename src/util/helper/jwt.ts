import { GetItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { decode } from "punycode"
import { client } from "../../db/client"
import { promisify } from "util"
import assert from "assert"

const secret: string = process.env.SECRET!

// access token 발급
export const signAccess = (userId: string) => {
    const payload = { userId }
    return jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: "1h"
    })
}

// refresh token 발급
export const signRefresh = (userId: string) => {
    return jwt.sign({ userId }, secret, { // refresh token은 payload 없이 발급
        algorithm: 'HS256',
        expiresIn: '14d',
    });
}

export const verifyAccess = (token: string): string | {
    errorType: "TokenExpiredError" | "JsonWebTokenError" | "UnknownError"
} => {
    try {
        const decoded = jwt.verify(token, secret)
        assert(typeof decoded !== "string")
        return decoded.userId
    } catch (err) {
        if (err instanceof TokenExpiredError)
            return { errorType: "TokenExpiredError" }
        else if (err instanceof JsonWebTokenError)
            return { errorType: "JsonWebTokenError" }
        else
            return { errorType: "UnknownError" }
    }
}

export const verifyRefresh = async (refreshToken: string): Promise<string | {
    errorType: "NoTokenInDB" | "TokenExpiredError" | "JsonWebTokenError" | "UnknownError"
}> => { // refresh token 검증
    let data
    try {
        data = await client.send(new GetItemCommand({
            TableName: "RefreshToken",
            Key: marshall({
                refreshToken
            })
        }));
    } catch (err) {
        return { errorType: "NoTokenInDB" }
    }
    if (data && data.Item) {
        try {
            const decoded = jwt.verify(refreshToken, secret);
            assert(typeof decoded !== "string")
            return decoded.userId;
        } catch (err) {
            if (err instanceof TokenExpiredError)
                return { errorType: "TokenExpiredError" }
            else if (err instanceof JsonWebTokenError)
                return { errorType: "JsonWebTokenError" }
            else
                return { errorType: "UnknownError" }
        }
    } else {
        return { errorType: "NoTokenInDB" }
    }
}
