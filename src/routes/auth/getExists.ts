import { Next } from "koa"
import { User } from "../../db/mongoose/userModel"
import { setResponse } from "../../util/helper/setResponse"
import { AllContext } from "../../util/interface/KoaRelated"
import assert from "assert"

export const getExists = async (ctx: AllContext, next: Next): Promise<void> => {
    const { email } = ctx.params
    assert(typeof email === "string")

    let exist: boolean
    
    try {
        exist = await User.checkExist(email)
    } catch (err) {
        setResponse(ctx, 500, "Error connecting to MongoDB")
        return
    }
    
    setResponse(ctx, 200, "OK", exist)
    return next()
}