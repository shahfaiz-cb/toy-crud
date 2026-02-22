import { Button, IconSearch, useOverlayState } from "@heroui/react";
import { useTodos } from "./hooks/use-todos";
import { Todo } from "components/todo";
import { Plus } from "@gravity-ui/icons";
import { TodoModal } from "components/todo-modal";
import { useState } from "react";
import { Todo as TodoType } from "types";
import { SearchModal } from "components/search-modal";

export function DashboardPage() {
    const { todos } = useTodos();
    const [editMode, setEditMode] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);

    const state = useOverlayState();
    const searchState = useOverlayState();

    return (
        <div className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">ToyCRUD</h1>
                    <p className="text-sm text-gray-400">
                        Manage your tasks efficiently
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="primary" onPress={searchState.open}>
                        <span className="hidden sm:inline">Search</span>
                        <IconSearch />
                    </Button>

                    <Button
                        variant="primary"
                        onPress={() => {
                            setEditMode(false);
                            setSelectedTodo(null);
                            state.open();
                        }}
                    >
                        <span className="hidden sm:inline">Create</span>
                        <Plus />
                    </Button>
                </div>
            </div>

            {(!todos || todos.length === 0) && (
                <div className="min-h-[40vh] flex items-center justify-center text-gray-400">
                    No todos found.
                </div>
            )}

            {todos && todos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {todos.map((todo) => (
                        <Todo
                            key={todo.id}
                            {...todo}
                            onClick={() => {
                                setEditMode(true);
                                setSelectedTodo(todo);
                                state.open();
                            }}
                        />
                    ))}
                </div>
            )}

            <TodoModal state={state} edit={editMode} {...selectedTodo} />
            <SearchModal state={searchState} />
        </div>
    );
}
