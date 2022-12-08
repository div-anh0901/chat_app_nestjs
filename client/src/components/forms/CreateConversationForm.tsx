import React, { Dispatch, FC, useState,useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppDispatch } from '../../store';
import { createConversationThunk } from '../../store/conversationSlice';
import { createGroupThunk } from '../../store/groupSlice';
import { createGroup, searchUsers } from '../../utils/api';
import { useDebounce } from '../../utils/hook/useDebounce';
import { Button, InputContainer, InputField, InputLabel, RecipientResultContainerStyle, RecipientResultItem, TextField } from '../../utils/styles'
import { ConversationType, CreateConversationParams, User } from '../../utils/types';
import { RecipientField } from '../recipients/RecipientField';
import { RecipientResultContainer } from '../recipients/RecipientResultContainer';
import { SelectedRecipientChip } from '../recipients/SelectedRecipientChip';
import styles from './index.module.scss';
type Props = {
  setShowModal: Dispatch<React.SetStateAction<boolean>>,
}

export const CreateConversationForm: FC<Props> = ({ setShowModal }) => {
  
  const { register,handleSubmit,formState:{errors}} = useForm<CreateConversationParams>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  const [query, setQuery] = useState('');
  const [userResults, setUserResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User>();
  const [searching, setSearching] = useState(false);
  const debounceQuery = useDebounce(query, 1000);

  useEffect(() => {
    if (debounceQuery) {
      setSearching(true);
      searchUsers(debounceQuery).then(({ data }) => {
        setUserResults(data);
      }).catch((err) => console.log(err))
        .finally(() => setSearching(false));
      
    }
  }, [debounceQuery])


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || !selectedUser) return;
      return dispatch(
        createConversationThunk({ username: selectedUser.username, message })
        
      ).unwrap().then(({ data }) => {
        setShowModal(false);
        navigate(`/conversations/${data.id}`);
      })
        .catch((err) => console.log(err));
  }

  const handleUserSelected = (user: User)=>{
    setSelectedUser(user);
    setUserResults([]);
    setQuery('')
  }


  
  return (
    <form className={styles.createConversationForm} onSubmit={onSubmit}>
        <RecipientField
          selectedUser={selectedUser}
          setQuery={setQuery}
          setSelectedUser={setSelectedUser}
        
      />

      {!selectedUser && userResults.length > 0 && query && (
        <RecipientResultContainer
          userResults={userResults}
          handleUserSelect={handleUserSelected}
        
        />
      )}
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

