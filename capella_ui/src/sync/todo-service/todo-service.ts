import { getRequest, postRequest } from "sync/request";
import { CreateTodoPayload, CreateTodoResponse, GetTodosResponse } from "./todo-service.types";

export async function getTodos() {
    return getRequest<GetTodosResponse>("/todos").then((response) => response.data)
}

export async function createTodo(data: CreateTodoPayload) {
    return postRequest<CreateTodoResponse>("/todos", { data })
}