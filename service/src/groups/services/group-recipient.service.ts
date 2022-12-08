import { AddGroupRecipientParams, CheckUserGroupParams, LeaveGroupPrams, RemoveGroupRecipientParams } from "src/utils/types";
import { IGroupRecipientService } from "../interfaces/group-recipient";
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Services } from "src/utils/constants";
import { IUserService } from "src/users/interfaces/user";
import { IGroupService } from "../interfaces/group";
import { GroupNotFoundException } from "../exceptions/GroupNotFound";
import { NotGroupOwerException } from "../exceptions/NotGroupOwner";
import { GroupParticipantNotFound } from "../exceptions/GroupParticipantNotFound";

@Injectable()
export class GroupRecipientService implements IGroupRecipientService {
    constructor(
        @Inject(Services.USERS) private readonly userService: IUserService,
        @Inject(Services.GROUPS) private readonly groupService: IGroupService

    ) { }

    async addGroupRecipient(params: AddGroupRecipientParams) {
        const group = await this.groupService.findGroupById(params.id);
        if (!group) {
            throw new HttpException("Group not found", HttpStatus.BAD_REQUEST);
        }
        if (group.owner.id !== params.userId)
            throw new HttpException('Insufficient Permissions', HttpStatus.FORBIDDEN);


        const recipient = await this.userService.findUser({ username: params.username });

        if (!recipient) {
            throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
        }
        const inGroup = group.users.find((user) => user.id === recipient.id);
        if (inGroup)
            throw new HttpException("User already in group", HttpStatus.BAD_REQUEST);
        group.users = [...group.users, recipient];
        const saveGroup = await this.groupService.saveGroup(group);
        return { group: saveGroup, user: recipient };
    }

    async removeGroupRecipient(params: RemoveGroupRecipientParams) {
        const { issuerId, removeUserId, id } = params;
        const group = await this.groupService.findGroupById(id);
        const userTobeRemoved = await this.userService.findUser({
            id: removeUserId
        });
        if (!userTobeRemoved)
            throw new HttpException('User cannot be removed', HttpStatus.BAD_REQUEST);

        if (!group) throw new GroupNotFoundException();

        if (group.owner.id !== issuerId) throw new NotGroupOwerException();

        if (group.owner.id === removeUserId) throw new HttpException('Cannot remove yourself as ower', HttpStatus.BAD_REQUEST);


        group.users = group.users.filter((u) => u.id !== removeUserId);
        const saveGroup = await this.groupService.saveGroup(group);
        return { group: saveGroup, user: userTobeRemoved };
    }

    async isUserInGroup(params: CheckUserGroupParams) {
        const group = await this.groupService.findGroupById(params.id);
        if (!group) throw new GroupNotFoundException();
        const user = await group.users.find((user) => user.id === params.userId);
        if (!user) throw new GroupParticipantNotFound();
        return group;
    }
    async leaveGroup(params: LeaveGroupPrams) {
        const group = await this.isUserInGroup(params);
        console.log(`Updating Groups`);
        if (group.owner.id === params.userId)
            throw new HttpException("Cannot leave group as owner", HttpStatus.BAD_REQUEST);
        group.users = group.users.filter((user) => user.id !== params.userId);
        return this.groupService.saveGroup(group);
    }
}