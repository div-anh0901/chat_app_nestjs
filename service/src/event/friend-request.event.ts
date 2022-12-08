import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MessagingGateway } from "src/gateway/gateway";
import { ServerEvents, WebsocketEvents } from "src/utils/constants";
import { FriendRequest } from "src/utils/typeorm";
import { AcceptFriendRequestResponse } from "src/utils/types";


@Injectable()
export class FriendRequestsEvents {
    constructor(private readonly gateway: MessagingGateway) { }

    @OnEvent('friendrequest.create')
    friendRequestService(payload: FriendRequest) {
        const receiverSocket = this.gateway.sessions.getUserSocket(
            payload.receiver.id
        );
        receiverSocket && receiverSocket.emit('onFriendRequestReceived', payload);
    }

    @OnEvent('friendrequest.cancel')
    handleFriendRequestCancel(payload: FriendRequest) {
        const receiverSocket = this.gateway.sessions.getUserSocket(payload.receiver.id);
        receiverSocket && receiverSocket.emit('emitFriendRequestCancelled', payload);
    }

    @OnEvent(ServerEvents.FRIEND_REQUEST_ACCEPTED)
    handFriendRequestAccept(payload: AcceptFriendRequestResponse) {
        const senderSocker = this.gateway.sessions.getUserSocket(payload.friendRequest.sender.id);
        senderSocker && senderSocker.emit(WebsocketEvents.FRIEND_REQUEST_ACCEPTED, payload);
    }

    @OnEvent(ServerEvents.FRIEND_REQUEST_REJECTED)
    handFriendRequestReject(payload: FriendRequest) {
        const senderSocker = this.gateway.sessions.getUserSocket(payload.sender.id);

        senderSocker && senderSocker.emit(WebsocketEvents.FRIEND_REQUEST_REJECTED, payload);
    }
}