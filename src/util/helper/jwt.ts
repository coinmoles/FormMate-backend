import { GetItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import jwt from "jsonwebtoken"
import { decode } from "punycode"
import { client } from "../../db/client"
import { promisify } from "util"

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
export const signRefresh = () => {
    return jwt.sign({}, secret, { // refresh token은 payload 없이 발급
        algorithm: 'HS256',
        expiresIn: '14d',
    });
}

export const verifyAccess = (token: string): string | null => {
    try {
        const decoded = jwt.verify(token, secret)
        if (typeof decoded === "string")
            throw TypeError
        return decoded.userId
    } catch (err) {
        return null
    }
}

export const verifyRefresh = async (refreshToken: string, userId: string) => { // refresh token 검증
    let data
    try {
        data = await client.send(new GetItemCommand({
            TableName: "RefreshToken",
            Key: marshall({
                userId
            })
        }));
    } catch (err) {
        return false
    }
    if (data && data.Item) {
        try {
            jwt.verify(refreshToken, secret);
            return true;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
}
