import { Body, Controller, Inject, Patch } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Routes, Services } from "src/utils/constants";
import { AuthUser } from "src/utils/decorators";
import { User } from "src/utils/typeorm";
import { UpdateProsenceStatusDto } from "../dtos/UserPresenceStatus";
import { IUserServicePresence } from "../interfaces/user-presence";


@Controller(Routes.USER_PRESENCE)
export class UserPresenceController {
    constructor(
        @Inject(Services.USER_PRESENCE) private readonly userPresenceService: IUserServicePresence
    ) { }

    @Patch('status')
    updateStatus(@AuthUser() user: User, @Body() { statusMessage }: UpdateProsenceStatusDto) {
        return this.userPresenceService.updateStatus({ user, statusMessage });
    }
}