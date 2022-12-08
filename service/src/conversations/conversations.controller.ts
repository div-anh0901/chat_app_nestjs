import { Body, Controller, UseGuards, Inject, Post, Get, Param } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { User } from 'src/utils/typeorm';
import { CreateConversationParams } from 'src/utils/types';
import { IConversationsService } from './conversations';
import { AuthUser } from 'src/utils/decorators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SkipThrottle } from '@nestjs/throttler';
@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticatedGuard)
export class ConversationsController {
    constructor(
        @Inject(Services.CONVERSATIONS) private readonly conversationsService: IConversationsService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    @Post()
    async createConversation(@AuthUser() user: User, @Body() createConversationPayload: CreateConversationParams) {

        const conversation = await this.conversationsService.createConversation(user, createConversationPayload)

        this.eventEmitter.emit('conversation.create', conversation)
        return conversation;
    }

    @Get()
    @SkipThrottle()
    async getConversations(@AuthUser() { id }: User) {
        return this.conversationsService.getConversations(id);
    }

    @Get(":id")
    @SkipThrottle()
    getConversationById(@Param('id') id: number) {
        return this.conversationsService.findById(id);
    }
}
