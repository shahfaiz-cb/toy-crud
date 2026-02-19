import { deleteRequest, getRequest, postRequest, putRequest } from "sync/request";
import { CreateTodoPayload, CreateTodoResponse, DeleteTodoResponse, EditTodoPayload, EditTodoResponse, GetTodosResponse, SearchTodoResponse, UpdateTodoStatusPayload, UpdateTodoStatusResponse } from "./todo-service.types";

export async function getTodos() {
    return getRequest<GetTodosResponse>("/todos").then((response) => response.data)
}

export async function createTodo(data: CreateTodoPayload) {
    return postRequest<CreateTodoResponse>("/todos", { data })
}

export async function editTodo({data, todoId}: {data: EditTodoPayload, todoId: string}) {
    return putRequest<EditTodoResponse>(`/todos/t/${todoId}`, { data })
}

export async function deleteTodo(todoId: string) {
    return deleteRequest<DeleteTodoResponse>(`/todos/t/${todoId}`)
}

export async function updateStatus({data, todoId}: {data: UpdateTodoStatusPayload, todoId: string}) {
    return putRequest<UpdateTodoStatusResponse>(`/todos/t/${todoId}/status`, { data })
}

export async function searchTodos(query: string) {
    return getRequest<SearchTodoResponse>(`todos/search?query=${query}`).then((response) => response.data)
}