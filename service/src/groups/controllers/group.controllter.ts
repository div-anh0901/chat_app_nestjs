import { Controller, Inject, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes, Services, } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateGroupDto } from '../dtos/CreateGroup.dto';
import { TransferOwnerDto } from '../dtos/TransferOwner.dto';
import { IGroupService } from '../interfaces/group';


@Controller(Routes.GROUPS)
export class GroupController {
    constructor(
        @Inject(Services.GROUPS) private readonly groupService: IGroupService,
        private readonly events: EventEmitter2
    ) { }

    @Post()
    async createGroup(@AuthUser() user: User, @Body() payload: CreateGroupDto) {
        const groups = await this.groupService.createGroup({ ...payload, creator: user });

        this.events.emit('group.create', groups);
        return groups;
    }

    @Get()
    getGroups(@AuthUser() user: User) {
        return this.groupService.getGroups({ userId: user.id });
    }

    @Get(':id')
    async getGroup(@AuthUser() user: User, @Param('id') id: number) {
        const response = await this.groupService.findGroupById(id);
        return response;
    }

    @Patch(':id/owner')
    async updateGroupOwner(@AuthUser() { id: userId }: User, @Param('id') groupId: number, @Body() { newOwnerId }: TransferOwnerDto) {
        const params = { userId, groupId, newOwnerId };
        const group = await this.groupService.transferGroupOwner(params);
        this.events.emit('group.owner.update', group);
        return group;
    }
}