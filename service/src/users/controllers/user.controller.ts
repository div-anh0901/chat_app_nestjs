import { Controller, Get, HttpException, HttpStatus, Inject, Query, Param, Res } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { IUserService } from "../interfaces/user";
import { UserAlreadyExists } from "../exceptions/UserAlreadyExists";
import { Response } from "express";

@Controller(Routes.USERS)
export class UserController {
    constructor(
        @Inject(Services.USERS) private readonly userService: IUserService
    ) { }

    @Get('search')
    searchUser(@Query('query') query: string) {
        if (!query) {
            throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST)
        }
        return this.userService.searchUsers(query);
    }

    @Get('check')
    async checkUsername(@Query('username') username: string) {
        if (!username)
            throw new HttpException('Invalid Query', HttpStatus.BAD_REQUEST);
        const user = await this.userService.findUser({ username });
        if (user) throw new UserAlreadyExists();
        return HttpStatus.OK;
    }

    @Get('/uploads/:filename')
    async getImage(@Param('filename') filename, @Res() res: Response) {
        res.sendFile(filename, { root: './uploads' })
    }

    @Get('/uploads/attachments/:filename')
    async getImageAttachment(@Param('filename') filename, @Res() res: Response) {
        res.sendFile(filename, { root: './uploads/attachments' })
    }
}