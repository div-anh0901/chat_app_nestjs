import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";
import { IConversationsService } from "src/conversations/conversations";
import { FriendNotFoundException } from "src/friends/exceptions/FriendNotFound";
import { IFriendsService } from "src/friends/friends";
import { Services } from "src/utils/constants";
import { Conversation, Message, User } from "src/utils/typeorm";
import { CreateMessageParams, DeleteMessageParams, EditMessageParams } from "src/utils/types";
import { Repository } from "typeorm";
import { IMessageService } from "./messages";


@Injectable()
export class MessagesService implements IMessageService {
    constructor(
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(Conversation) private readonly conversationReposiry: Repository<Conversation>,
        @Inject(Services.CONVERSATIONS) private readonly conversationServices: IConversationsService,
        @Inject(Services.FRIENDS_SERVICE) private readonly friendsService: IFriendsService
    ) { }
    async createMessage({ user, content, id }: CreateMessageParams) {
        const conversation = await this.conversationServices.findById(id);
        const { creator, recipient } = conversation;

        const isFriend = await this.friendsService.isFriends(creator.id, recipient.id);
        if (!isFriend) throw new FriendNotFoundException()

        if (creator.id !== user.id && recipient.id !== user.id) {
            throw new HttpException('Cannot  Create  Message', HttpStatus.FORBIDDEN);
        }
        const newMessage = this.messageRepository.create({
            content, conversation, author: instanceToPlain(user)
        });
        const saveMessage = await this.messageRepository.save(newMessage);
        conversation.lastMessageSent = saveMessage;
        const update = await this.conversationServices.save(conversation);
        return { message: saveMessage, conversation: update };
    }
    getMessageByConversationById(conversationId: number): Promise<Message[]> {
        return this.messageRepository.find({
            relations: ['author', 'author.profile'],
            where: { conversation: { id: conversationId } },
            order: { createdAt: 'DESC' }
        })

    }

    async deleteMessage(params: DeleteMessageParams) {
        const { conversationId } = params;

        const msgParams = { id: conversationId, limit: 5 }
        const conversation = await this.conversationServices.getMessages(msgParams);

        const message = await this.messageRepository.findOne({
            id: params.messageId,
            author: { id: params.userId },
            conversation: { id: params.conversationId }
        });

        if (!message) {
            throw new HttpException("Cannot  delete message", HttpStatus.BAD_REQUEST);
        }

        if (conversation.lastMessageSent.id !== message.id) {
            return this.messageRepository.delete({ id: message.id });
        }

        //Deleting Last Message
        const size = conversation.messages.length
        const SECOND_MESSAGE_INDEX = 1;
        if (size <= 1) {
            await this.conversationServices.update({ id: conversation.id, lastMessageSent: null });
            return this.messageRepository.delete({ id: message.id });
        } else {
            const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
            await this.conversationServices.update({ id: conversation.id, lastMessageSent: newLastMessage })
            return this.messageRepository.delete({ id: message.id });
        }
    }

    async editMessage(params: EditMessageParams) {
        const messageDB = await this.messageRepository.findOne({
            where: {
                id: params.messageId,
                author: { id: params.userId },
            },
            relations: [
                'conversation',
                'conversation.creator',
                'conversation.recipient',
                'author',
            ],

        });

        if (!messageDB)
            throw new HttpException("Cannot Exit message", HttpStatus.BAD_REQUEST);
        messageDB.content = params.content;
        return this.messageRepository.save(messageDB);
    }
}