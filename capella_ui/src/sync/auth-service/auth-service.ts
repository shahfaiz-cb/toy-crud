import { postRequest } from "sync/request";
import { LoginPayload, LoginResponse, RegistrationPayload, RegistrationResponse } from "./auth-service.types";

export function register(data: RegistrationPayload) {
    return postRequest<RegistrationResponse>("/auth/sign-up", {
        data,
        headers: {
            Authorization: null
        }
    })
}

export function login(data: LoginPayload) {
    return postRequest<LoginResponse>("/auth/login", {
        data,
        headers: {
            Authorization: null
        }
    })
}