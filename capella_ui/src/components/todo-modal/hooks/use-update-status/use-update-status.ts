import { UseOverlayStateReturn } from "@heroui/react"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "auth"
import toast from "react-hot-toast"
import { updateStatus } from "sync/todo-service"
import { queryClient } from "utils"

export const useUpdateStatus = (state: UseOverlayStateReturn) => {
    const { token } = useAuth()
    return useMutation({
        mutationFn: updateStatus,
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