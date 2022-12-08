import { CreateUserDetails, FindUserOptions, FindUserParams } from "src/utils/types";
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "src/utils/typeorm";
import { Repository } from 'typeorm';
import { hashPassword } from "src/utils/helpers";
import { IUserService } from "../interfaces/user";
@Injectable()
export class UserService implements IUserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async createUser(userDetails: CreateUserDetails) {
        const existingUser = await this.userRepository.findOne({
            username: userDetails.username,
        });
        if (existingUser)
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        const password = await hashPassword(userDetails.password);
        const newUser = this.userRepository.create({ ...userDetails, password });
        return this.userRepository.save(newUser);
    }

    async findUser(
        params: FindUserParams,
        option?: FindUserOptions
    ): Promise<User> {
        const selections: (keyof User)[] = ['email', "username", 'firstName', 'lastName', 'id'];
        const selectionsWithPassword: (keyof User)[] = [...selections, 'password'];
        return this.userRepository.findOne(params,
            {
                select: option?.selectAll ? selectionsWithPassword : selections,
                relations: ['profile'],
            });
    }

    saveUser(user: User) {
        return this.userRepository.save(user)
    }

    searchUsers(query: string) {
        const statement = '(user.username LIKE :query)';
        return this.userRepository
            .createQueryBuilder('user')
            .where(statement, { query: `%${query}%` })
            .limit(10)
            .select(['user.username', 'user.firstName', 'user.lastName', 'user.email', 'user.id', 'user.profile'])
            .getMany();
        /*const statement = '(user.email LIKE :query)';
        return this.userRepository
            .createQueryBuilder('user')
            .where(statement, { query: `%${query}%` })
            .limit(10)
            .select(['user.firstName', 'user.lastName', 'user.email', 'user.id'])
            .getMany();*/

    }
}
