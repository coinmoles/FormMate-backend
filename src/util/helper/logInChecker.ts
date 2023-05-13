import { GetItemCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Next } from "koa";
import { client } from "../../db/client";
import { CustomContext } from "../interface/KoaRelated";
import { User } from "../interface/User";
import { signAccess, verifyAccess, verifyRefresh } from "./jwt";
import e from "express";

export const loginChecker = async (ctx: CustomContext, next: Next) => {
    const accessToken = ctx.cookies.get("access_token");
    const refreshToken = ctx.cookies.get("refresh_token");
    if (!accessToken || !refreshToken) {
        ctx.request.user = { errorType: "Wrong Token" }
        return next()
    }

    let userId = verifyAccess(accessToken);

    // access token 확인에서 에러
    if (typeof userId !== "string") {
        if (userId.errorType = "TokenExpiredError") {
            const userIdRe = await verifyRefresh(refreshToken)
            if (typeof userIdRe !== "string") {
                if (userIdRe.errorType === "TokenExpiredError")
                    ctx.request.user = { errorType: "Token Expired" }
                else
                    ctx.request.user = { errorType: "Wrong Token" }
                return next()
            }
            else {
                userId = userIdRe
                ctx.cookies.set("access_token", signAccess(userId), { httpOnly: true, maxAge: 1000 * 60 * 60 })
            }
        }
        else {
            ctx.request.user = { errorType: "Wrong Token" }
            return next()
        }
    }

    let result
    try {
        result = await client.send(new GetItemCommand({
            TableName: "User",
            Key: marshall({
                userId
            })
        }))
    } catch (err) {
        if (!(err instanceof ResourceNotFoundException)) {
            ctx.request.user = { errorType: "Unknown Error" }
            return next()
        }
    }
    if (!result || !result.Item) {
        ctx.request.user = { errorType: "User Not Found" }
        return next()
    }
    ctx.request.user = unmarshall(result.Item) as User
    return next()
}