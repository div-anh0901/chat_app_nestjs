import { AddGroupRecipientParams, AddGroupUserResponse, CheckUserGroupParams, LeaveGroupPrams, RemoveGroupRecipientParams, RemoveGroupUserResponse } from "src/utils/types";


export interface IGroupRecipientService {
    addGroupRecipient(params: AddGroupRecipientParams): Promise<AddGroupUserResponse>;
    removeGroupRecipient(params: RemoveGroupRecipientParams): Promise<RemoveGroupUserResponse>;
    leaveGroup(params: LeaveGroupPrams);
    isUserInGroup(params: CheckUserGroupParams);

}