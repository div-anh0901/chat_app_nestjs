import { Inject } from "@nestjs/common";
import { Services } from "src/utils/constants";
import { AuthenticatedSocket } from "src/utils/interfaces";
import { IGatewaySessionManager } from "./gateway.session";
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    ConnectedSocket,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from "@nestjs/event-emitter";
import { AddGroupUserResponse, CreateGroupMessageResponse, CreateMessageResponse, RemoveGroupUserResponse } from "src/utils/types";
import { Conversation, Group, GroupMessage, Message } from "src/utils/typeorm";
import { IConversationsService } from "src/conversations/conversations";
import { IGroupService } from "src/groups/interfaces/group";
import { IFriendsService } from "src/friends/friends";
@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,

    },
    pingInterval: 10000,
    pingTimeout: 15000,
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject(Services.GATEWAY_SESSION_MANAGER) readonly sessions: IGatewaySessionManager,
        @Inject(Services.CONVERSATIONS) private readonly conversationService: IConversationsService,
        @Inject(Services.GROUPS) private readonly groupsService: IGroupService,
        @Inject(Services.FRIENDS_SERVICE)
        private readonly friendsService: IFriendsService,
    ) {

    }
    @WebSocketServer()
    server: Server;


    handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
        this.sessions.setUserSocket(socket.user.id, socket);
        socket.emit('connected', { status: 'good' });
    }

    handleDisconnect(socket: AuthenticatedSocket) {
        // console.log('handleDisConnect');
        // console.log(`${socket.user.email}`);
        this.sessions.removeUserSocket(socket.user.id);
    }

    @SubscribeMessage('getOnlineGroupUsers')
    async handleGetOnlineGroupUser(@MessageBody() data: any, @ConnectedSocket() socket: AuthenticatedSocket) {
        const group = await this.groupsService.findGroupById(parseInt(data.groupId));
        if (!group) return;

        const onlineUsers = [];
        const offlineUsers = [];
        group.users.forEach((user) => {
            const socket = this.sessions.getUserSocket(user.id);
            socket ? onlineUsers.push(user) : offlineUsers.push(user);
        });
        socket.emit('onlineGroupUsersReceived', { onlineUsers, offlineUsers });
    }



    @SubscribeMessage('createMessage')
    handleCreateMessage(@MessageBody() data: any) {
        console.log('Create Message');
    }

    @OnEvent('message.create')
    handleMessageCreateEvent(payload: CreateMessageResponse) {
        console.log('Inside message.create');

        const { author, conversation: { creator, recipient } } = payload.message;
        const authorSocket = this.sessions.getUserSocket(author.id);
        const recipientSocket = author.id === creator.id ? this.sessions.getUserSocket(recipient.id) : this.sessions.getUserSocket(creator.id);
        if (authorSocket) {
            authorSocket.emit('onMessage', payload);
        }
        if (recipientSocket) {
            recipientSocket.emit('onMessage', payload)
        }
    }

    @SubscribeMessage('onConversationJoin')
    onConversationJoin(
        @MessageBody() data: any,
        @ConnectedSocket() client: AuthenticatedSocket,
    ) {
        client.join(data.conversationId);
        client.to(data.conversationId).emit('userJoin');
    }

    @SubscribeMessage('onConversationLeave')
    onConversationLeave(
        @MessageBody() data: any,
        @ConnectedSocket() client: AuthenticatedSocket,
    ) {
        client.leave(data.conversationId);
        client.to(data.conversationId).emit('userLeave');
    }

    @SubscribeMessage('onTypingStart')
    onTypingStart(
        @MessageBody() data: any,
        @ConnectedSocket() client: AuthenticatedSocket,
    ) {
        client.to(data.conversationId).emit('onTypingStart');
    }

    @SubscribeMessage('onTypingStop')
    onTypingStop(
        @MessageBody() data: any,
        @ConnectedSocket() client: AuthenticatedSocket,
    ) {
        client.to(data.conversationId).emit('onTypingStop');
    }

    @OnEvent('conversation.create')
    handleConversationCreateEvent(payload: Conversation) {
        console.log("socket")
        console.log(payload)
        const recipientSocket = this.sessions.getUserSocket(payload.recipient.id);
        if (recipientSocket) {
            recipientSocket.emit('onConversation', payload);
        }

    }

    @OnEvent('message.delete')
    async handleMessageDelete(payload) {
        const conversation = await this.conversationService.findById(
            payload.conversationId,
        );
        if (!conversation) return;
        const { creator, recipient } = conversation;
        const recipientSocket =
            creator.id === payload.userId
                ? this.sessions.getUserSocket(recipient.id)
                : this.sessions.getUserSocket(creator.id);
        if (recipientSocket) recipientSocket.emit('onMessageDelete', payload);
    }


    @OnEvent('message.update')
    async handleMessageUpdate(message: Message) {
        const { author, conversation: { creator, recipient } } = message;
        const recipientSocket = author.id === creator.id ? this.sessions.getUserSocket(recipient.id) : this.sessions.getUserSocket(creator.id);

        if (recipientSocket) {
            recipientSocket.emit('onMessageUpdate', message);
        }
    }

    @SubscribeMessage('onGroupJoin')
    onGroupJoin(
        @MessageBody() data: any,
        @ConnectedSocket() client: AuthenticatedSocket
    ) {
        client.join(`group-${data.groupId}`);
        client.to(`group-${data.groupId}`).emit('userGroupJoin');
    }


    @SubscribeMessage('onGroupLeave')
    onGroupLeave(
        @MessageBody() data: any,
        @ConnectedSocket() client: AuthenticatedSocket
    ) {
        client.leave(`group-${data.groupId}`);
        client.to(`group-${data.groupId}`).emit('onGroupLeave');
    }
    @OnEvent('group.message.create')
    async handleGroupMessageCreate(payload: CreateGroupMessageResponse) {
        const { id } = payload.group;
        this.server.to(`group-${id}`).emit('onGroupMessage', payload);

    }


    @OnEvent('group.create')
    async handleGroupCreate(payload: Group) {
        payload.users.forEach((user) => {
            const socket = this.sessions.getUserSocket(user.id);
            socket && socket.emit('onGroupCreate', payload);
        })
    }

    @OnEvent('group.message.update')
    async handleGroupUpdateMessage(payload: GroupMessage) {
        const room = `group-${payload.group.id}`;
        this.server.to(room).emit('onGroupMessageUpdate', payload);
    }

    @OnEvent('group.user.add')
    handleGroupUserAdd(payload: AddGroupUserResponse) {
        const recipientSocket = this.sessions.getUserSocket(payload.user.id);
        this.server.to(`group-${payload.group.id}`).emit('onGroupReciverNewUser', payload);
        recipientSocket && recipientSocket.emit('onGroupUserAdd', payload);
    }

    @OnEvent('group.user.remove')
    handleGroupUserRemove(payload: RemoveGroupUserResponse) {
        // this.server.to(`group-${payload.group.id}`).emit('onGroupRemoveUser', payload);
        const { group, user } = payload;
        const ROOM_NAME = `group-${payload.group.id}`;
        const removedUserSocket = this.sessions.getUserSocket(payload.user.id);
        if (removedUserSocket) {
            removedUserSocket.emit('onGroupRemove', payload);
            removedUserSocket.leave(ROOM_NAME);

        }
        this.server.to(ROOM_NAME).emit('onGroupRecipientRemoved', payload);
        const onlineUsers = group.users
            .map((user) => this.sessions.getUserSocket(user.id) && user)
            .filter((user) => user);
    }

    @OnEvent('group.owner.update')
    handleGroupOwnerUpdate(payload: Group) {
        const ROOM_NAME = `group-${payload.id}`;
        const newOwnerSocket = this.sessions.getUserSocket(payload.owner.id);
        const { rooms } = this.server.sockets.adapter;
        const socketsInRoom = rooms.get(ROOM_NAME);
        /*console.log(socketsInRoom);
        console.log(newOwnerSocket);*/
        this.server.to(ROOM_NAME).emit('onGroupOwnerUpdate', payload);
        if (newOwnerSocket && !socketsInRoom.has(newOwnerSocket.id)) {
            newOwnerSocket.emit('onGroupOwnerUpdate', payload);
        };

    }

    @OnEvent('group.user.leave')
    handleGroupUserLeave(payload) {
        const ROOM_NAME = `group-${payload.group.id}`;
        const leftUserSocket = this.sessions.getUserSocket(payload.userId);
        const { rooms } = this.server.sockets.adapter;
        const socketsInRoom = rooms.get(ROOM_NAME);
        if (leftUserSocket && socketsInRoom) {
            console.log('user is  online, at  least 1 person is in the  room');
            if (socketsInRoom.has(leftUserSocket.id)) {
                console.log('User is in room... room set has socket it');
                return this.server.to(ROOM_NAME).emit('onGroupParticipantLeft', payload);
            } else {
                console.log('User is  not in room, but someone is there');
                leftUserSocket.emit('onGroupParticipantLeft', payload);
                this.server.to(ROOM_NAME).emit('onGroupParticipantLeft', payload);
                return;
            }
        }

        if (leftUserSocket && !socketsInRoom) {
            console.log('User is  online  but there are sockets in the  room')
            return leftUserSocket.emit('onGroupParticipantLeft', payload);
        }
    }

    @SubscribeMessage('getOnlineFriends')
    async handleFriendListRetrieve(@MessageBody() data: any, @ConnectedSocket() socket: AuthenticatedSocket) {
        const { user } = socket;
        if (user) {
            const friends = await this.friendsService.getFriends(user.id);
            const onlinesFriends = friends.filter((friend) => this.sessions.getUserSocket(user.id === friend.receiver.id ? friend.sender.id : friend.receiver.id));
            socket.emit('getOnlineFriends', onlinesFriends)
        }
    }

}