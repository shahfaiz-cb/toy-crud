export type RegistrationPayload = {
    email: string,
    fullName: string,
    password: string,
    confirmPassword: string
}

export type RegistrationResponse = {
    type: string,
    id: string,
    email: string,
    fullName: string,
}

export type LoginPayload = {
    email: string,
    password: string
}

export type LoginResponse = {
    token: string
}