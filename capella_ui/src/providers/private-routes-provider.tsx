import { useAuth } from "hooks/use-auth";
import { Navigate } from "react-router-dom";

type PrivateRoutesProviderProps = {
    children: React.ReactNode
}

export function PrivateRoutesProvider({ children }: PrivateRoutesProviderProps) {
    const { token } = useAuth()

    if(!token) {
        return <Navigate to={"/auth/sign-in"} replace/>
    }

    return children
}