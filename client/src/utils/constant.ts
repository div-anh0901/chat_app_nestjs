import { id } from 'date-fns/locale';
import { ContextMenuItemType, ConversationTypeData, Group, SettingsItemType, User, UserSidebarItemType } from './types';


export const chatTypes: ConversationTypeData[] = [
    {
        type: 'private',
        label: 'Private'
    },
    {
        type: 'group',
        label: 'Group'
    }
]

export const userContextMenuItems: ContextMenuItemType[] = [
    {
        label: 'Kick User',
        action: 'kick',
        color: '#FF0000',
        ownerOnly: true,
    }, {
        label: 'Transfer Owner',
        action: 'transfer_ower',
        color: '#FFB800',
        ownerOnly: true,
    }, {
        label: 'Profile',
        action: 'profile',
        color: '#7c7c7c',
        ownerOnly: false,
    },

]


export const friendsNavbarItems = [
    {
        id: 'friends',
        label: 'Friends',
        pathname: '/friends',
    },
    {
        id: 'requests',
        label: 'Requests',
        pathname: '/friends/requests',
    },
    {
        id: 'blocked',
        label: 'Blocked',
        pathname: '/friends/blocked',
    },
];

export const userSidebarItems: UserSidebarItemType[] = [
    {
        id: 'conversations',
        pathname: '/conversations'
    },
    {
        id: 'friends',
        pathname: '/friends',

    },
    {
        id: 'connections',
        pathname: '/connections'
    },
    {
        id: 'settings',
        pathname: '/settings',
    },
    {
        id: 'calls',
        pathname: '/calls',
    },
];


export const SettingsItems: SettingsItemType[] = [
    {
        id: 'profile',
        label: 'Profile',
        pathname: '/settings/profile'
    },
    {
        id: 'security',
        label: 'Sercurity',
        pathname: '/settings/sercurity'
    },
    {
        id: 'notifications',
        label: 'Notifications',
        pathname: '/settings/notifications'
    },
    {
        id: 'integrations',
        label: 'Integrations',
        pathname: '/settings/integrations'
    },
    {
        id: 'appearance',
        label: 'Appearance',
        pathname: '/Settings/appearance'
    }
]


export const CDN_URL = 'http://localhost:4001/api/users/uploads/';

