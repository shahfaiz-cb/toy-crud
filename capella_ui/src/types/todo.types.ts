export enum Status {
    StatusPending = "pending",
    StatusCompleted = "completed",
    StatusInProgress = "in_progress"
}

export enum Priority {
    PriorityLow = 0,
    PriorityMedium = 1,
    PriorityHigh = 2,
    PriorityUrgent = 3
}

export type Todo = {
    title: string,
    description: string,
    status: Status,
    priority: Priority,
    id: string,
    tags: string[],
    createdAt: Date,
    updatedAt: Date,
    completedAt?: Date
}