import { NestMiddleware, Inject } from '@nestjs/common';
import { IConversationsService } from 'src/conversations/conversations';
import { Services } from 'src/utils/constants';
import { AuthenticatedRequest } from 'src/utils/types';
import { NextFunction, Response } from 'express';
import { InvalidConversationIdException } from '../exceptions/InvalidConversationId';
import { ConversationNotFound } from '../exceptions/ConversationNotFound';



export class ConversationMiddleware implements NestMiddleware {
    constructor(
        @Inject(Services.CONVERSATIONS) private readonly conversationService: IConversationsService,
    ) {

    }
    async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id: userId } = req.user;
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new InvalidConversationIdException();

        const params = { id, userId };

        const isReadable = await this.conversationService.hassAccess(params);
        if (isReadable) next();
        else throw new ConversationNotFound();

    }
}