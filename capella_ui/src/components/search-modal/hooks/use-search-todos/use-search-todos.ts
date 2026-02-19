import { useQuery } from "@tanstack/react-query"
import { useAuth } from "hooks/use-auth"
import { searchTodos } from "sync/todo-service"

export const useSearchTodos = (query: string) => {
    const { token } = useAuth()
    const { data, refetch, isFetching } = useQuery({
        queryFn: () => searchTodos(query),
        queryKey: ["todos", token, "search"],
    })
    return {
        data, isFetching, refetch
    }
}