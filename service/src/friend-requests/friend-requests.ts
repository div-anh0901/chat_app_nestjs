import { FriendRequest } from "src/utils/typeorm/entities/FriendRequest";
import { AcceptFriendRequestResponse, CancelFriendRequestParams, CreateFriendParams, CreateMessageParams, FriendRequestParams } from "src/utils/types";


export interface IFriendRequestService {
    create(params: CreateFriendParams);
    isPending(userOneId: number, userTwoId: number);
    getFriendRequests(userId: number): Promise<FriendRequest[]>;
    //isFriend(userOneId: number, userTwoId: number);
    accept(params: FriendRequestParams): Promise<AcceptFriendRequestResponse>;
    findById(id: number): Promise<FriendRequest>;
    cancel(params: CancelFriendRequestParams): Promise<FriendRequest>;
    reject(params: CancelFriendRequestParams): Promise<FriendRequest>;
}