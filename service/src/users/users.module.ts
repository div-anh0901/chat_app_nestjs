import { Module } from '@nestjs/common';
import { Services } from '../utils/constants';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User, UserPresence } from 'src/utils/typeorm';
import { UserController } from './controllers/user.controller';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserProfileService } from './services/user-profile.service';
import { UserPresenceController } from './controllers/user-presence.controller';
import { UserPresenceService } from './services/user-presence.service';
@Module({
    imports: [TypeOrmModule.forFeature([User, UserPresence, Profile])],
    controllers: [UserController, UserProfileController, UserPresenceController],
    providers: [
        {
            provide: Services.USERS,
            useClass: UserService,
        },
        {
            provide: Services.USERS_PROFILES,
            useClass: UserProfileService,
        },
        {
            provide: Services.USER_PRESENCE,
            useClass: UserPresenceService,
        },

    ],
    exports: [
        {
            provide: Services.USERS,
            useClass: UserService,
        },
        {
            provide: Services.USERS_PROFILES,
            useClass: UserProfileService,
        },
        {
            provide: Services.USER_PRESENCE,
            useClass: UserPresenceService,
        },
    ],
})
export class UsersModule { }