import { toast, UseOverlayStateReturn } from "@heroui/react"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "auth"
import { deleteTodo } from "sync/todo-service"
import { queryClient } from "utils"

export const useDeleteTodo = (state: UseOverlayStateReturn) => {
    const { token } = useAuth()
    return useMutation({
        mutationFn: deleteTodo,
        onSuccess: (response) => {
            if(response.success) {
                queryClient.invalidateQueries({ queryKey: ["todos", token] })
                state.close()
            } else {
                toast.danger(response.error || "Error deleting todo")
            }
        }
    })
}