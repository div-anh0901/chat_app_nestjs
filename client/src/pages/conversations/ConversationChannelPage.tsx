import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { MessagePanel } from '../../components/messages/MessagePanel';
import { AppDispatch } from '../../store';
import { addMessage, editMessage } from '../../store/messages/messageSlice';
import { fetchMessagesThunk } from '../../store/messages/messageThunk';
import { AuthContext } from '../../utils/context/AuthContext'
import { SocketContext } from '../../utils/context/SocketContext';

import { ConversationChannelPageStyle } from '../../utils/styles'

export default function ConversationChannelPage() {
 // const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [isRecipientTyping, setIsRecipingTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const conversationId = parseInt(id!);
    dispatch(fetchMessagesThunk(conversationId))
  }, [id]);

  useEffect(() => {
    const conversationId = id!;
    socket.emit('onConversationJoin', { conversationId });
    socket.on('userJoin', () => {
      console.log('userJoin');
    });

    socket.on('userLeave', () => {
      console.log('userLeave');
    });
    socket.on('onTypingStart', () => {
      setIsRecipingTyping(true)
    });

    socket.on('onTypingStop', () => {
      setIsRecipingTyping(false);
    });

    socket.on('onMessageUpdate', (message) => {
      dispatch(editMessage(message));
    });


    return () => {
      socket.emit('onConversationLeave', { conversationId });
      socket.off('userJoin');
      socket.off('userLeave');
      socket.off('onTypingStart');
      socket.off('onTypingStop');
      socket.off('onMessageUpdate');
    }
  }, [id]);


  const sendTypingStatus = () => {
    if (isTyping) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          socket.emit('onTypingStop', { conversationId: id });
          setIsTyping(false);
        }, 2000)
      );
    } else {
      socket.emit('onTypingStart', { conversationId: id });
      setIsTyping(true);
    }
  }

  return (
    <ConversationChannelPageStyle>
      <MessagePanel
        sendTypingStatus={sendTypingStatus}
        isRecipientTyping={isRecipientTyping}
      ></MessagePanel>
    </ConversationChannelPageStyle>
  )
}
