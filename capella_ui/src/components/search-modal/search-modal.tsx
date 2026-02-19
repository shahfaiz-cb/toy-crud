import {
    Button,
    IconSearch,
    Modal,
    SearchField,
    Spinner,
    useOverlayState,
    UseOverlayStateReturn,
} from "@heroui/react";
import { useState } from "react";
import { useSearchTodos } from "./hooks/use-search-todos";
import { Todo } from "components/todo";
import { Todo as TodoType } from "types";
import { TodoModal } from "components/todo-modal";

type SearchModalTypes = {
    state: UseOverlayStateReturn;
};

export function SearchModal({ state }: SearchModalTypes) {
    const [search, setSearch] = useState("");
    const { data: todos, isFetching, refetch } = useSearchTodos(search);
    const [editMode, setEditMode] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);

    const localState = useOverlayState();
    return (
        <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-lg">
                        <Modal.Header>
                            <Modal.Heading className="flex justify-center items-center gap-2">
                                <SearchField
                                    name="search"
                                    value={search}
                                    onChange={setSearch}
                                >
                                    <SearchField.Group>
                                        <SearchField.SearchIcon />
                                        <SearchField.Input
                                            className="sm:w-60"
                                            placeholder="Search..."
                                        />
                                        <SearchField.ClearButton />
                                    </SearchField.Group>
                                </SearchField>
                                <Button isIconOnly isPending={isFetching} onClick={() => refetch()}>
                                    {
                                        isFetching ? <Spinner color="current" size="sm"/> : <IconSearch />
                                    }
                                </Button>
                            </Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {(!todos || todos.length === 0) && (
                                <div className="py-10 flex items-center justify-center text-slate-500">
                                    No todos found.
                                </div>
                            )}

                            {todos && todos.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    {todos.map((todo) => (
                                        <Todo
                                            key={todo.id}
                                            {...todo}
                                            onClick={() => {
                                                setEditMode(true);
                                                setSelectedTodo(todo);
                                                localState.open();
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="w-full" slot="close">
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
            <TodoModal state={localState} edit={editMode} {...selectedTodo} />
        </Modal>
    );
}
