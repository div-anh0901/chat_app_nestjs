import { Routes, Services } from "src/utils/constants";
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Inject,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IAuthService } from "./auth";
import { CreateUserDto } from "./dtos/CreateUser.dto";
import { instanceToPlain } from 'class-transformer';
import { IUserService } from "src/users/interfaces/user";
import { AuthenticatedGuard, LocalAuthGuard } from './utils/Guards';
import { Throttle } from "@nestjs/throttler";

@Controller(Routes.AUTH)
export class AuthController {
    constructor(@Inject(Services.AUTH) private authService: IAuthService,
        @Inject(Services.USERS) private userService: IUserService,
    ) { }

    //@Throttle(1, 60)
    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto) {
        return instanceToPlain(await this.userService.createUser(createUserDto))
    }


    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Res() res: Response) {
        return res.send(HttpStatus.OK);
    }

    @Get('status')
    @UseGuards(AuthenticatedGuard)
    status(@Req() req: Request, @Res() res: Response) {
        res.send(req.user);
    }

    @Post('logout')
    logout() { }

}