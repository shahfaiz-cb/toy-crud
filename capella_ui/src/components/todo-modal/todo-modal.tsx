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
import { priorityEncode } from "utils";
import { useCreateTodo } from "./hooks/use-create-todo";

type CreateTodoForm = {
    title: string;
    description: string;
    tags: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
};

type TodoModalProps = {
    state: UseOverlayStateReturn;
};

export function TodoModal({ state }: TodoModalProps) {
    const { control, handleSubmit, reset, formState: { isValid } } = useForm<CreateTodoForm>({
        defaultValues: {
            title: "",
            description: "",
            tags: "",
            priority: "LOW",
        },
    });

    const { mutate, isPending } = useCreateTodo(reset, state)

    const onSubmit = (data: CreateTodoForm) => {
        const formatted = {
            ...data,
            tags: data.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            priority: priorityEncode(data.priority)
        };

        mutate(formatted)
    };

    return (
        <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-lg">
                        <Modal.Header>
                            <Modal.Heading>Todo</Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="space-y-4">
                            <Form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4 px-2"
                            >
                                {/* Title */}
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

                                {/* Description */}
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

                                {/* Tags */}
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
                                                    <ListBox.Item key="LOW" id={"LOW"} textValue="LOW">
                                                        <Label>Low</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>

                                                    <ListBox.Item key="MEDIUM" id={"MEDIUM"} textValue="MEDIUM">
                                                        <Label>Medium</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>

                                                    <ListBox.Item key="HIGH" id={"HIGH"} textValue="HIGH">
                                                        <Label>High</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>

                                                    <ListBox.Item key="URGENT" id={"URGENT"} textValue="URGENT">
                                                        <Label>High</Label>
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

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onPress={() => {
                                            reset()
                                            state.close()
                                        }}
                                        isDisabled={isPending}
                                    >
                                        Cancel
                                    </Button>

                                    <Button type="submit" isPending={isPending} isDisabled={!isValid}>
                                        Create
                                        {isPending && <Spinner color="current" size="sm"/>}
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
