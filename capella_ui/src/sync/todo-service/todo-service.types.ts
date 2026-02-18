import { Todo } from "types";

export type GetTodosResponse = Todo[]

export type CreateTodoPayload = {
    title: string,
    description: string,
    tags: string[],
    priority: number
}

export type CreateTodoResponse = Todo

export type EditTodoPayload = {
    title: string,
    description: string,
    tags: string[],
    priority: number
}

export type EditTodoResponse = Todo

export type DeleteTodoResponse = Todo

export type UpdateTodoStatusPayload = {
    status: string
}

export type UpdateTodoStatusResponse = Todo