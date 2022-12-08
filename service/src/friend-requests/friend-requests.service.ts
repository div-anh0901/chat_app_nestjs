import { IFriendRequestService } from "./friend-requests";
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Friend } from "src/utils/typeorm";
import { FriendRequest } from "src/utils/typeorm/entities/FriendRequest";
import { Services } from "src/utils/constants";
import { IUserService } from "src/users/interfaces/user";
import { CancelFriendRequestParams, CreateFriendParams, CreateMessageParams, FriendRequestParams } from "src/utils/types";
import { Repository } from "typeorm";
import { FriendRequestException } from "./exceptions/FriendRequest";
import { FriendRequestAcceptedException } from "./exceptions/FriendRequestAccepted";
import { FriendRequestNotFoundException } from "./exceptions/FriendRequestNotfound";
import { UserNotFoundException } from "src/users/exceptions/UserNotFound";
import { FriendRequestPending } from "./exceptions/FriendRequestPending";
import { IFriendsService } from "src/friends/friends";
import { FriendAlreadyExists } from "src/friends/exceptions/FriendAlreadyExists";

Injectable()
export class FriendRequestService implements IFriendRequestService {
    constructor(
        @InjectRepository(Friend) private readonly friendRepository: Repository<Friend>,
        @InjectRepository(FriendRequest) private readonly friendRequestRepository: Repository<FriendRequest>,
        @Inject(Services.USERS) private readonly userService: IUserService,
        @Inject(Services.FRIENDS_SERVICE) private readonly friendService: IFriendsService,
    ) { }

    async create({ user: sender, username }: CreateFriendParams) {
        const receiver = await this.userService.findUser({ username });
        if (!receiver) throw new UserNotFoundException();
        const exists = await this.isPending(sender.id, receiver.id);
        if (exists) throw new FriendRequestPending();
        const existsFriend = await this.friendService.isFriends(sender.id, receiver.id);
        if (existsFriend) throw new FriendAlreadyExists();

        if (receiver.id === sender.id)
            throw new FriendRequestException('Cannot Add Yourself');
        const friend = this.friendRequestRepository.create({
            sender,
            receiver,
            status: 'pending'
        });

        return this.friendRequestRepository.save(friend);
    }

    /* isFriend(userOneId: number, userTwoId: number) {
         return this.friendRequestRepository.findOne({
             where: [
                 {
                     sender: { id: userOneId },
                     receiver: { id: userTwoId },
                     status: 'accepted'
                 },
                 {
                     sender: { id: userTwoId },
                     receiver: { id: userOneId },
                     status: 'accepted'
                 },
             ]
         })
     }*/
    isPending(userOneId: number, userTwoId: number) {
        return this.friendRequestRepository.findOne({
            where: [
                {
                    sender: { id: userOneId },
                    receiver: { id: userTwoId },
                    status: 'pending'
                },
                {
                    sender: { id: userTwoId },
                    receiver: { id: userOneId },
                    status: 'pending'
                },
            ]
        })
    }

    async accept({ id, userId }: FriendRequestParams) {
        const friendRequest = await this.findById(id);

        if (!friendRequest) throw new FriendRequestNotFoundException();
        if (friendRequest.status === 'accepted') {
            throw new FriendRequestAcceptedException()
        }
        if (friendRequest.receiver.id !== userId)
            throw new FriendRequestException();
        friendRequest.status = 'accepted';
        const updateFriendRequest = await this.friendRequestRepository.save(friendRequest);
        const newFriend = this.friendRepository.create({
            sender: friendRequest.sender,
            receiver: friendRequest.receiver
        });
        const friend = await this.friendRepository.save(newFriend);
        return { friend, friendRequest: updateFriendRequest };
    }

    getFriendRequests(id: number): Promise<FriendRequest[]> {
        const status = 'pending';
        return this.friendRequestRepository.find({
            where: [
                { sender: { id }, status },
                { receiver: { id }, status }
            ],
            relations: ['sender', 'receiver', 'sender.profile', 'receiver.profile']
        });
    }

    findById(id: number): Promise<FriendRequest> {
        return this.friendRequestRepository.findOne(id, {
            relations: ['receiver', 'sender']
        })
    }
    async cancel({ id, userId }: CancelFriendRequestParams) {
        const friendRequest = await this.findById(id);
        if (!friendRequest) throw new FriendRequestNotFoundException();
        if (friendRequest.sender.id !== userId) throw new FriendRequestException();

        await this.friendRequestRepository.delete(id);
        return friendRequest;
    }

    async reject({ id, userId }: CancelFriendRequestParams) {
        const friendRequest = await this.findById(id);
        if (!friendRequest) throw new FriendRequestNotFoundException();
        if (friendRequest.status === 'accepted') {
            throw new FriendRequestAcceptedException();
        }
        if (friendRequest.receiver.id !== userId) {
            throw new FriendRequestException();
        }
        friendRequest.status = 'rejected';
        return this.friendRequestRepository.save(friendRequest);
    }
}