import { Controller, Inject, Get, Param, ParseIntPipe, HttpException, HttpStatus, Post } from "@nestjs/common";
import { IConversationsService } from "src/conversations/conversations";
import { IUserService } from "src/users/interfaces/user";
import { Routes, Services } from "src/utils/constants";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthUser } from "src/utils/decorators";
import { User } from "src/utils/typeorm";

@Controller(Routes.EXISTS)
export class ExistsController {
    constructor(
        @Inject(Services.CONVERSATIONS) private readonly conversationsService: IConversationsService,
        @Inject(Services.USERS) private readonly userService: IUserService,
        private readonly events: EventEmitter2
    ) { }


    @Get('/conversations/:recipientId')
    async checkConversationExists(@AuthUser() user: User, @Param('recipientId', ParseIntPipe) recipientId: number) {
        const conversation = await this.conversationsService.isCreated(recipientId, user.id);
        if (conversation) return conversation;
        const recipient = await this.userService.findUser({ id: recipientId });
        if (!recipient) {
            throw new HttpException('Recipient Not Found', HttpStatus.NOT_FOUND);
        }

        const newConversation = await this.conversationsService.createConversation(
            user,
            {
                username: recipient.username,
                message: 'hello'
            }
        );

        this.events.emit('conversation.create', newConversation);

    }




}