import { useContext, useState, Dispatch, SetStateAction ,FC} from 'react';
import { updateStatusMessage } from '../../../utils/api';
import { AuthContext } from '../../../utils/context/AuthContext';
import { useToast } from '../../../utils/hook/useToast';
import { InputContaineHeader, InputContainer, InputField, InputLabel } from '../../../utils/styles';
import { Button } from '../../../utils/styles/button';
import styles from '../index.module.scss';
type Props = {
    setShowModal: Dispatch<SetStateAction<boolean>>;
};
export const UpdateUserStatusForm: FC<Props> = ({setShowModal}) => {
    const { user } = useContext(AuthContext);
    const [statusMessage,setStatusMessage] = useState(user?.presence?.statusMessage || '');
    const {success,error} = useToast({ theme: 'dark' });
    const saveStatus = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateStatusMessage({ statusMessage }).then(() => {
            success('Updated  Status!');
            setShowModal(false);
        }).catch(() => {
            error('Failed to Update  Status!');
            setShowModal(false);
        })
    }


    return (
        <form className={styles.updateUserStatusForm} onSubmit={saveStatus}>
            <InputContainer backgroundColor='#0A0A0a' >
                <InputContaineHeader>
                    <InputLabel htmlFor='message' >Message</InputLabel>
                </InputContaineHeader>
                <InputField
                    type="text"
                    id="message"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                />
                <div className={styles.updateStatusFormButtons}>
                    <Button size='md'>Save</Button>
                </div>
            </InputContainer>
        </form>
    )

}