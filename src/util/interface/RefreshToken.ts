import { HydratedDocument, Model } from "mongoose"

export interface IRefreshToken {
    refreshToken: string
}

export interface RefreshTokenMethods {
}

export type RefreshTokenDocument = HydratedDocument<IRefreshToken, RefreshTokenMethods>

export interface RefreshTokenModel extends Model<IRefreshToken, {}, RefreshTokenMethods> {
    registerToken(refreshToken: string): Promise<RefreshTokenDocument>
    deleteToken(refreshToken: string): Promise<void>
    checkExist(refreshToken: string): Promise<boolean>
}
