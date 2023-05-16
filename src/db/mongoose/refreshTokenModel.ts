import mongoose, { Schema } from "mongoose"
import { IRefreshToken, RefreshTokenDocument, RefreshTokenMethods, RefreshTokenModel } from "../../util/interface/RefreshToken"

const refreshTokenSchema = new Schema<IRefreshToken, RefreshTokenModel, RefreshTokenMethods>({
    refreshToken: { type: String, required: true },
}, {
    versionKey: false
})

refreshTokenSchema.static("registerToken", async function(refreshToken: string): Promise<RefreshTokenDocument> {
    const tokenDoc: RefreshTokenDocument = new this({ refreshToken })
    return await tokenDoc.save()
})

refreshTokenSchema.static("deleteToken", async function(refreshToken: string): Promise<void> {
    await this.deleteOne({ refreshToken }).exec()
})

refreshTokenSchema.static("checkExist", async function(refreshToken: string): Promise<boolean> {
    const doc = await this.findOne({ refreshToken }).exec()
    return doc !== null
})

export const RefreshToken = mongoose.model<IRefreshToken, RefreshTokenModel>("RefreshToken", refreshTokenSchema)