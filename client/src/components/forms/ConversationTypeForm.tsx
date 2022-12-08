import { FC, Dispatch,SetStateAction} from 'react';
import { chatTypes } from '../../utils/constant';
import { ConversationType } from '../../utils/types';
import styles from './index.module.scss';

type Props = {
    type: ConversationType,
    setType: Dispatch<SetStateAction<ConversationType>>
}

export const ConversationTypeForm: FC<Props> = ({ type, setType })=>{
    return (
        <form className={styles.conversationTypeForm}>
            {
                chatTypes.map(ct => (
                    <div key={ct.type} >
                        <input
                            className={styles.radio}
                            type='radio'
                            name='conversationType'
                            id={ct.type}
                            onChange={() => setType(ct.type)}
                            checked={type === ct.type}
                        />
                        <label className={styles.radioLabel} htmlFor={ct.type}>{ct.label}</label>
                    </div>
                ))
            }
          
        </form>
    )
}