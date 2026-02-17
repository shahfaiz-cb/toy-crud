import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { register } from "sync/auth-service"

export const useRegister = () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: register,
        onSuccess: (response) => {
            if(response.success) {
                toast.success(response.message || "Registration successful!")
                navigate("/auth/sign-in")
            } else {
                toast.error(response.error || "Registration failed!")
            }
        }
    })
}