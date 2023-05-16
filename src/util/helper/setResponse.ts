import { AllContext } from "../interface/KoaRelated";

export const setResponse = (ctx: AllContext, status: number, message: string, body?: any) => {
    ctx.status = status;
    ctx.message = message;
    if (body)
        ctx.body = body
}