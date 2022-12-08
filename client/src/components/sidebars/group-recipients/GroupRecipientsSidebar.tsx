import { Crown, PeopleGroup } from "akar-icons";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router"
import { AppDispatch, RootState } from "../../../store";
import { setContextMenuLocaltion, setSelectedUser, toggleContextMenu } from "../../../store/groupRecipientsSidebarSlice";
import { selectGroupById } from "../../../store/groupSlice";
import { SocketContext } from "../../../utils/context/SocketContext";
import {
    GroupRecipientSidebarItem,
    GroupRecipientSidebarItemContainer,
    GroupRecipientsSidebarHeader,
    GroupRecipientsSidebarStyle,
} from "../../../utils/styles";
import { User } from "../../../utils/types";
import { SelectedPariticipantContextMenu } from "../../context-menus/SelectedParticipantContextMenu";
import { UserAvatar } from "../../users/UserAvatar";
import { OfflineGroupRecipients } from "./OfflineGroupRecipients";
import { OnlineGroupRecipients } from "./OnlineGroupRecipients";



export const GroupRecipientsSidebar = () => {
    const { id: groupId } = useParams();
    const group = useSelector((state: RootState) => selectGroupById(state, parseInt(groupId!)));

    const dispatch = useDispatch<AppDispatch>()
    const socket = useContext(SocketContext);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

    const groupSidebarState = useSelector((state: RootState) => state.groupSidebar);

    useEffect(() => {
        const handleClick = () => dispatch(toggleContextMenu(false));
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [groupId])

    useEffect(() => {
        socket.emit('getOnlineGroupUsers', { groupId });
        const interval = setInterval(() => {
            socket.emit('getOnlineGroupUsers', { groupId });
        }, 5000);

        socket.on('onlineGroupUsersReceived', (payload) => {
            setOnlineUsers(payload.onlineUsers);
        });

        return () => {
            clearInterval(interval);
            socket.off('onlineGroupUsersReceived')
        }
    }, [group, groupId]);

    useEffect(() => {
        const handleResize = (e: UIEvent) => dispatch(toggleContextMenu(false));
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onUserContextMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        user: User
    ) => {
        e.preventDefault();
        dispatch(toggleContextMenu(true));
        dispatch(setContextMenuLocaltion({ x: e.pageX, y: e.pageY }));
        dispatch(setSelectedUser(user));
    }

    return (
        <GroupRecipientsSidebarStyle>
            <GroupRecipientsSidebarHeader>
                <span>Participants</span>
            </GroupRecipientsSidebarHeader>
            <GroupRecipientSidebarItemContainer>    
                <span>Online Users</span>
                <OnlineGroupRecipients
                    users={onlineUsers}
                    group={group}
                    onUserContextMenu={onUserContextMenu}
                />
                <span>Offine Users</span>
                <OfflineGroupRecipients
                    onlineUsers={onlineUsers}
                    group={group}
                    onUserContextMenu={onUserContextMenu}
                />
                {
                    groupSidebarState.showUserContextMenu && (
                        <SelectedPariticipantContextMenu points={groupSidebarState.points} />
                    )
                }
            </GroupRecipientSidebarItemContainer>
        </GroupRecipientsSidebarStyle>
    )
}