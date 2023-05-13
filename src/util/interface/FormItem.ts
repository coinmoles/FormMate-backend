export interface FormItem {
    formItemId: string
    formId: string
    article: number
    paragraph: number
    content: string
    count: number
    created: string
    updated: string
}

export interface FormItemF extends FormItem {
    comments: []
}