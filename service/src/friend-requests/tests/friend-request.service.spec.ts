import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FriendsService } from 'src/friends/friends.service';
import { IUserService } from 'src/users/interfaces/user';
import { Services } from 'src/utils/constants';
import { Friend, FriendRequest } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { FriendRequestException } from '../exceptions/FriendRequest';
import { IFriendRequestService } from '../friend-requests';
import { FriendRequestService } from '../friend-requests.service';



describe('FriendRequestService', () => {
    let friendRequestService: IFriendRequestService;
    let userService: IUserService;
    let friendRepository: Repository<Friend>;
    let friendRequestRepository: Repository<FriendRequest>
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: Services.FRIENDS_SERVICE,
                    useClass: FriendsService
                },
                {
                    provide: Services.FRIEND_REQUESTS_SERVICE,
                    useClass: FriendRequestService
                },
                {
                    provide: Services.USERS,
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(Friend),
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(FriendRequest),
                    useValue: { find: jest.fn((x) => x), delete: jest.fn((x) => x) }
                }
            ]
        }).compile();
        userService = module.get<IUserService>(Services.USERS);
        friendRequestService = module.get<IFriendRequestService>(Services.FRIEND_REQUESTS_SERVICE);
        friendRepository = module.get(getRepositoryToken(Friend));
        friendRequestRepository = module.get(getRepositoryToken(FriendRequest));

    });

    it('should be defined', () => {
        expect(friendRequestService).toBeDefined();
        expect(userService).toBeDefined();
        expect(friendRepository).toBeDefined();
        expect(friendRequestRepository).toBeDefined();
    });
    it('should call getFriendRequest', async () => {
        await friendRequestService.getFriendRequests(20);
        expect(friendRepository.find).toHaveBeenCalledWith({
            where: [
                {
                    sender: { id: 20 },
                    status: 'pending'
                },
                {
                    receiver: { id: 20 },
                    status: 'pending'
                },

            ],
            relations: ['receiver', 'sender']
        });
    });

    describe('cancel friend Request', () => {
        const mockFriendRequest = { sender: { id: 50 } } as FriendRequest;

        it('cancel  friend request', () => {
            jest
                .spyOn(friendRequestService, 'findById')
                .mockImplementationOnce(() => Promise.resolve(mockFriendRequest));
            expect(
                friendRequestService.cancel({ id: 500, userId: 50 }),
            ).rejects.toThrow(FriendRequestException);
        });

        it('should not throw error and call friendRequestRepository.delete', async () => {
            jest
                .spyOn(friendRequestService, 'findById')
                .mockImplementationOnce(() => Promise.resolve(mockFriendRequest));
            await friendRequestService.cancel({ id: 321, userId: 50 });
            expect(friendRequestRepository.delete).toHaveBeenCalledWith(322);
        })
    })
});


