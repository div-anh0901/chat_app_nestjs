import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile, User } from "src/utils/typeorm";
import { UpdateUserProfileParams } from "src/utils/types";
import { Repository } from "typeorm";

import { IUserProfile } from "../interfaces/user-profile";



@Injectable()
export class UserProfileService implements IUserProfile {
    constructor(
        @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    createProfile() {
        const newProfile = this.profileRepository.create();
        return this.profileRepository.save(newProfile);
    }

    async createProfileOrUpdate(user: User, params: UpdateUserProfileParams) {
        if (!user.profile) {
            user.profile = await this.createProfile();
            return this.updateProfile(user, params);
        }
        return this.updateProfile(user, params);
    }

    async updateProfile(user: User, params: UpdateUserProfileParams) {
        if (params.avatar) {
            const keyAvartar = params.avatar.filename;
            user.profile.avatar = keyAvartar;
        }
        if (params.banner) {
            const keyBanner = params.banner.filename;
            user.profile.banner = keyBanner;
        }
        if (params.about) {
            user.profile.about = params.about;
        }

        return this.userRepository.save(user);

    }


}