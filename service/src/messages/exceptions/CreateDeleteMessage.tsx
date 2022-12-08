import { HttpException, HttpStatus } from "@nestjs/common";

export class ConnotDeleteMessageException extends HttpException {
    constructor() {
        super('Cannot Delete  Message', HttpStatus.BAD_REQUEST);
    }
}
