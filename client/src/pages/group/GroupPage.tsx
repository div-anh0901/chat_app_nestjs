import React, { useEffect, useContext, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router'
import { ConversationPanel } from '../../components/conversation/ConversationPanel';
import { ConversationSidebar } from '../../components/sidebars/ConversationSidebar';
import { AppDispatch } from '../../store';
import { addGroupMessage } from '../../store/groupMessageSlice';
import { addGroup, fetchGroupsThunk, removeGroup, updateGroup } from '../../store/groupSlice';
import { updateType } from '../../store/selectedSlice';
import { AuthContext } from '../../utils/context/AuthContext';
import { socket } from '../../utils/context/SocketContext';
import { AddGroupMessagePayload, Group, GroupMessageEventPayload, RemoveGroupUserMessagePayload } from '../../utils/types';

export const GroupPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useContext(AuthContext);
  const [showSidebar,setShowSidebar] = useState(window.innerWidth > 800);
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(updateType('group'));
    dispatch(fetchGroupsThunk());
  }, []);

  useEffect(() => {
    const handleResize = () => setShowSidebar(window.innerWidth > 800);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])

  useEffect(() => {
    socket.on('onGroupMessage', (payload: GroupMessageEventPayload) => {
      console.log('group reciver ');
      const { group, message } = payload;
      dispatch(addGroupMessage(payload));
    });

    socket.on('onGroupCreate', (payload: Group) => {
      dispatch(addGroup(payload));
    });

    socket.on('onGroupUserAdd', (payload: AddGroupMessagePayload) => {
      dispatch(addGroup(payload.group));
    });

    socket.on('onGroupReciverNewUser', (payload: AddGroupMessagePayload) => {
      dispatch(updateGroup(payload.group));
    });

    socket.on('onGroupRecipientRemoved', (payload: RemoveGroupUserMessagePayload) => {
      dispatch(updateGroup(payload.group));
    });

    socket.on('onGroupRemove', (payload: RemoveGroupUserMessagePayload) => {
      if (id && parseInt(id!) === payload.group.id) {
        dispatch(removeGroup(payload.group));
        navigate('/groups');
      }
    });

    socket.on('onGroupParticipantLeft', (payload) => {
      dispatch(updateGroup(payload.group));
      if (payload.userId === user?.id) {
        dispatch(removeGroup(payload.group));
        navigate('/groups');
      }
    });

    socket.on('onGroupOwnerUpdate', (payload: Group) => {
      dispatch(updateGroup(payload))
    })

    return () => {
      //socket.removeAllListeners();
      socket.off('onGroupMessage');
      socket.off('onGroupCreate');
      socket.off('onGroupUserAdd');
      socket.off('onGroupReciverNewUser');
      socket.off('onGroupRecipientRemoved');
      socket.off('onGroupRemove');
      socket.off('onGroupParticipantLeft');
      socket.off('onGroupOwnerUpdate');
    }
  }, [id]);


  return (
    <>
      {showSidebar && <ConversationSidebar />}
      {!id && !showSidebar && <ConversationSidebar />}
      {!id && showSidebar && <ConversationPanel />}
      <Outlet />
    </>
  )

}