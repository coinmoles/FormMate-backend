# Interfaces
- response에 담기는 데이터 기준
## User
```ts
interface User {
    id: string
    email: string
    name: string
    birth: string
    sex: "1" | "2" | "3" |"4"
    contact: string
    address: string
    job: string
    purpose?: string
    scrap: formId[]
    belong?: string
}
```

## Form
```ts
interface Form {
    id: string
    title: string
    category: string
    author: string
    userA: string | null
    userB: string | null
    count: number
    status: "private" | "public"
    created: DateTime
    updated: DateTime
}
```

## FormItem
```ts
interface FormItem {
    id: string
    formId: string
    article: number
    paragraph: number
    content: string
    created: DateTime
    updated: DateTime
}
```

## Log
```ts
interface Log {
    id: string
    formId: string
    formItemId: string
    content: string
    created: DateTime
}
```

## Comment
```ts
interface Comment {
    id: string
    userId: string
    formId: string
    formItemId: string
    content: string
    created: string
}
```