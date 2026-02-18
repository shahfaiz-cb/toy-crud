import { UseOverlayStateReturn } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "hooks/use-auth"
import toast from "react-hot-toast"
import { createTodo } from "sync/todo-service"

export const useCreateTodo = (reset: ()=>void, state: UseOverlayStateReturn) => {
    const { token } = useAuth()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createTodo,
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