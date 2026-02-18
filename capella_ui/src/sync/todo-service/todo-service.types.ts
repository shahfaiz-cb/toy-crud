import { Todo } from "types";

export type GetTodosResponse = Todo[]

export type CreateTodoPayload = {
    title: string,
    description: string,
    tags: string[],
    priority: number
}

export type CreateTodoResponse = Todo