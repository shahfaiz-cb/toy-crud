import { AuthContext } from "auth";
import { useContext } from "react";

export function useAuth() {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}