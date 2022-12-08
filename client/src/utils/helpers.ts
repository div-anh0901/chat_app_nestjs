import { ArrowCycle, ChatDots, Crown, Gear, Minus, Person, PersonCross } from 'akar-icons';
import { IoIosLock, IoIosNotifications, IoIosPerson, IoMdColorPalette, IoMdInfinite, IoMdVideocam } from 'react-icons/io';
import { userContextMenuItems } from './constant';
import { Conversation, Friend, Group, SettingsSidebarRouteType, User, UserContextMenuActionType, UserSidebarRouteType } from './types';


export const getRecipientFromConversation = (
    conversation?: Conversation,
    user?:User
) => {
    return user?.id === conversation?.creator.id
        ? conversation?.recipient
        : conversation?.creator;
}

export const getUserContextMenuIcon = (type: UserContextMenuActionType) => {
    switch (type) {
        case 'kick': 
            return { icon: PersonCross, color: '#ff0000' }
        case 'transfer_ower':
            return { icon: Crown, color: '#FFB800' }
        default:
            return { icon: Minus, color: '#7c7c7c'}
    }
}


export const isGroupOwner = (user?: User, group?: Group) => {
    return user?.id === group?.owner.id;
}

export const getUserSidebarIcon = (id: UserSidebarRouteType) => {
    switch (id) {
        case 'conversations':
            return ChatDots;
        case 'friends':
            return Person;
        case 'connections':
            return ArrowCycle;
        case 'settings':
            return Gear;
        case 'calls':
            return IoMdVideocam;
        default:
            return ChatDots;
    }
}
   

export const getSettingSidebarIcon = (id: SettingsSidebarRouteType)=>{
    switch (id) {
        case 'profile':
            return IoIosPerson;
        case 'security':
            return IoIosLock;
        case 'notifications':
            return IoIosNotifications;
        case 'integrations':
            return IoMdInfinite;
        case 'appearance':
            return IoMdColorPalette;
    }
}

export const getUserFriendIstance = (authenticatedUser: User, serlectedFriend: Friend) =>
    authenticatedUser?.id === serlectedFriend?.sender.id ? serlectedFriend?.receiver : serlectedFriend?.sender;    