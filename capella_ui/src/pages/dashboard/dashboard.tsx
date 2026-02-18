import { Button, Modal, useOverlayState } from "@heroui/react";
import { useTodos } from "./hooks/use-todos";
import { Todo } from "components/todo";
import { Plus } from "@gravity-ui/icons";
import { TodoModal } from "components/todo-modal";
import { useState } from "react";
import { Todo as TodoType } from "types";

export function DashboardPage() {
    const { todos } = useTodos();
    const [ editMode, setEditMode ] = useState(false)
    const [ selectedTodo, setSelectedTodo ] = useState<TodoType | null>(null)

    const state = useOverlayState();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">
                        ToyCRUD
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage your tasks efficiently
                    </p>
                </div>
                <Button variant="primary" onPress={() => {
                    setEditMode(false)
                    setSelectedTodo(null)
                    state.open()
                }}>
                    Create
                    <Plus />
                </Button>
            </div>

            {(!todos || todos.length === 0) && (
                <div className="min-h-[40vh] flex items-center justify-center text-slate-500">
                    No todos found.
                </div>
            )}

            {todos && todos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {todos.map((todo) => (
                        <Todo key={todo.id} {...todo} onClick={() => {
                            setEditMode(true)
                            setSelectedTodo(todo)
                            state.open()
                        }}/>
                    ))}
                </div>
            )}

            <TodoModal state={state} edit={editMode} {...selectedTodo}/>
        </div>
    );
}
