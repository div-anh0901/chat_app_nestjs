import { AxiosError } from 'axios'
import React, { FC, useState, useContext ,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { AppDispatch, RootState } from '../../store'
import { selectConversationById } from '../../store/conversationSlice'
import { selectGroupById } from '../../store/groupSlice'
import { addSystemMessage, clearCallMessages } from '../../store/system-message/systemMessageSlice'
import { createMessage, postGroupMessage } from '../../utils/api'
import { AuthContext } from '../../utils/context/AuthContext'
import { getRecipientFromConversation } from '../../utils/helpers'
import { useToast } from '../../utils/hook/useToast'
import { MessagePanelBody, MessagePanelFooter, MessagePanelStyle, MessageTypingStatus } from '../../utils/styles'
import { MessageAttachmentContainer } from '../attachments/MessageAttachmentContainer'
import { ConversationCall } from '../conversation/ConversationCall'
import { MessageContainer } from './MessageContainer'
import MessageInputField from './MessageInputField'
import { MessagePanelHeader } from './MessagePanelHeader'

type Props = {
  sendTypingStatus: () => void,
  isRecipientTyping: boolean
}

export const MessagePanel: FC<Props> = ({ sendTypingStatus, isRecipientTyping }) => {
  const [content, setContent] = useState('');
  var { id: routeId } = useParams();
  const { user } = useContext(AuthContext);
  const toastId = 'rateLimitToast';
  const dispatch = useDispatch();

  const { error } = useToast({ theme: 'dark' });
  const conversation = useSelector((state: RootState) => {
    return selectConversationById(state, parseInt(routeId!));
  });

  const { messageCounter} = useSelector((state: RootState) => state.systemMessages);

  const { attachments } = useSelector((state: RootState) => state.messagePanel);
  const selectedType = useSelector((state: RootState) => state.selectedConversationType.type);
  const group = useSelector((state: RootState) => selectGroupById(state, parseInt(routeId!)));
  const recipient = getRecipientFromConversation(conversation, user);
  const callState = useSelector((state: RootState) => state.call);


  useEffect(() => {
    return () => {
      dispatch(clearCallMessages())
    }
  },[])

  const sendMessage = async () => {
    const trimmedContent = content.trim();
    if (!routeId || !content.trim()) return;
    const id = parseInt(routeId);
    const params = { id, content: trimmedContent };

    try {
      selectedType === 'private' ? await createMessage(params) : postGroupMessage(params);
      setContent('');
      dispatch(clearCallMessages());
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 429) {
        error('You are rate limited', { toastId });
        dispatch(
          addSystemMessage({
            id: messageCounter,
            level: 'error',
            content: 'You are being rate limited. Slow down.',
          })
        );
      } else if (axiosError.response?.status === 404) {
        dispatch(
          addSystemMessage({
            id: messageCounter,
            level: 'error',
            content: 'The recipient is not in your friends list or they may have blocked you.',
          })
        );
      }

    }
  }


  return (
    <>
      <MessagePanelStyle>
        <MessagePanelHeader />
        <ConversationCall /> 
        <MessagePanelBody>
          <MessageContainer />
        </MessagePanelBody>{' '}
        <MessagePanelFooter>
          {attachments.length > 0 && <MessageAttachmentContainer />}
          <MessageInputField
            content={content}
            setContent={setContent}
            sendMessage={sendMessage}
            sendTypingStatus={sendTypingStatus}
            placeholderName={selectedType === 'group' ? group?.title || 'Group' : recipient?.firstName || 'user' }
          />
          <MessageTypingStatus>
            {isRecipientTyping ? `${recipient?.firstName} is typing....` : ''}
          </MessageTypingStatus>
        </MessagePanelFooter>
      </MessagePanelStyle>
    </>
  )
}
