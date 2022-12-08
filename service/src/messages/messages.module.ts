import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversationsModule } from "src/conversations/conversations.module";
import { FriendsModule } from "src/friends/friends.module";
import { Services } from "src/utils/constants";
import { Conversation, Message } from "src/utils/typeorm";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";

@Module({
    imports: [TypeOrmModule.forFeature([Message, Conversation]), ConversationsModule, FriendsModule],
    controllers: [MessagesController],
    providers: [
        {
            provide: Services.Messages,
            useClass: MessagesService
        }
    ]
})

export class MessagesModule { }