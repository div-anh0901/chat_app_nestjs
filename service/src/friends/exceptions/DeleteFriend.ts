import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteFriendException extends HttpException {
    constructor() {
        super('Cannot Delete found ', HttpStatus.BAD_REQUEST)
    }
}