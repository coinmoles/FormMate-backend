export interface UserF {
    userId: string
    email: string
    name: string
    birth: string
    sex: "1" | "2" | "3" |"4"
    contact: string
    address: string
    job: string
    purpose?: string
    scrap: string[]
    belong?: string
    sign?: string
}

export interface User extends UserF {
    password: string
}