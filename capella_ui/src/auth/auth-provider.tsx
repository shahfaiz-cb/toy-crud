import { AuthContext } from "auth"
import { ReactNode, useState } from "react"

type AuthProviderTypes = {
    children: ReactNode
}

export const AUTH_STORAGE_KEY = "cp_jwt"

export function AuthProvider({ children }: AuthProviderTypes) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_STORAGE_KEY))

    const setJWT = (token: string) => {
        localStorage.setItem(AUTH_STORAGE_KEY, token)
        setToken(token)
    }

    const removeJWT = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        setToken(null)
    }

    return (
        <AuthContext.Provider
            value={{
                token, 
                setJWT,
                removeJWT
            }}
        >{children}</AuthContext.Provider>
    )
}