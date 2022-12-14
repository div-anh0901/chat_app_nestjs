import React, { Dispatch, SetStateAction, FC } from 'react';
import { InputContainer, InputField, InputLabel, RecipientChipContainer } from '../../utils/styles';
import { ConversationType, User } from '../../utils/types';
import { SelectedRecipientChip } from './SelectedRecipientChip';

type Props = {
    selectedUser: User | undefined;
    setQuery: Dispatch<SetStateAction<string>>;
    setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
}


export const RecipientField: FC<Props> = ({ selectedUser,  setQuery, setSelectedUser }) => {
   
    return (
        <section>
            <InputContainer backgroundColor='#161616' >
                <InputLabel>Recipient</InputLabel>
                {
                    selectedUser ? (
                        <SelectedRecipientChip
                            user={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    ) : (
                        <InputField onChange={(e) => setQuery(e.target.value)} />
                    )
                }
            </InputContainer>
            
        </section>
    )
}