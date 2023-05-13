import { FormItemF } from "./FormItem"

export interface Form {
    formId: string
    title: string
    category: string
    author: string
    userA: string | null
    userB: string | null
    count: number
    status: "private" | "public"
    created: string
    updated: string
}

export interface FormF extends Form {
    formItems: FormItemF[]
}