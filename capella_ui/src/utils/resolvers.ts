export function priorityResolver(priority: number) {
    const priorities = ["Low", "Medium", "High", "Urgent"]
    return priorities[priority]
}

export function priorityEncode(priority: string) {
    switch (priority) {
        case "URGENT": return 3
        case "HIGH": return 2
        case "MEDIUM": return 1
    }
    return 0
}