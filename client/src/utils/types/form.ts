import { FieldErrorsImpl, UseFormRegister } from "react-hook-form"
import { CreateUserParams } from "../types"


export type RegisterFieldProps = {
    register: UseFormRegister<CreateUserParams>;
    errors: FieldErrorsImpl<{
        username: string;
        firstName: string;
        lastName: string;
        password: string;
    }>
}