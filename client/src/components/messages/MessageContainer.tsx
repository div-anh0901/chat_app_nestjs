import { formatRelative } from 'date-fns'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Message } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { AppDispatch, RootState } from '../../store'
import { selectGroupMessage } from '../../store/groupMessageSlice'
import {
    editMessageContent,
    resetMessageContainer,
    setContextMenuLocation, 
    setIsEditing,
    setSelectedMessage,
    toggleContextMenu
} from '../../store/messageContainerSlice'
import { selectConversationMessage } from '../../store/messages/messageSlice'
import { selectType } from '../../store/selectedSlice'
import { useHangeclick, useKeyDown } from '../../utils/hook'
import {
    MessageContainerStyle,
 
    MessageItemContainer,
    MessageItemDetails,
} from '../../utils/styles'
import { GroupMessageType, MessageType } from '../../utils/types'
import { SelectedMessageContextMenu } from '../context-menus/SelectedMessageContextMenu'
import { SystemMessageList } from '../system/SystemMessageList'
import { UserAvatar } from '../users/UserAvatar'

import { MessageItemContainerBody } from './MessageItemContainerBody'
import { MessageItemHeader } from './MessageItemHeader'



export const MessageContainer = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
 
    const { showContextMenu } = useSelector((state: RootState) => state.messageContainer);

    const groupMessages = useSelector((state: RootState) =>
        selectGroupMessage(state, parseInt(id!))
    );

    const selectedType = useSelector((state: RootState) => selectType(state));
    const conversationMessages = useSelector(
        (state: RootState) => selectConversationMessage(state, parseInt(id!))
    );

    const handleKeydown = (e: KeyboardEvent) => e.key === 'Escape' && dispatch(setIsEditing(false));
    const handleClick = () => dispatch(toggleContextMenu(false));


    useKeyDown(handleKeydown, [id]);
    useHangeclick(handleClick, [id]);

    const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, message: MessageType | GroupMessageType) => {
        e.preventDefault();
  
        dispatch(toggleContextMenu(true));
        dispatch(setContextMenuLocation({ x: e.pageX, y: e.pageY }));
        dispatch(setSelectedMessage(message));
    }

    useEffect(() => {
        dispatch(resetMessageContainer());
    }, [id]);


    const onEditMessageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatch(editMessageContent(e.target.value));

    const mapMessages = (
        message: MessageType | GroupMessageType,
        index: number,
        messages: MessageType[] | GroupMessageType[]
    ) => {
        const currentMessage = messages[index];
        const nextMessage = messages[index + 1];
        const showMessageHeader =
            messages.length === index + 1 ||
            currentMessage.author.id !== nextMessage.author.id;
        return (
            <MessageItemContainer
                key={message.id}
                onContextMenu={(e) => onContextMenu(e, message)}
            >
                {showMessageHeader && <UserAvatar user={message.author} />}
                {showMessageHeader ? (
                    <MessageItemDetails>
                        <MessageItemHeader message={message} />
                        <MessageItemContainerBody
                            message={message}
                            onEditMessageChange={onEditMessageChange}
                            padding="8px 0 0 0"
                        />
                    </MessageItemDetails>
                ) : (
                        <MessageItemContainerBody
                            message={message}
                            onEditMessageChange={onEditMessageChange}
                            padding="0 0 0 70px"
                        />
                )}
            </MessageItemContainer>
        );
    };
    return (
        <MessageContainerStyle
            onScroll={(e) => {
                const node = e.target as HTMLDivElement;
                const scrollTopMax = node.scrollHeight - node.clientHeight
                if (-scrollTopMax === node.scrollTop)
                {
                    console.log('');
                }
            }}
        >
      <>
        <SystemMessageList />
        {selectedType === 'private'
          ? conversationMessages?.messages.map(mapMessages)
          : groupMessages?.messages.map(mapMessages)}
      </>
    {showContextMenu && <SelectedMessageContextMenu />} 
    </MessageContainerStyle>
  );
}

