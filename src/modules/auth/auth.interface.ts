import type { Role } from "../../../generated/prisma/enums"

export interface ICreateUser{
    name: string,
    email: string,
    password: string,
    role: Role,
    phone?: string
    address?: string,
}

export interface ILoginUser{
    email: string,
    password: string
}