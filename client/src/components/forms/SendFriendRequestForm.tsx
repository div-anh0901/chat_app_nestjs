import { FC, Dispatch, SetStateAction,useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createFriendRequestThunk } from '../../store/friends/friendsThunk';
import { useToast } from '../../utils/hook/useToast';
import { Button, InputContainer, InputField, InputLabel } from '../../utils/styles';
import styles from "./index.module.scss";
type Props = {
    setShowModal:Dispatch<SetStateAction<boolean>>
}

export const SendFriendRequestFrom: FC<Props> = ({ setShowModal }) => {
    const [username, setUsername] = useState('');
    const {success,error } = useToast({ theme: 'dark' });
 
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(createFriendRequestThunk(username))
            .unwrap()
            .then(() => {
                setShowModal(false);
                success('Friend Request success');
            }).catch((err) =>{
                error('Error sending friend request');
            })
    }

    return (
        <form className={styles.createConversationForm} onSubmit={onSubmit}>
            <InputContainer backgroundColor='#161616' >
                <InputLabel>Send Friend</InputLabel>
                <InputField value={username} onChange={(e) => setUsername(e.target.value)} />
                <Button style={{margin:'10px 0'}} disabled={!username}>Send</Button>
            </InputContainer>
        </form>
    )
}