import { IAuthService } from "./auth";
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Services } from "src/utils/constants";
import { ValidateUserDetails } from "src/utils/types";
import { IUserService } from "src/users/interfaces/user";
import { compareHash } from "src/utils/helpers";
@Injectable()
export class AuthService implements IAuthService {
    constructor(@Inject(Services.USERS) private readonly userService: IUserService) {

    }

    async validateUser(userDetails: ValidateUserDetails) {
        const user = await this.userService.findUser({ username: userDetails.username }, { selectAll: true });
        if (!user)
            throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
        const isPasswordValid = compareHash(userDetails.password, user.password);
        return isPasswordValid ? user : null;
    }
}