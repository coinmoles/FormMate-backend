import assert from "assert"
import jwt from "jsonwebtoken"
import { Types, isValidObjectId, mongo } from "mongoose"
import { RefreshToken } from "../../db/mongoose/refreshTokenModel"
import { RefreshTokenNotFoundError } from "../interface/Error"

export const verifyAccess = (accessToken: string): Types.ObjectId => {
    const decoded = jwt.verify(accessToken, process.env.SECRET!)
    assert (typeof decoded !== "string")
    assert (typeof decoded.userId === "string" && isValidObjectId(decoded.userId))
    return new Types.ObjectId(decoded.userId)
}

export const verifyRefresh = async (refreshToken: string): Promise<Types.ObjectId> => { // refresh token 검증
    let exist: boolean
    exist = await RefreshToken.checkExist(refreshToken)
    if (!exist)
        throw new RefreshTokenNotFoundError()
    const decoded = jwt.verify(refreshToken, process.env.SECRET!);
    assert (typeof decoded !== "string")
    assert (typeof decoded.userId === "string" && isValidObjectId(decoded.userId))
    return new Types.ObjectId(decoded.userId)
}
