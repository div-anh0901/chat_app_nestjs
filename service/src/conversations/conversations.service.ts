import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Conversation, Message, User } from 'src/utils/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessParams, CreateConversationParams, GetConversationMessagesParams, UpdateConversationParams } from 'src/utils/types';
import { IConversationsService } from './conversations';
import { Repository } from 'typeorm';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/users/interfaces/user';
import { ConversationNotFound } from './exceptions/ConversationNotFound';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound';
import { CreateConversationExcecption } from './exceptions/CreateConversation';
import { ConversationExitsException } from './exceptions/ConversationExits';


@Injectable()
export class ConversationsService implements IConversationsService {
    constructor(
        @InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,
        @Inject(Services.USERS) private readonly userSerive: IUserService,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>

    ) { }

    async isCreated(userId: number, recipientId: number): Promise<Conversation> {
        return this.conversationRepository.findOne({
            where: [
                {
                    creator: { id: userId },
                    recipient: { id: recipientId },

                }, {
                    creator: { id: recipientId },
                    recipient: { id: userId }
                }
            ]
        });
    }

    async createConversation(user: User, params: CreateConversationParams) {

        const { username, message: content } = params;
        const recipient = await this.userSerive.findUser({ username });
        if (!recipient) throw new UserNotFoundException();

        if (user.id == recipient.id) {
            const error = 'Cannot create Conversation with yourself';
            throw new CreateConversationExcecption(error);
        }

        const existingConversation = await this.isCreated(user.id, recipient.id);

        if (existingConversation) {
            throw new ConversationExitsException()
        }

        const conversation = this.conversationRepository.create({
            creator: user,
            recipient: recipient,
        });

        const saveConversation = await this.conversationRepository.save(conversation);
        const messageParams = { content, conversation, author: user };

        const message = this.messageRepository.create(messageParams);
        await this.messageRepository.save(message);
        return saveConversation
    }

    async findById(id: number) {
        return this.conversationRepository.findOne({
            where: { id },
            relations: [
                'creator',
                'recipient',
                'creator.profile',
                'recipient.profile',
                'lastMessageSent',
            ],
        });
    }
    save(conversation: Conversation): Promise<Conversation> {
        return this.conversationRepository.save(conversation);
    }

    getMessages({ id, limit }: GetConversationMessagesParams): Promise<Conversation> {
        return this.conversationRepository
            .createQueryBuilder('conversation')
            .where('id=:id', { id })
            .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
            .leftJoinAndSelect('conversation.messages', 'message')
            .where('conversation.id =  :id', { id })
            .orderBy('message.createdAt', 'DESC')
            .limit(limit)
            .getOne();
    }

    update({ id, lastMessageSent }: UpdateConversationParams) {
        return this.conversationRepository.update(id, { lastMessageSent });
    }


    async getConversations(id: number): Promise<Conversation[]> {

        return this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
            .leftJoinAndSelect('conversation.creator', 'creator')
            .leftJoinAndSelect('conversation.recipient', 'recipient')
            .where('creator.id=:id', { id })
            .orWhere('recipient.id = :id', { id })
            .orderBy('conversation.lastMessageSentAt', "DESC")
            .getMany();

    }
    async hassAccess({ id, userId }: AccessParams): Promise<boolean> {
        const conversation = await this.findById(id);
        if (!conversation) throw new ConversationNotFound();
        return (conversation.creator.id === userId || conversation.recipient.id === userId);
    }



}

