import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { Services } from "src/utils/constants";
import { Friend } from "src/utils/typeorm";
import { FriendController } from "./friends.controller";
import { FriendsService } from "./friends.service";



@Module({
    imports: [TypeOrmModule.forFeature([Friend]), UsersModule],
    controllers: [FriendController],
    providers: [{
        provide: Services.FRIENDS_SERVICE,
        useClass: FriendsService
    }],
    exports: [
        {
            provide: Services.FRIENDS_SERVICE,
            useClass: FriendsService,
        },
    ],
})

export class FriendsModule { }