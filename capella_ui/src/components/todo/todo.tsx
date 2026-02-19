import { Card, Chip } from "@heroui/react";
import { Priority, Status } from "types";
import { priorityResolver } from "utils";

type TodoProps = {
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    onClick: () => void
};

export function Todo({
    title,
    description,
    status,
    priority,
    tags,
    createdAt,
    completedAt,
    onClick
}: TodoProps) {
    const statusColor =
        status === "completed"
            ? "success"
            : status === "in_progress"
              ? "warning"
              : "default";

    const priorityColor =
        priority === 3
            ? "danger"
            : priority === 2
              ? "warning"
              : priority === 1
                ? "accent"
                : "default";

    return (
        <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-200 rounded-lg" onClick={onClick}>
            <Card.Header className="flex justify-between items-start gap-2">
                <div className="flex justify-between items-center w-full">
                    <Card.Title className="text-lg font-semibold">
                        {title}
                    </Card.Title>
                    <Card.Description className="text-xs sm:text-sm text-slate-500">
                        Created: {new Date(createdAt).toLocaleDateString()}
                    </Card.Description>
                </div>

                <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                        <Chip color={statusColor} variant="secondary" size="sm">
                            {status.replace("_", " ")}
                        </Chip>
                        <Chip color={priorityColor} variant="soft" size="sm">
                            {priorityResolver(priority)}
                        </Chip>
                    </div>
                    {
                        completedAt && <p className="text-xs sm:text-sm text-slate-500">Completed: {new Date(completedAt).toLocaleDateString()}</p>
                    }
                </div>
            </Card.Header>

            <Card.Content className="text-sm text-slate-700">
                {description}
            </Card.Content>

            {tags && tags.length > 0 && (
                <Card.Footer className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Chip
                            key={tag}
                            size="sm"
                            variant="secondary"
                            className="bg-slate-100 text-slate-600"
                        >
                            {tag}
                        </Chip>
                    ))}
                </Card.Footer>
            )}
        </Card>
    );
}
