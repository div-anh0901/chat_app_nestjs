import { Body, Controller, Inject, Patch, UploadedFiles, UseInterceptors, Get, Param, Res } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Routes, Services, UserProfileFileFileds } from "src/utils/constants";
import { UpdateUserProfileParams, UserProfiles } from "src/utils/types";
import { UpdateUserProfileDto } from "../dtos/UpdateUserProfile.dto";
import { IUserProfile } from "../interfaces/user-profile";
import { diskStorage } from 'multer';
import { UploadClass } from "src/utils/helpers";
import { Response } from "express";
import { AuthUser } from "src/utils/decorators";
import { User } from "src/utils/typeorm";


@Controller(Routes.USERS_PROFILES)
export class UserProfileController {
    constructor(
        @Inject(Services.USERS_PROFILES) private readonly userProfileService: IUserProfile
    ) { }

    @Patch()
    @UseInterceptors(FileFieldsInterceptor(UserProfileFileFileds, {
        storage: diskStorage({
            filename: UploadClass.customFileName,
            destination: UploadClass.filePath
        })
    }))
    async updateUserProfile(
        @AuthUser() user: User,
        @UploadedFiles() files: UserProfiles,
        @Body() updateUserProfileDto: UpdateUserProfileDto
    ) {

        const params: UpdateUserProfileParams = {}
        updateUserProfileDto.about && (params.about = updateUserProfileDto.about);
        files.banner && (params.banner = files.banner[0]);
        files.avatar && (params.avatar = files.avatar[0]);
        return this.userProfileService.createProfileOrUpdate(user, params);
    }


}