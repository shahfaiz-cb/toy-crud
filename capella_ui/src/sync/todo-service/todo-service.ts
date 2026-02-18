import { getRequest } from "sync/request";
import { GetTodosResponse } from "./todo-service.types";

export async function getTodos() {
    return getRequest<GetTodosResponse>("/todos").then((response) => response.data)
}