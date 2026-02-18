import { UseOverlayStateReturn } from "@heroui/react"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "hooks/use-auth"
import toast from "react-hot-toast"
import { editTodo } from "sync/todo-service"
import { queryClient } from "utils"

export const useEditTodo = (reset: () => void, state: UseOverlayStateReturn) => {
    const { token } = useAuth()
    return useMutation({
        mutationFn: editTodo,
        onSuccess: (response) => {
            if(response.success) {
                toast.success(response.message || "Todo created successfully")
                queryClient.invalidateQueries({ queryKey: ["todos", token] })
                reset()
                state.close()
            } else {
                toast.error(response.error || "Error creating todo")
            }
        }
    })
}