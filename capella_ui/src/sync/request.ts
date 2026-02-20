import axios, { AxiosRequestConfig } from "axios";
import { config } from "./../../config/config";
import { AUTH_STORAGE_KEY } from "auth";

const API_URL = config.API_URL;

export const httpClient = axios.create({
    baseURL: API_URL
})

httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export interface ApiResponse<T> {
    data?: T,
    success: boolean,
    message?: string,
    error?: string
}

async function request<T>(config: AxiosRequestConfig) {
    return httpClient
        .request<ApiResponse<T>>(config)
        .then((response) => response.data)
        .catch((error) => {
            if(axios.isAxiosError(error) && error.response) {
                if(error.response?.status === 401 && window.location.pathname !== "/auth/sign-in") {
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                    window.location.href = "/auth/sign-in";
                }
                return error.response.data as ApiResponse<T>
            }
            // any other error
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            } as ApiResponse<T>
        })
}

export function getRequest<T>(url: string, config?: AxiosRequestConfig) {
    return request<T>({
        method: "GET",
        url,
        ...config
    })
}

export function putRequest<T>(url: string, config?: AxiosRequestConfig) {
    return request<T>({
        method: "PUT",
        url,
        ...config
    })
}

export function postRequest<T>(url: string, config?: AxiosRequestConfig) {
    return request<T>({
        method: "POST",
        url,
        ...config
    })
}

export function deleteRequest<T>(url: string, config?: AxiosRequestConfig) {
    return request<T>({
        method: "DELETE",
        url,
        ...config
    })
}
