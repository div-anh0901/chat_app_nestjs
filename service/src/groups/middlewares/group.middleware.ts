import { NestMiddleware, Inject } from '@nestjs/common'
import { AuthenticatedRequest } from 'src/utils/types';
import { Response, NextFunction } from 'express';
import { InvalidGroupException } from '../exceptions/InvalidGroup';
import { Services } from 'src/utils/constants';
import { IGroupService } from '../interfaces/group';
import { GroupNotFoundException } from '../exceptions/GroupNotFound';

export class GroupMiddleware implements NestMiddleware {
    constructor(
        @Inject(Services.GROUPS) private readonly groupService: IGroupService

    ) { }
    async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id: userId } = req.user;
        const id = parseInt(req.params.id);

        if (isNaN(id)) throw new InvalidGroupException();
        const params = { id, userId };
        const user = await this.groupService.hasAccess(params);
        if (user) next();
        else throw new GroupNotFoundException();
    }
}