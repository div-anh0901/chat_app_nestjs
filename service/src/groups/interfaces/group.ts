import { Group, User } from "src/utils/typeorm";
import { AccessParams, CreateGroupParam, FetchGroupsParams, TransferOwerParams } from "src/utils/types";

export interface IGroupService {
    createGroup(params: CreateGroupParam);
    getGroups(params: FetchGroupsParams): Promise<Group[]>;
    findGroupById(id: number): Promise<Group>;
    saveGroup(group: Group): Promise<Group>;
    hasAccess(params: AccessParams): Promise<User | undefined>;
    transferGroupOwner(params: TransferOwerParams): Promise<Group>;
}

