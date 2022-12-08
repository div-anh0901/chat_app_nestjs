import { IGroupService } from "../interfaces/group";
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Group, User } from "src/utils/typeorm";
import { Repository } from "typeorm";
import { Services } from "src/utils/constants";
import { IUserService } from "src/users/interfaces/user";
import { AccessParams, CreateGroupParam, FetchGroupsParams, TransferOwerParams } from "src/utils/types";
import { GroupNotFoundException } from "../exceptions/GroupNotFound";
import { GroupOwnerTransferException } from "../exceptions/GroupOwnerTransfer";
import { UserNotFoundException } from "src/users/exceptions/UserNotFound";

@Injectable()
export class GroupService implements IGroupService {
    constructor(@InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @Inject(Services.USERS) private readonly userService: IUserService
    ) { }

    async createGroup(params: CreateGroupParam) {
        const { creator, title } = params;
        const usersPromise = params.users.map((username) => {
            return this.userService.findUser({ username });
        });

        const users = (await Promise.all(usersPromise)).filter((user) => user);
        users.push(creator);
        const groupParams = { owner: creator, users, creator, title };
        const group = this.groupRepository.create(groupParams);
        return this.groupRepository.save(group);

    }

    getGroups(params: FetchGroupsParams): Promise<Group[]> {
        return this.groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.users', 'user')
            .leftJoinAndSelect('group.creator', 'creator')
            .where('user.id IN (:users)', { users: [params.userId] })
            .leftJoinAndSelect('group.users', 'users')
            .leftJoinAndSelect('group.owner', 'owner')
            .leftJoinAndSelect('users.profile', 'usersProfile')
            .leftJoinAndSelect('users.presence', 'usersPresence')
            .getMany();
    }

    findGroupById(id: number): Promise<Group> {
        return this.groupRepository.findOne({
            where: { id },
            relations: ['creator', 'users', 'owner', 'lastMessageSent', 'users.profile', 'users.presence']
        });
    }

    saveGroup(group: Group): Promise<Group> {
        return this.groupRepository.save(group);
    }

    async hasAccess({ id, userId }: AccessParams): Promise<User | undefined> {
        const group = await this.findGroupById(id);
        if (!group) throw new GroupNotFoundException();
        return group.users.find((user) => user.id === userId);
    }

    async transferGroupOwner({ userId, groupId, newOwnerId }: TransferOwerParams) {
        const group = await this.findGroupById(groupId);

        if (!group) throw new GroupNotFoundException();
        if (group.owner.id !== userId) {
            throw new GroupOwnerTransferException('Insufficient Permissions');
        }
        if (group.owner.id === newOwnerId) {
            throw new GroupOwnerTransferException('Cannot Transfer Owner to yourself');
        }
        const newOwner = await this.userService.findUser({ id: newOwnerId });
        if (!newOwner) throw new UserNotFoundException();
        group.owner = newOwner;
        return this.groupRepository.save(group)
    }

}