import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { MessagePanel } from '../../components/messages/MessagePanel';
import { GroupRecipientsSidebar } from '../../components/sidebars/group-recipients/GroupRecipientsSidebar';
import { AppDispatch, RootState } from '../../store';
import { editGroupMessage, fetchGroupMessagesThunk } from '../../store/groupMessageSlice';
import { SocketContext } from '../../utils/context/SocketContext';
import { ConversationChannelPageStyle } from '../../utils/styles';
import { GroupMessageType } from '../../utils/types';

function GroupChannelPage() {
  const { id } = useParams();
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
 // const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  //const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const showSidebar = useSelector((state: RootState) => state.groupSidebar.showSidebar);

  useEffect(() => {
    const groupId = parseInt(id!);
    dispatch(fetchGroupMessagesThunk(groupId));
  }, [id])
  
  useEffect(() => {
    const groupId = parseInt(id!);
    socket.emit('onGroupJoin', { groupId });
    socket.on('onGroupMessageUpdate', (message: GroupMessageType) => {
      dispatch(editGroupMessage(message))
    })
    return () => {
      socket.emit('onGroupLeave', { groupId });
      socket.off('onGroupMessageUpdate')
    }

  },[id]);
  const sendTypingState = () => {
    
  }


  return (
    <>
      <ConversationChannelPageStyle>
        <MessagePanel sendTypingStatus={sendTypingState} isRecipientTyping={isRecipientTyping}></MessagePanel>
      </ConversationChannelPageStyle>
      { showSidebar && <GroupRecipientsSidebar />}
      
    </>
   
  )
}

export default GroupChannelPage