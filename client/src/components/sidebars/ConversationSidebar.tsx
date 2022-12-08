import { ChatAdd } from "akar-icons";
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { SidebarContainerStyle } from "../../utils/styles";
import { SidebarHeader, SidebarStyle, ConversationSearchbar, ScrollableContainer } from "../../utils/styles";
import { ConversationSideBarItem } from "../conversation/ConversationSideBarItem";
import { ConversationTab } from "../conversation/ConversationTab";
import { GroupSideBarItem } from "../groups/GroupSidebarItem";
import { CreateConversationModal } from "../modals/CreateConversationModal";
import { CreateGroupModal } from "../modals/CreateGroupModal";
import { ContextMenuEvent, Group } from "../../utils/types";
import { setContextMenuLocation, setSelectedGroup, toggleContextMenu } from "../../store/groupSlice";
import { GroupSidebarContextMenu } from "../context-menus/GroupSidebarContextMenu";

export const ConversationSidebar = () => {
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const groups = useSelector((state: RootState) => state.groups.groups);
    const conversationType = useSelector((state: RootState) => state.selectedConversationType.type);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const showGroupContextMenu = useSelector((state: RootState) => state.groups.showGroupContextMenu);

    const onGroupContextMenu = (event: ContextMenuEvent, group: Group) => {
        event.preventDefault();
        console.log(1)
        dispatch(toggleContextMenu(true));
        dispatch(setContextMenuLocation({ x: event.pageX, y: event.pageY }));
        dispatch(setSelectedGroup(group));
    }

    useEffect(() => {
        const handleResize = (e: UIEvent) => dispatch(toggleContextMenu(false));
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])
    useEffect(() => {
        const handleClick = () => dispatch(toggleContextMenu(false));
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [])

    return (
        <>
            {showModal && conversationType === 'private' && (
                <CreateConversationModal setShowModal={setShowModal} />
            )}
            {showModal && conversationType === 'group' && (
                <CreateGroupModal setShowModal={setShowModal} />
            )}
            <SidebarStyle>
                <SidebarHeader>
                    <ConversationSearchbar placeholder="conversation search ..." />
                    {conversationType === 'private' ?
                        (<ChatAdd size={30} cursor="pointer" onClick={() => setShowModal(true)} />) :
                        (<AiOutlineUsergroupAdd size={30} cursor="pointer" onClick={() => setShowModal(true)} />)
                    }
                </SidebarHeader>
                <ConversationTab />
                <ScrollableContainer>
                    <SidebarContainerStyle>
                        {conversationType === 'private'
                            ? conversations.map((conversation) => (
                                <ConversationSideBarItem
                                    key={conversation.id}
                                    conversation={conversation}
                                />
                            ))
                            : groups.map((group) => (
                                <GroupSideBarItem key={group.id} group={group}
                                    onContextMenu={onGroupContextMenu}
                                />
                            ))}
                        {showGroupContextMenu && <GroupSidebarContextMenu />}
                    </SidebarContainerStyle>
                </ScrollableContainer>
                <footer></footer>
            </SidebarStyle>
        </>

    )
}