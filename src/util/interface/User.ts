import { HydratedDocument, Model, Types } from "mongoose"

interface UserBase {
    email: string
    name: string
    birth: string
    sex: "1" | "2" | "3" | "4"
    contact: string
    address: string
    job: string
    scrape: Types.ObjectId[]
    occupation?: string
    purpose?: string
    sign?: string
}

export interface IUser extends UserBase {
    password: string
}

export interface UserF extends UserBase {
    id: Types.ObjectId
}

export interface UserMethods {
    validatePassword(password: string): Promise<boolean>
    prettify(): UserF
}

export type UserDocument = HydratedDocument<IUser, UserMethods>

export interface UserModel extends Model<IUser, {}, UserMethods> {
    register(user: IUser): Promise<UserDocument>
    findByEmail(email: string): Promise<UserDocument | null>
    checkExist(email: string): Promise<boolean>
}
