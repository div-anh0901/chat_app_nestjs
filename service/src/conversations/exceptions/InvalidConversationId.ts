import { HttpException, HttpStatus } from "@nestjs/common";


export class InvalidConversationIdException extends HttpException {
    constructor() {
        super('Conversation Not found', HttpStatus.BAD_REQUEST);
    }
}