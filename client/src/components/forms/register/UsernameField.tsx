import {FC } from 'react';
import { InputContaineHeader, InputContainer, InputError, InputField, InputLabel } from '../../../utils/styles';
import { RegisterFieldProps } from '../../../utils/types/form';
import { checkUsernameExists } from '../../../utils/api';
import { AxiosError } from 'axios';

export const UsernameField: FC<RegisterFieldProps> = ({ register, errors }) => {
    
    return (
        <InputContainer>
            <InputContaineHeader>
                <InputLabel htmlFor="username" >Username</InputLabel>
                <InputError>{ errors.username && errors.username?.message}</InputError>
            </InputContaineHeader>
           
            <InputField type="text" id="username" {...register('username', {
                required: "Username is Required",
                minLength: {
                    value: 3,
                    message: 'Must be 3 characters long',
                },
                maxLength: {
                    value: 16,
                    message: 'Exceeds 16 characters',
                },
                validate: {
                    checkUsername: async (username: string) => {
                        try {
                            await checkUsernameExists(username);
                        } catch (err) {
                            return (
                                (err as AxiosError).response?.status === 409 &&
                                'Username already exists'
                            );
                        }
                    },
                }
            })} />
        </InputContainer>

    )
} 