import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom"
import { ConversationPanel } from "../../components/conversation/ConversationPanel"
import { ConversationSidebar } from "../../components/sidebars/ConversationSidebar";
import { AppDispatch, RootState } from "../../store";
import { addConversation, fetchConversationsThunk, updateConversation } from "../../store/conversationSlice";
import { addMessage, deleteMessage } from "../../store/messages/messageSlice";
import { updateType } from "../../store/selectedSlice";
import { SocketContext } from "../../utils/context/SocketContext";

import { Page } from "../../utils/styles"

import { Conversation, MessageEventPayload } from "../../utils/types";
export const ConversationPage = () => {
    const { id } = useParams();
   
    const socket = useContext(SocketContext);
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
    const dispatch = useDispatch<AppDispatch>();
    const conversationState = useSelector((state: RootState) => state.conversation.conversations);
    useEffect(() => {
        dispatch(updateType('private'));
        dispatch(fetchConversationsThunk());
        //dispatch(fetchGroupsThunk());
    }, []);

    useEffect(() => {
        const handleResize = () => setShowSidebar(window.innerWidth > 800);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    useEffect(() => {
        socket.on('onMessage', (payload: MessageEventPayload) => {
            const { conversation, message } = payload;
            dispatch(addMessage(payload));
            dispatch(updateConversation(conversation))
        })
        socket.on('onConversation', (payload: Conversation) => {
            dispatch(addConversation(payload))
        })
        socket.on('onMessageDelete', (payload) => {
            dispatch(deleteMessage(payload));
        });
        return () => {
            socket.off('connected');
            socket.off('onMessage');
            socket.off('onConversation');
            socket.off('onMessageDelete');
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