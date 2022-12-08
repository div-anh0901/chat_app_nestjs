import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { postLoginUser } from "../../../utils/api";
import { SocketContext } from "../../../utils/context/SocketContext";
import { Button, InputContainer, InputField, InputLabel } from "../../../utils/styles";
import { UserCredentialsParams } from "../../../utils/types";
import styles from '../index.module.scss'



export const LoginForm=()=> {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<UserCredentialsParams>();
    const socket = useContext(SocketContext)
    const onSubmit = async (data: UserCredentialsParams) => {
        try {
            await postLoginUser(data);
            socket.connect();
            navigate('/conversations')
        } catch (err) {
            console.log(socket.connected);
            console.log(err);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <InputContainer>
                <InputLabel htmlFor="username">Username</InputLabel>
                <InputField type="text" id="username" {...register("username", {
                    required: true
                })} />
            </InputContainer>
            <InputContainer className={styles.loginformPassword}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <InputField type="password" id="password" {...register("password", {
                    required: true
                })} />
            </InputContainer>
            <Button className={styles.button}>Login</Button>
            <div className={styles.footerText}>
                <span>Don't have an account? </span>
                <Link to="/register">
                    <span>Register</span>
                </Link>
            </div>
        </form>
    );
}
