import { HttpException, HttpStatus } from "@nestjs/common";


export class ConversationNotFound extends HttpException {
    constructor() {
        super('Conversation Not found', HttpStatus.NOT_FOUND);
    }
}