import { Module } from "@nestjs/common";
import { GatewayModule } from "src/gateway/gateway.module";
import { FriendRequestsEvents } from "./friend-request.event";
import { FriendEvents } from "./friends.events";

@Module({
    imports: [GatewayModule],
    providers: [FriendRequestsEvents, FriendEvents],
})
export class EventsModule { }