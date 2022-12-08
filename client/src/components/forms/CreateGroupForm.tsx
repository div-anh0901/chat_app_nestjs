import React,{ Dispatch, SetStateAction, FC, useState ,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppDispatch } from '../../store';
import { createGroupThunk } from '../../store/groupSlice';
import { searchUsers } from '../../utils/api';
import { useDebounce } from '../../utils/hook/useDebounce';
import { Button, InputContainer, InputLabel, RecipientChipContainer, TextField } from '../../utils/styles';
import { User } from '../../utils/types';
import { GroupRecipientsField } from '../recipients/GroupRecipientsField';
import { RecipientResultContainer } from '../recipients/RecipientResultContainer';
import { SelectedGroupRecipientChip } from '../recipients/SelectedGroupRecipientChip';
import { SelectedRecipientChip } from '../recipients/SelectedRecipientChip';
import styles from './index.module.scss'
type Props = {
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const CreateGroupForm: FC<Props> = ({ setShowModal }) => {
    const [title,setTitle] = useState('')
    const [message,setMessage] = useState('');
    const [query, setQuery] = useState('');
    const [results,setResults] = useState<User[]>([]);
    const [selectedRecipients, setSelectedRecipients] = useState<User[]>([]);
    const [searching, setSearching] = useState(false);
    const debouncedQuery = useDebounce(query, 1000);
    const diapatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();


    useEffect(() => {
        if (debouncedQuery) {
            setSearching(true);
            searchUsers(debouncedQuery)
                .then(({ data }) => {
                    console.log(data);
                    setResults(data);
                })
                .catch(err => console.log(err))
                .finally(() => setSearching(false));
        }

    }, [debouncedQuery]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedRecipients.length == 0 || !message || !title) return;

        const users = selectedRecipients.map((user) => user.username);
        return diapatch(createGroupThunk({title,users}))
            .unwrap()
            .then(({ data }) => {
                console.log(data);
                setShowModal(false);
                navigate(`/groups/${data.id}`)
            })
            .catch((err) => console.log(err));
    }

    const handleUserSelected = (user: User) => {
        const exists = selectedRecipients.find(u => u.id === user.id);
        if (!exists) setSelectedRecipients(prev => [...prev, user]);
    }

    const removeUser = (user: User) => setSelectedRecipients((prev) => prev.filter((u) => u.id !== user.id));

    return (
        <form className={styles.createConversationForm} onSubmit={onSubmit} >
            <RecipientChipContainer>
                {
                    selectedRecipients.map((user) => (
                        <SelectedGroupRecipientChip user={user} removeUser={removeUser} />
                    ))
                }
            </RecipientChipContainer>
            <GroupRecipientsField setQuery={setQuery} />
            {results.length > 0 && query && (
                <RecipientResultContainer
                    userResults={results}
                    handleUserSelect={handleUserSelected}
                />
            )}
            <section className={styles.message}>
                <InputContainer backgroundColor="#161616">
                    <InputLabel>Title </InputLabel>
                    <TextField
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </InputContainer>
            </section>
            <section className={styles.message}>
                <InputContainer backgroundColor="#161616">
                    <InputLabel>Message (optional)</InputLabel>
                    <TextField
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </InputContainer>
            </section>
            <Button>Create Conversation</Button>
        </form>
    )
}