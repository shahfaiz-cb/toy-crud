import { useMutation } from "@tanstack/react-query"
import { useAuth } from "hooks/use-auth"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { login } from "sync/auth-service"

export const useLogin = () => {
    const navigate = useNavigate()
    const { setJWT } = useAuth()
    return useMutation({
        mutationFn: login,
        onSuccess: (response) => {
            if(response.success && response.data?.token) {
                setJWT(response.data.token)
                toast.success(response.message || "Login successful!")
                navigate("/auth/sign-in")
            } else {
                toast.error(response.error || "Login failed!")
            }
        }
    })
}