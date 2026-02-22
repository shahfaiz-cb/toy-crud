import { toast } from "@heroui/react"
import { useAuth } from "auth"
import { useEffect } from "react"
import { closeEventSource, connectEventSource, subscribe } from "sync/event-source"
import { queryClient } from "utils"

type SSEProviderProps = {
    children: React.ReactNode
}

const SSE_URL = "/notifications/stream"

export function SSEProvider({ children }: SSEProviderProps) {
    const { token } = useAuth()

    useEffect(() => {
        if(!token) {
            closeEventSource(SSE_URL)
            return
        }
        
        connectEventSource(SSE_URL, token)

        const invalidateQueries = () => {
            queryClient.invalidateQueries({
                queryKey: ["todos", token]
            })
        }

        const removeCreated = subscribe(SSE_URL, "created", (event) => {
            toast.info("New Todo Created", {
                description: event.data
            })
            invalidateQueries()
        })

        const removeUpdated = subscribe(SSE_URL, "updated", (event) => {
            toast.info("Todo Updated", {
                description: event.data
            })
            invalidateQueries()
        })

        const removeDeleted = subscribe(SSE_URL, "deleted", (event) => {
            toast.info("Todo Deleted", {
                description: event.data
            })
            invalidateQueries()
        })

        return () => {
            removeCreated?.()
            removeUpdated?.()
            removeDeleted?.()
            closeEventSource(SSE_URL)
        }
    }, [token])

    return children
}