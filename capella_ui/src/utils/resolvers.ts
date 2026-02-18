export function priorityResolver(priority: number) {
    const priorities = ["Low", "Medium", "High", "Urgent"]
    return priorities[priority]
}