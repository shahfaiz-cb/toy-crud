import { useQuery } from "@tanstack/react-query"
import { useAuth } from "auth"
import { getTodos } from "sync/todo-service"

export const useTodos = () => {
    const { token } = useAuth()
    const {
        data: todos
    } = useQuery({
        queryKey: ["todos", token],
        queryFn: getTodos,
        enabled: !!token
    })

    return {
        todos
    }
}