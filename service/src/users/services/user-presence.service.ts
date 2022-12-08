import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Services } from "src/utils/constants";
import { User, UserPresence } from "src/utils/typeorm";
import { UpdateStatusMessageParams } from "src/utils/types";
import { Repository } from "typeorm";
import { IUserService } from "../interfaces/user";
import { IUserServicePresence } from "../interfaces/user-presence";


@Injectable()
export class UserPresenceService implements IUserServicePresence {
    constructor(
        @InjectRepository(UserPresence) private readonly userPresenceRepository: Repository<UserPresence>,
        @Inject(Services.USERS) private readonly userService: IUserService

    ) { }
    createPresence(): Promise<UserPresence> {
        return this.userPresenceRepository.save(this.userPresenceRepository.create());
    }

    async updateStatus({ user, statusMessage }: UpdateStatusMessageParams): Promise<User> {
        if (!user.presence) {
            user.presence = await this.createPresence()
        }

        user.presence.statusMessage = statusMessage;
        return this.userService.saveUser(user);
    }
}