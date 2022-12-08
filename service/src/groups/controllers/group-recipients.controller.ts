import { Controller, Inject, Post, Param, Body, ParseIntPipe, Delete } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from '@nestjs/passport';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { AddGroupRecipientDto } from '../dtos/AddGroupRecipient.dto';
import { IGroupRecipientService } from '../interfaces/group-recipient';


@Controller(Routes.GROUP_RECIPIENTS)
export class GroupRecipientsController {

    constructor(
        @Inject(Services.GROUP_RECIPIENTS) private readonly groupRecipientService: IGroupRecipientService,
        private eventEmitter: EventEmitter2
    ) { }

    @Post()
    async addGroupRecipient(
        @AuthUser() { id: userId }: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() { username }: AddGroupRecipientDto
    ) {
        const params = { id, userId, username };
        const reponse = await this.groupRecipientService.addGroupRecipient(params);
        this.eventEmitter.emit('group.user.add', reponse)
        return reponse;
    }

    @Delete('leave')
    async leaveGroup(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) groupId: number,
    ) {
        const group = await this.groupRecipientService.leaveGroup({
            id: groupId,
            userId: user.id
        });
        this.eventEmitter.emit('group.user.leave', { group, userId: user.id });
        return group;
    }

    @Delete(':userId')
    async removeGroupRecipient(
        @AuthUser() { id: issuerId }: User,
        @Param('id', ParseIntPipe) id: number,
        @Param('userId', ParseIntPipe) removeUserId: number
    ) {
        const params = { issuerId, id, removeUserId };
        const response = await this.groupRecipientService.removeGroupRecipient(params);
        this.eventEmitter.emit('group.user.remove', response);
        return response.group;
    }

}


