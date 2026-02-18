import { UseOverlayStateReturn } from "@heroui/react"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "hooks/use-auth"
import toast from "react-hot-toast"
import { deleteTodo } from "sync/todo-service"
import { queryClient } from "utils"

export const useDeleteTodo = (state: UseOverlayStateReturn) => {
    const { token } = useAuth()
    return useMutation({
        mutationFn: deleteTodo,
        onSuccess: (response) => {
            if(response.success) {
                toast.success(response.message || "Todo deleted successfully")
                queryClient.invalidateQueries({ queryKey: ["todos", token] })
                state.close()
            } else {
                toast.error(response.error || "Error deleting todo")
            }
        }
    })
}