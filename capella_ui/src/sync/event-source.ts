import { EventSourcePolyfill } from "event-source-polyfill"

const connections = new Map<string, EventSourcePolyfill>();

export function connectEventSource(url: string, token: string) {
    const existingES = connections.get(url)
    if(existingES) return existingES

    const eventSource = new EventSourcePolyfill(`${process.env.API_URL}${url}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    eventSource.onopen = (event) => {
        console.log("SSE connected :", event)
    }

    eventSource.onerror = (error) => {
        console.error("SSE error :", error)
    }

    connections.set(url, eventSource)
    return eventSource
}

export function subscribe(url: string, eventType: string, eventHandler: (event: MessageEvent) => void) {
    const eventSource = connections.get(url)
    if(!eventSource) return;
    eventSource.addEventListener(eventType, eventHandler as any)
    return () => {
        eventSource?.removeEventListener(eventType, eventHandler as any)
    }
}

export function closeEventSource(url: string) {
    const eventSource = connections.get(url)
    if(eventSource) {
        eventSource.close()
        connections.delete(url)
    }
}