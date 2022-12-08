import axios, { AxiosRequestConfig } from 'axios';
import {
    Conversation,
    CreateConversationParams,
    CreateMessageParams,
    CreateUserParams,
    FetchMessagePayload,
    User,
    UserCredentialsParams,
    DeleteMessageParams,
    DeleteMessageResponse,
    EditMessagePayload,
    MessageType,
    Group,
    FetchGroupMessagePayload,
    CreateGroupParams,
    DeleteGroupMessageParams,
    DeleteGroupMessageResponse,
    GroupMessageType,
    AddGroupRecipientParams,
    RemoveGroupRecipientParams,
    UpdateGroupOwnerParams,
    Friend,
    FriendRequest,
    CancelFriendRequestResponse,
    AcceptFriendRequestResponse,
    UpdateStatusParams
} from './types';

const API_URL = process.env.REACT_APP_API_URL;
const axiosClient = axios.create({ baseURL: API_URL })


const config: AxiosRequestConfig = { withCredentials: true }
export const postRegisterUser = async (data: CreateUserParams) => axiosClient.post(`/auth/register`, data, config)

export const postLoginUser = async (data: UserCredentialsParams) => axiosClient.post(`/auth/login`, data, config)

export const getAuthUser = () => axiosClient.get<User>(`/auth/status`, config);

export const getConversations = () =>
    axiosClient.get<Conversation[]>(`/conversations`, config);

export const getConversationMessages = (conversationId: number) =>
    axiosClient.get<FetchMessagePayload>(`/conversations/${conversationId}/messages`, config);

export const createMessage = ({ id, content }: CreateMessageParams) => {
    return axiosClient.post(
        `/conversations/${id}/messages`,
        { content },
        config
    );
}

export const postNewConversation = (data: CreateConversationParams) =>
    axiosClient.post<Conversation>(`/conversations`, data, config);


export const deleteMessage = ({ id, messageId }: DeleteMessageParams) =>
    axiosClient.delete<DeleteMessageResponse>(`/conversations/${id}/messages/${messageId}`, config)


export const editMessage = ({
    content,
    id,
    messageId,
}: EditMessagePayload) =>
    axiosClient.patch<MessageType>(
        `/conversations/${id}/messages/${messageId}`,
        { content },
        config
    );

export const fetchGroups = () => axiosClient.get<Group[]>(`/groups`, config);

export const fetchMessageGroup = (id: number) => axiosClient.get<FetchGroupMessagePayload>(`/groups/${id}/messages`, config);

export const postGroupMessage = ({ id, content }: CreateMessageParams) => axiosClient.post(`/groups/${id}/messages`, { content }, config);

export const searchUsers = (query: string) => axiosClient.get<User[]>(`/users/search?query=${query}`, config);

export const createGroup = (params: CreateGroupParams) => axiosClient.post(`/groups`, params, config);

export const deleteGroupMessage = ({ id, messageId }: DeleteGroupMessageParams) => axiosClient.delete<DeleteGroupMessageResponse>(`/groups/${id}/messages/${messageId}`, config);

export const editGroupMessage = ({ content, id, messageId }: EditMessagePayload) => axiosClient.patch<GroupMessageType>(`/groups/${id}/messages/${messageId}`, { content }, config);

export const addGroupRecipient = ({ id, username }: AddGroupRecipientParams) => axiosClient.post(`/groups/${id}/recipients`, { username }, config);

export const removeGroupRecipient = ({ id, userId }: RemoveGroupRecipientParams) => axiosClient.delete<Group>(`/groups/${id}/recipients/${userId}`, config);

export const getConversationById = (id: number) =>
    axiosClient.get<Conversation>(`/conversations/${id}`, config);

export const fetchGroupById = (id: number) => axiosClient.get<FetchGroupMessagePayload>(`/groups/${id}`, config);

export const updateGroupOwner = ({ id, newOwnerId }: UpdateGroupOwnerParams) => axiosClient.patch(`/groups/${id}/owner`, { newOwnerId }, config);

export const leaveGroup = (id: number) => axiosClient.delete(`/groups/${id}/recipients/leave`, config)

export const fetchFriends = () => axiosClient.get<Friend[]>('/friends', config);


export const fetchFriendsRequest = () => axiosClient.get<FriendRequest[]>('/friends/requests', config);

export const createFriendRequest = (username: string) => axiosClient.post<FriendRequest>('/friends/requests', { username }, config);

export const cancelFriendRequest = (id: number) => axiosClient.delete<CancelFriendRequestResponse>(`/friends/requests/${id}/cancel`, config);

export const acceptFriendRequest = (id: number) => axiosClient.patch<AcceptFriendRequestResponse>(`/friends/requests/${id}/accept`, {}, config);

export const rejectFriendRequest = (id: number) => axiosClient.patch<FriendRequest>(`/friends/requests/${id}/reject`, {}, config);


export const removeFriend = (id: number) =>
    axiosClient.delete<Friend>(`/friends/${id}/delete`, config);

export const checkConversationOrCreate = (recipientId: number) => axiosClient.get<Conversation>(`/exists/conversations/${recipientId}`, config);

export const completeUserProfile = (data: FormData) => axiosClient.post('/users/profiles', data, {
    headers: {
        'Content-Type': 'mutipart/form-data'
    }
});

export const checkUsernameExists = (username: string) => axiosClient.get(`/users/check?username=${username}`, config);

export const updateUserProfile = (data: FormData) => axiosClient.patch<User>(`/users/profiles`, data, {
    ...config,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

export const updateStatusMessage = (data: UpdateStatusParams) => axiosClient.patch('/users/presence/status', data, config);