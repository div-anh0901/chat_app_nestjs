import { Body, Get, Controller, Inject, Post, Delete, Param, ParseIntPipe } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { get } from "http";
import { Routes, ServerEvents, Services } from "src/utils/constants";
import { AuthUser } from "src/utils/decorators";
import { User } from "src/utils/typeorm";
import { CreateFriendDto } from "../friend-requests/dtos/CreateFriend.dto";
import { IFriendsService } from "./friends";

@Controller(Routes.FRIENDS)
export class FriendController {
    constructor(
        @Inject(Services.FRIENDS_SERVICE) private readonly friendsService: IFriendsService,
        private event: EventEmitter2
    ) {

    }

    @Get()
    getFriends(@AuthUser() user: User) {

        return this.friendsService.getFriends(user.id);
    }

    @Delete(':id/delete')
    async deleteFriend(
        @AuthUser() { id: userId }: User,
        @Param('id', ParseIntPipe) id: number) {
        const friend = await this.friendsService.deleteFriend({ id, userId });
        console.log(friend)
        this.event.emit(ServerEvents.FRIEND_REMOVED, { friend, userId });
        return friend;
    }


}