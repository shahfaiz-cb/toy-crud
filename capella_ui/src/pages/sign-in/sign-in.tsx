import { Controller, useForm } from "react-hook-form";
import { useLogin } from "./hooks/use-login";
import {
    Button,
    Card,
    FieldError,
    Input,
    Label,
    Spinner,
    TextField,
} from "@heroui/react";
import { Form, NavLink } from "react-router-dom";
import { isValidEmail } from "utils";
import { Check } from "@gravity-ui/icons";

export type SignInForm = {
    email: string;
    password: string;
};

export function SignInPage() {
    const login = useLogin();

    const {
        handleSubmit,
        control,
        reset,
        formState: { isValid },
    } = useForm<SignInForm>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "all",
    });

    const handleSubmitForm = handleSubmit((value) => {
        login.mutate(value);
    });

    return (
        <Card className="w-full max-w-md shadow-xl border border-divider rounded-md p-5">
            <Card.Header className="flex flex-col gap-2">
                <Card.Title className="text-2xl font-semibold">
                    Sign in
                </Card.Title>
                <Card.Description className="text-xs text-gray-400">
                    Sign in to continue ToyCRUD
                </Card.Description>
            </Card.Header>

            <Form onSubmit={handleSubmitForm} className="flex flex-col gap-5">
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: {
                            value: true,
                            message: "Email is required",
                        },
                        validate: {
                            checkValidEmail: isValidEmail,
                        },
                    }}
                    render={({
                        field: { value, onChange, name, onBlur },
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
                            <Label>Email</Label>
                            <Input placeholder="username@domain.com" />
                            <FieldError>{error?.message}</FieldError>
                        </TextField>
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: {
                            value: true,
                            message: "Password is required",
                        },
                    }}
                    render={({
                        field: { value, onChange, name, onBlur },
                        fieldState: { invalid, error },
                    }) => (
                        <TextField
                            isRequired
                            value={value}
                            onChange={onChange}
                            type="password"
                            name={name}
                            onBlur={onBlur}
                            isInvalid={invalid}
                        >
                            <Label>Password</Label>
                            <Input placeholder="Enter your password" />
                            <FieldError>{error?.message}</FieldError>
                        </TextField>
                    )}
                />

                <div className="flex items-center justify-center gap-3 pt-2 px-5">
                    <Button
                        type="reset"
                        variant="secondary"
                        className="w-full"
                        onPress={() => reset()}
                    >
                        Reset
                    </Button>

                    <Button
                        type="submit"
                        className="w-full"
                        isDisabled={!isValid}
                        isPending={login.isPending}
                    >
                        Login
                        {login.isPending ? (
                            <Spinner color="current" size="sm" />
                        ) : (
                            <Check />
                        )}
                    </Button>
                </div>
            </Form>

            <Card.Footer className="text-sm text-gray-400 justify-center">
                Don't have an account?
                <NavLink
                    to="/auth/sign-up"
                    className="ml-1 text-primary font-medium cursor-pointer hover:underline text-blue-500"
                >
                    Sign up
                </NavLink>
            </Card.Footer>
        </Card>
    );
}
