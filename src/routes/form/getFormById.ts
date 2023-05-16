import { Next } from "koa"
import { AllContext } from "../../util/interface/KoaRelated"

export const getFormById = async (ctx: AllContext, next: Next): Promise<void> => {
    // const { formid } = ctx.params

    // let result
    // try {
    //     result = await client.send(new GetItemCommand({
    //         TableName: "Form",
    //         Key: marshall({
    //             formId: formid
    //         })
    //     }))
    // } catch(err) {
    //     if (!(err instanceof ResourceNotFoundException)) {
    //         console.log(err)
    //         ctx.response.status = 500
    //         ctx.response.message = "Unknown Error"
    //         return next()
    //     }
    // }
    // if (!result || !result.Item) {
    //     ctx.response.status = 404
    //     ctx.response.message = "Form not found"
    //     return next()
    // }
    // const form = unmarshall(result.Item)

    // let resultFormItem
    // try {
    //     resultFormItem = await client.send(new QueryCommand({
    //         TableName: "FormItem",
    //         IndexName: "formIndex",
    //         KeyConditionExpression: "formId = :v_formid",
    //         ExpressionAttributeValues: {
    //             ":v_formid": { "S": formid }
    //         }
    //     }))
    // } catch(err) {
    //     if (!(err instanceof ResourceNotFoundException)) {
    //         console.log(err)
    //         ctx.response.status = 500
    //         ctx.response.message = "Unknown Error"
    //         return next()
    //     }
    // }
    // if (!resultFormItem || !resultFormItem.Items) {
    //     ctx.response.status = 404
    //     ctx.response.message = "Form not found"
    //     return next()
    // }
    // const formItems = resultFormItem.Items.map((item) => unmarshall(item))

    // ctx.response.status = 200
    // ctx.response.body = {
    //     ...form,
    //     formItems
    // }
    // return next()
}