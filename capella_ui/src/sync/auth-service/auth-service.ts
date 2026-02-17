import { postRequest } from "sync/request";
import { RegistrationPayload, RegistrationResponse } from "./auth-service.types";

export function register(data: RegistrationPayload) {
    return postRequest<RegistrationResponse>("/auth/sign-up", {
        data,
        headers: {
            Authorization: null
        }
    })
}