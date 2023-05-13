export interface FormItem {
    formItemId: string
    formId: string
    article: number
    paragraph: number
    content: string
    useCount: number
    created: string
    updated: string
}

export interface FormItemF extends FormItem {
    comments: []
}