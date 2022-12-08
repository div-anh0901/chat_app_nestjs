import { FC, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { InputContaineHeader, InputContainer, InputError, InputField, InputLabel } from '../../../utils/styles';
import { RegisterFieldProps } from '../../../utils/types/form';
import styles from "../index.module.scss";
export const PasswordField: FC<RegisterFieldProps> = ({ register, errors }) => {
    const [showPassword, setShowPassword] = useState(false);
    

    return (
        <InputContainer>
            <InputContaineHeader>
                <InputLabel htmlFor="password" >Password</InputLabel>
                <InputError>{errors.password && errors.password?.message}</InputError>
            </InputContaineHeader>
            <div className={styles.passwordContainer}>
                <InputField
                    type={showPassword ? 'text': 'password'}
                    id="password" {...register('password', {
                    required: "Password is  Required",
                    minLength: {
                        value: 8,
                        message: 'Must be at least 8 characters',
                    },
                    maxLength: {
                        value: 32,
                        message: 'Max characters is 32',
                    },
                    })} />
                
                {showPassword ? (
                    <AiFillEyeInvisible
                        size={24}
                        onClick={() => setShowPassword(false)}
                        cursor="pointer"
                    />) :
                    (
                        <AiFillEye
                            size={24}
                            onClick={() => setShowPassword(true)}
                            cursor="pointer"
                        />
                    )
            }
            </div>
            
        </InputContainer>
    )


}