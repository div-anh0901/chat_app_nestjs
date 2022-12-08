import { Body, Controller, Get, Delete, Inject, Param, ParseIntPipe, Post, Patch } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { AuthUser } from "src/utils/decorators";
import { User } from "src/utils/typeorm";
import { CreateMessageDto } from "./dtos/CreateMessage.dto";
import { MessagesService } from "./messages.service";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageParams } from "src/utils/types";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

@Controller(Routes.Messages)
export class MessagesController {
    constructor(@Inject(Services.Messages) private readonly messageService: MessagesService,
        private eventEmitter: EventEmitter2
    ) {
    }

    @Throttle(5, 10)
    @Post()
    async createMessage(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() { content }: CreateMessageDto
    ) {
        const params = { user, id, content };
        const reponse = await this.messageService.createMessage(params);
        this.eventEmitter.emit('message.create', reponse);
        return;
    }

    @Get()
    @SkipThrottle()
    async getMessagesFromConversation(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const messages = await this.messageService.getMessageByConversationById(id);
        return { id, messages }
    }

    @Delete(':messageId')
    async deleteMessageFromConversation(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) conversationId: number,
        @Param('messageId', ParseIntPipe) messageId: number
    ) {
        await this.messageService.deleteMessage({
            userId: user.id,
            conversationId,
            messageId
        });
        this.eventEmitter.emit('message.delete', {
            userId: user.id,
            messageId,
            conversationId
        });

        return { conversationId, messageId }
    }

    @Patch(':messageId')
    async editMessage(
        @AuthUser() { id: userId }: User,
        @Param('id') conversationId: number,
        @Param('messageId') messageId: number,
        @Body() { content }: EditMessageParams

    ) {
        const params = { userId, content, conversationId, messageId };
        const message = await this.messageService.editMessage(params);
        this.eventEmitter.emit('message.update', message);
        return message;
    }
}