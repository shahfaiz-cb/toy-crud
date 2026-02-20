import { createContext } from "react"

type AuthContextState = {
    token: string | null
}

type AuthContextActions = {
    setJWT: (token: string) => void,
    removeJWT: () => void
}

type AuthContextType = AuthContextState & AuthContextActions

export const AuthContext = createContext<AuthContextType | undefined>(undefined)