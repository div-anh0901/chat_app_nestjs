import { HttpException, HttpStatus } from '@nestjs/common';

export class NotGroupOwerException extends HttpException {
    constructor() {
        super('Not a Group Owner', HttpStatus.BAD_REQUEST);
    }
}
