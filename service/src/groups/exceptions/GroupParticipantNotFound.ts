import { HttpException, HttpStatus } from '@nestjs/common';

export class GroupParticipantNotFound extends HttpException {
    constructor() {
        super('Group Parcipient not found', HttpStatus.NOT_FOUND);
    }
}