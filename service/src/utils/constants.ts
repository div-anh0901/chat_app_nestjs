import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export enum Routes {
    AUTH = 'auth',
    USERS = 'users',
    CONVERSATIONS = 'conversations',
    Messages = 'conversations/:id/messages',
    GROUPS = 'groups',
    GROUP_MESSAGES = 'groups/:id/messages',
    GROUP_RECIPIENTS = 'groups/:id/recipients',
    FRIENDS = 'friends',
    USERS_PROFILES = 'users/profiles',
    EXISTS = 'exists',
    USER_PRESENCE = 'users/presence',
    FRIEND_REQUESTS = 'friends/requests',
}

export enum Services {
    AUTH = 'AUTH_SERVICE',
    USERS = 'USERS_SERVICE',
    CONVERSATIONS = 'CONVERSATIONS_SERVICE',
    Messages = 'MESSAGES_SERVICE',
    GATEWAY_SESSION_MANAGER = 'GATEWAY_SESSION_MANAGER',
    MESSAGE_ATTACHMENTS = "MESSAGE_ATTCHMENT_SERVICE",
    GROUPS = 'GROUPS_SERVICE',
    GROUP_MESSAGES = 'GROUP_MESSAGES_SERVICE',
    GROUP_RECIPIENTS = 'GROUP_RECIPIENTS_SERVICE',
    FRIENDS_SERVICE = 'FRIENDS_SERVICE',
    FRIEND_REQUESTS_SERVICE = 'FRIEND_REQUESTS_SERVICE',
    USERS_PROFILES = 'USERS_PROFILES_SERVICE',
    USER_PRESENCE = 'USER_PRESENCE_SERVICE',
    SPACES_CLIENT = 'SPACED_CLIENT',
    IMAGE_UPLOAD_SERVICE = 'IMAGE_UPLOAD_SERVICE'
}

export enum ServerEvents {
    FRIEND_REQUEST_ACCEPTED = 'friendrequest.accepted',
    FRIEND_REQUEST_REJECTED = 'friendrequest.rejected',
    FRIEND_REQUEST_CANCELLED = 'friendrequest.cancelled',
    FRIEND_REMOVED = 'friend.removed',
}

export enum WebsocketEvents {
    FRIEND_REQUEST_ACCEPTED = 'onFriendRequestAccepted',
    FRIEND_REQUEST_REJECTED = 'onFriendRequestRejected',
}

export const UserProfileFileFileds: MulterField[] = [
    {
        name: 'banner',
        maxCount: 1
    },
    {
        name: 'avatar',
        maxCount: 1
    }
]