import { OnEvent } from "@nestjs/event-emitter";
import { Injectable } from '@nestjs/common'
import { MessagingGateway } from "src/gateway/gateway";
import { ServerEvents, Services } from "src/utils/constants";
import { RemovedFriendEventPayload } from "src/utils/types";

@Injectable()
export class FriendEvents {
    constructor(
        private readonly gateway: MessagingGateway
    ) {

    }

    @OnEvent(ServerEvents.FRIEND_REMOVED)
    handleFriendRemoved({ userId, friend }: RemovedFriendEventPayload) {
        const { sender, receiver } = friend;
        const socket = this.gateway.sessions.getUserSocket(receiver.id === userId ? sender.id : receiver.id);
        socket?.emit('onFriendRemoved', friend);
    }
}