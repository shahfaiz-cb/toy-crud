import {
    Button,
    Card,
    FieldError,
    Form,
    Input,
    Label,
    Spinner,
    TextField,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { isValidEmail, isValidPassword } from "utils";
import { useRegister } from "./hooks/use-register/use-register";
import { Check } from "@gravity-ui/icons";
import { NavLink } from "react-router-dom";

export type SignUpForm = {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
};

export function SignUpPage() {
    const { handleSubmit, control, watch, reset, formState: {
        isValid
    } } = useForm<SignUpForm>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
        },
        mode: "all",
    });

    const register = useRegister();

    const handleSubmitForm = handleSubmit((value) => {
        register.mutate(value);
    });

    const password = watch("password");

    return (
            <Card className="w-full max-w-md shadow-xl border border-slate-200 backdrop-blur-sm rounded-md p-5">
                <Card.Header className="flex flex-col gap-2">
                    <Card.Title className="text-2xl font-semibold">
                        Create Account
                    </Card.Title>
                    <Card.Description className="text-xs text-slate-500">
                        Sign up to continue to ToyCRUD
                    </Card.Description>
                </Card.Header>
                <Form
                    onSubmit={handleSubmitForm}
                    className="flex flex-col gap-5"
                >
                    <Controller
                        control={control}
                        name="fullName"
                        rules={{
                            required: {
                                value: true,
                                message: "Full name is required",
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
                                <Label>Full Name</Label>
                                <Input placeholder="Your name here..." />
                                <FieldError>{error?.message}</FieldError>
                            </TextField>
                        )}
                    />
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
                            validate: {
                                checkValidPassword: isValidPassword,
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
                    <Controller
                        control={control}
                        name="confirmPassword"
                        rules={{
                            required: {
                                value: true,
                                message: "Confirm Password is required",
                            },
                            validate: {
                                checkPasswordEqual: (value) => {
                                    return (
                                        password === value ||
                                        "Passwords do not match"
                                    );
                                },
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
                                <Label>Confirm Password</Label>
                                <Input placeholder="Re-enter your password" />
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
                        <Button type="submit" className="w-full" isDisabled={!isValid} isPending={register.isPending}>
                            Create
                            {
                                register.isPending ? (<Spinner color="current" size="sm"/>) : (<Check/>)
                            }
                        </Button>
                    </div>
                </Form>
                <Card.Footer className="text-sm text-slate-600 justify-center">
                    Already have an account?
                    <NavLink to={"/auth/sign-in"} className="ml-1 text-blue-500 font-medium cursor-pointer hover:underline">
                        Login
                    </NavLink>
                </Card.Footer>
            </Card>
    );
}
