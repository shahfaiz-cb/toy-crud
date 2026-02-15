import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { config } from "config/config";

const API_URL = config.API_URL

export const httpClient = axios.create({
    baseURL: API_URL
})

async function request<T>(config: AxiosRequestConfig) {
    return httpClient
        .request<T>(config)
        .then((response) => (
            response.data
        ))
        .catch((error: AxiosError) => {
            throw error.response?.data ?? error
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