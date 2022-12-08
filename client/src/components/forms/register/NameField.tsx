import {FC } from 'react';
import { InputContaineHeader, InputContainer, InputError, InputField, InputLabel } from '../../../utils/styles';
import { RegisterFieldProps } from '../../../utils/types/form';

import styles from '../index.module.scss';
export const NameField: FC<RegisterFieldProps> = ({ register, errors }) => {
    
    return (
        <section className={styles.namefieldRow}>
            <InputContainer className={styles.nameContainer}>
                <InputContaineHeader>
                    <InputLabel htmlFor="firstName">First Name</InputLabel>
                    <InputError>{ errors.firstName && errors.firstName?.message}</InputError>
                </InputContaineHeader>
               
                <InputField type="text" id="firstName" {...register('firstName', {
                    required: 'First Name is Required',
                     minLength: 2,
                    maxLength: 32,
                })} />
            </InputContainer>
            <InputContainer>
                <InputContaineHeader>
                    <InputLabel htmlFor="firstName"  >Last Name</InputLabel>
                    <InputError>{ errors.lastName && errors.lastName?.message}</InputError>
                </InputContaineHeader>
                <InputField type="text" id="lastName" {...register('lastName', {
                    required: 'Last Name is Required',
                    minLength: 2,
                    maxLength: 32,
                })} />
            </InputContainer>
        </section>
    )

}