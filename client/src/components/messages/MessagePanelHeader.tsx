import { PeopleGroup, PersonAdd } from 'akar-icons';
import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppDispatch, RootState } from '../../store';
import { setLocalStream } from '../../store/call/callSlice';
import { selectConversationById } from '../../store/conversationSlice';
import { toggleSidebar } from '../../store/groupRecipientsSidebarSlice';
import { selectGroupById } from '../../store/groupSlice';
import  { selectType } from '../../store/selectedSlice';
import { AuthContext } from '../../utils/context/AuthContext'
import { SocketContext } from '../../utils/context/SocketContext';
import { getRecipientFromConversation } from '../../utils/helpers';
import { GroupHeaderIcons, MessagePanelHeaderStyle } from '../../utils/styles'
import { AddGroupRecipientModel } from '../modals/AddGroupRecipientModal';
import { FaVideo } from 'react-icons/fa';

export function MessagePanelHeader() {
  const {user } = useContext(AuthContext);
  const { id } = useParams();
  const [showModal,setShowModal] = useState(false);
  const type = useSelector(selectType);
  const socket = useContext(SocketContext);
  const { peer,connection,call} = useSelector((state: RootState) => state.call);

  const conversation = useSelector((state: RootState) => {
   return  selectConversationById(state, parseInt(id!))
  });
  
  const group = useSelector((state: RootState) => selectGroupById(state, parseInt(id!)));

  const recipient = getRecipientFromConversation(conversation, user);
  const dispatch = useDispatch<AppDispatch>();

  const displayName = user?.id === conversation?.creator.id
    ? `${conversation?.recipient.firstName} ${conversation?.recipient.lastName}`
    : `${conversation?.creator.firstName} ${conversation?.creator.lastName}`

  const groupName = group?.title || "GROUP";
  const headerTitle = type === 'group' ? groupName : displayName;

  const handleVideoCall = async () => {
    if (!recipient) return console.log('Recipient undefined');
    if (!user) return console.log('User undifined');
  
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true, audio: true
    });

    dispatch(setLocalStream(stream));

    socket.emit('onVideoCallInitiate', {
      conversationId: conversation?.id,
      recipientId: recipient.id
    })
  }


  return (
    <>
      {showModal && (<AddGroupRecipientModel showModal={ showModal} setShowModal={setShowModal} />)}
      <MessagePanelHeaderStyle >
        <div>
          <span>{ headerTitle}</span>
        </div>
        <GroupHeaderIcons>
          {type === 'private' && (
            <FaVideo size={30} cursor="pointer" onClick={handleVideoCall} />
          )}
          {
            type === 'group' && user?.id === group?.owner?.id && (
              <PersonAdd size={30} onClick={() => setShowModal(true)} />
            )
          }
          {type === 'group' && (
            <PeopleGroup
              cursor="pointer"
              size={30}
              onClick={() => dispatch(toggleSidebar())}
            />
          )}
        </GroupHeaderIcons>
        
      </MessagePanelHeaderStyle>
    </>
    
  )
}


