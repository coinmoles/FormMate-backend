import bcrypt from "bcrypt"
import mongoose, { HydratedDocument, Schema } from "mongoose"
import { IUser, UserDocument, UserF, UserMethods, UserModel } from "src/util/interface/User"
import { MAX_ADDRESS_LENGTH, MAX_BIRTH_LENGTH, MAX_CONTACT_LENGTH, MAX_EMAIL_LENGTH, MAX_JOB_LENGTH, MAX_NAME_LENGTH, MAX_OCCUPATION_LENGTH, MAX_PASSWORD_LENGTH, MAX_PURPOSE_LENGTH, MAX_SEX_LENGTH, MAX_SIGN_LENGTH } from "../../util/constants/maxLengths"
import { BIRTH_REGEX, CONTACT_REGEX, EMAIL_REGEX, SEX_REGEX } from "../../util/constants/regex"

const userSchema = new Schema<IUser, UserModel, UserMethods>({
    email: { type: String, required: true, maxLength: MAX_EMAIL_LENGTH, validate: EMAIL_REGEX },
    name: { type: String, required: true, maxLength: MAX_NAME_LENGTH },
    password: { type: String, required: true, maxLength: MAX_PASSWORD_LENGTH },
    birth: { type: String, required: true, maxLength: MAX_BIRTH_LENGTH, validate: BIRTH_REGEX },
    sex: { type: String, required: true, maxLength: MAX_SEX_LENGTH, validate: SEX_REGEX },
    contact: { type: String, required: true, maxLength: MAX_CONTACT_LENGTH, validate: CONTACT_REGEX },
    address: { type: String, required: true, maxLength: MAX_ADDRESS_LENGTH },
    job: { type: String, required: true, maxLength: MAX_JOB_LENGTH },
    purpose: { type: String, required: true, maxLength: MAX_PURPOSE_LENGTH, default: "Unspecified" },
    occupation: { type: String, required: true, maxLength: MAX_OCCUPATION_LENGTH, default: "Unspecified" },
    sign: { type: String, required: true, maxLength: MAX_SIGN_LENGTH, default: "None" },
    scrape: [mongoose.Types.ObjectId]
}, {
    versionKey: false
})

userSchema.static("register", async function (userData: IUser): Promise<UserDocument> {
    const { password, ...args } = userData;
    const passwordHashed = await bcrypt.hash(password, process.env.SALT!)
    const userDoc = new this({ ...args, password: passwordHashed })
    return userDoc.save();
})

userSchema.static("findByEmail", async function (email: string): Promise<UserDocument | null> {
    return this.findOne({ email }).exec()
})

userSchema.static("checkExist", async function (email: string): Promise<boolean> {
    const userDoc = await this.findOne({ email }).exec()
    if (userDoc === null)
        return false;
    else
        return true;
})

userSchema.method<UserDocument>("validatePassword", async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
})

userSchema.method<UserDocument>("prettify", function (): UserF {
    const { _id, password, ...args } = this.toObject()
    return {
        id: _id,
        ...args
    }
})



export const User = mongoose.model<IUser, UserModel>("User", userSchema)
