import {
    Modal,
    Button,
    Input,
    TextArea,
    Label,
    TextField,
    FieldError,
    UseOverlayStateReturn,
    Form,
    Select,
    Description,
    ListBox,
    Spinner,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { useCreateTodo } from "./hooks/use-create-todo";
import { Priority, Status } from "types";
import { useEffect, useState } from "react";
import { useEditTodo } from "./hooks/use-edit-todo";
import { TrashBin } from "@gravity-ui/icons";
import { useDeleteTodo } from "./hooks/use-delete-todo";
import { useUpdateStatus } from "./hooks/use-update-status";

type CreateTodoForm = {
    title: string;
    description: string;
    tags: string;
    priority: 0 | 1 | 2 | 3;
};

type TodoModalProps = {
    state: UseOverlayStateReturn;
    edit?: boolean,
    title?: string
    description?: string
    status?: Status
    priority?: Priority,
    tags?: string[]
    id?: string
};

export function TodoModal({ state, edit=false, title, description, status, priority, tags, id }: TodoModalProps) {
    const { control, handleSubmit, reset, formState: { isValid }, setValue } = useForm<CreateTodoForm>({
        defaultValues: {
            title: "",
            description: "",
            tags: "",
            priority: 0,
        },
    });

    useEffect(() => {
        if(edit) {
            setValue("title", title || "")
            setValue("description", description || "")
            setValue("priority", priority || 0)
            setValue("tags", tags?.join(", ") || "")
            setStatusValue(status ?? "")
        } else {
            setValue("title", "")
            setValue("description", "")
            setValue("priority", 0)
            setValue("tags", "")
            setStatusValue("")
        }
    }, [state])

    const [ statusValue, setStatusValue ] = useState<string>(status ?? "")

    const { mutate: createMutate, isPending: createIsPending } = useCreateTodo(state)
    const { mutate: editMutate, isPending: editIsPending } = useEditTodo(state)
    const { mutate: deleteMutate, isPending: deleteIsPending } = useDeleteTodo(state)
    const { mutate: updateStatusMutate, isPending: isUpdateStatusPending } = useUpdateStatus(state)

    const onSubmit = (data: CreateTodoForm) => {
        const formatted = {
            ...data,
            tags: data.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        };

        console.log(formatted)

        if(edit) {
            editMutate({
                data: formatted,
                todoId: id ?? ""
            })
        } else {
            createMutate(formatted)
        }
    };

    return (
        <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-lg">
                        <Modal.Header>
                            <Modal.Heading className="flex justify-between items-center">{edit ? "Edit Mode" : "Create Todo"}
                                {
                                    edit && <Button isIconOnly variant="danger" isPending={deleteIsPending || editIsPending || createIsPending || isUpdateStatusPending} onClick={() => deleteMutate(id ??"")}>
                                                {deleteIsPending ? <Spinner size="sm" color="current"/> : <TrashBin/>}
                                            </Button>
                                }
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="space-y-4">
                            <Form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4 px-2"
                            >
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{ required: "Title is required" }}
                                    render={({
                                        field: {
                                            value,
                                            onChange,
                                            name,
                                            onBlur,
                                        },
                                        fieldState: { invalid, error },
                                    }) => (
                                        <TextField
                                            isRequired
                                            value={value}
                                            onChange={onChange}
                                            name={name}
                                            onBlur={onBlur}
                                            isInvalid={invalid}
                                        >
                                            <Label>Description</Label>
                                            <Input placeholder="Title" />
                                            <FieldError>
                                                {error?.message}
                                            </FieldError>
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{
                                        required: "Description is required",
                                    }}
                                    render={({
                                        field: {
                                            value,
                                            onChange,
                                            name,
                                            onBlur,
                                        },
                                        fieldState: { invalid, error },
                                    }) => (
                                        <TextField
                                            isRequired
                                            value={value}
                                            onChange={onChange}
                                            name={name}
                                            onBlur={onBlur}
                                            isInvalid={invalid}
                                        >
                                            <Label>Description</Label>
                                            <TextArea placeholder="Add a description" />
                                            <FieldError>
                                                {error?.message}
                                            </FieldError>
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="tags"
                                    control={control}
                                    render={({
                                        field: {
                                            value,
                                            onChange,
                                            name,
                                            onBlur,
                                        },
                                        fieldState: { invalid, error },
                                    }) => (
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            name={name}
                                            onBlur={onBlur}
                                            isInvalid={invalid}
                                        >
                                            <Label>Tags</Label>
                                            <Input placeholder="Separate tags with (,)" />
                                            <FieldError>
                                                {error?.message}
                                            </FieldError>
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="priority"
                                    control={control}
                                    rules={{ required: "Priority is required" }}
                                    render={({
                                        field: {
                                            value,
                                            onChange,
                                            name,
                                            onBlur,
                                        },
                                        fieldState: { invalid, error },
                                    }) => (
                                        <Select
                                            isRequired
                                            placeholder="Select A Priority"
                                            name={name}
                                            onBlur={onBlur}
                                            isInvalid={invalid}
                                            value={value}
                                            onChange={onChange}
                                        >
                                            <Label>Priority</Label>

                                            <Select.Trigger>
                                                <Select.Value />
                                                <Select.Indicator />
                                            </Select.Trigger>

                                            <Description>
                                                Choose the task priority level
                                            </Description>

                                            <Select.Popover>
                                                <ListBox>
                                                    <ListBox.Item key="LOW" id={0} textValue="LOW">
                                                        <Label>Low</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>

                                                    <ListBox.Item key="MEDIUM" id={1} textValue="MEDIUM">
                                                        <Label>Medium</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>

                                                    <ListBox.Item key="HIGH" id={2} textValue="HIGH">
                                                        <Label>High</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>

                                                    <ListBox.Item key="URGENT" id={3} textValue="URGENT">
                                                        <Label>Urgent</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                </ListBox>
                                            </Select.Popover>

                                            <FieldError>
                                                {error?.message}
                                            </FieldError>
                                        </Select>
                                    )}
                                />

                                {
                                    edit && <Select value={statusValue} onChange={(e) => {
                                        setStatusValue(e?.toString() ?? "")
                                        updateStatusMutate({
                                            data: {
                                                status: e?.toString() ?? "",
                                            },
                                            todoId: id ?? ""
                                        })
                                    }}>
                                        <Label>Status</Label>
                                            <Select.Trigger>
                                                <Select.Value />
                                                <Select.Indicator />
                                            </Select.Trigger>

                                            <Description>
                                                Choose task status
                                            </Description>

                                            <Select.Popover>
                                                <ListBox>
                                                    <ListBox.Item key="Completed" id={"completed"} textValue="Completed">
                                                        <Label>Completed</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>

                                                    <ListBox.Item key="In Progress" id={"in_progress"} textValue="In Progress">
                                                        <Label>In Progress</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>

                                                    <ListBox.Item key="Pending" id={"pending"} textValue="Pending">
                                                        <Label>Pending</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                </ListBox>
                                            </Select.Popover>
                                    </Select>
                                }

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onPress={() => {
                                            reset()
                                            state.close()
                                        }}
                                        isDisabled={createIsPending || editIsPending || deleteIsPending || isUpdateStatusPending}
                                    >
                                        Cancel
                                    </Button>

                                    <Button type="submit" isPending={createIsPending || editIsPending || deleteIsPending || isUpdateStatusPending} isDisabled={!isValid}>
                                        { edit ? "Edit" : "Create"}
                                        {(createIsPending || editIsPending) && <Spinner color="current" size="sm"/>}
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
