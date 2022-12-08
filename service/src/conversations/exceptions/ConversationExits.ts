import { HttpException, HttpStatus } from "@nestjs/common";


export class ConversationExitsException extends HttpException {
    constructor() {
        super('Conversation Already Exists', HttpStatus.CONFLICT);
    }
}