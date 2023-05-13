export interface FormItem {
    formItemId: string
    formId: string
    article: number
    paragraph: number
    content: string
    created: Date
    updated: Date
}

export interface FormItemF extends FormItem {
    comments: []
}