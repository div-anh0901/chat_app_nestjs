import { Inject, Post, Param, ParseIntPipe, Body, Controller, Get, Delete, Patch } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreateMessageDto } from 'src/messages/dtos/CreateMessage.dto';
import { EditMessageDto } from 'src/messages/dtos/EditMesage.dto';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { IGroupMessageService } from '../interfaces/group-messages';

@Controller(Routes.GROUP_MESSAGES)
export class GroupMessageController {
    constructor(@Inject(Services.GROUP_MESSAGES) private readonly groupMessageService: IGroupMessageService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    @Throttle(5, 10)
    @Post()
    async createGroupMessage(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() { content }: CreateMessageDto,
    ) {
        const response = await this.groupMessageService.createGroupMessage({ author: user, groupId: id, content });
        this.eventEmitter.emit('group.message.create', response);
    }

    @SkipThrottle()
    @Get()
    async getGroupMessage(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number
    ) {
        const messages = await this.groupMessageService.getGroupMessage(id);
        return { id, messages };
    }

    @SkipThrottle()
    @Delete(':messageId')
    async deleteGroupMessage(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) groupId: number,
        @Param('messageId', ParseIntPipe) messageId: number

    ) {
        await this.groupMessageService.deleteGroupMessage({
            userId: user.id,
            groupId,
            messageId,
        });

        this.eventEmitter.emit('group.message.delete', {
            userId: user.id,
            groupId,
            messageId,
        });

        return { groupId, messageId };
    }

    @SkipThrottle()
    @Patch(':messageId')
    async editGroupMessage(
        @AuthUser() { id: userId }: User,
        @Param('id', ParseIntPipe) groupId: number,
        @Param('messageId', ParseIntPipe) messageId: number,
        @Body() { content }: EditMessageDto
    ) {
        const params = { userId, content, groupId, messageId };
        const message = await this.groupMessageService.editGroupMessage(params);
        this.eventEmitter.emit('group.message.update', message);
        return message;

    }

}