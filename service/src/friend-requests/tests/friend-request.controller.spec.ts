import { Test, TestingModule } from '@nestjs/testing';
import { Services } from 'src/utils/constants';
import { mockUser } from 'src/_mock_';
import { IFriendRequestService } from '../friend-requests';
import { FriendRequestController } from '../friend-requests.controller';



describe('FriendRequestController', () => {
    let controller: FriendRequestController;
    let friendRequestService: IFriendRequestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FriendRequestController],
            providers: [{
                provide: Services.FRIEND_REQUESTS_SERVICE,
                useValue: {
                    getFriendRequests: jest.fn((x) => x),
                    create: jest.fn((x) => x),
                }
            }]
        }).compile();

        controller = module.get<FriendRequestController>(FriendRequestController);
        friendRequestService = module.get<IFriendRequestService>(Services.FRIEND_REQUESTS_SERVICE);
        jest.clearAllMocks();
    });

    it("controller should be defined", () => {
        expect(controller).toBeDefined();
    });


    it('should call friendRequestService.getFriendRequest', async () => {
        await controller.getGriendRequests(mockUser);
        expect(friendRequestService.getFriendRequests).toHaveBeenCalled();
        expect(friendRequestService.getFriendRequests).toHaveBeenCalledWith(
            mockUser.id
        )
    });


    it('should call createFriendRequest with correct params', async () => {
        await controller.createFriendRequest(mockUser, {
            email: 'okela@gmail.com'
        });
        expect(friendRequestService.create).toHaveBeenCalledWith({
            user: mockUser,
            email: 'okela@gmail.com'
        })
    })
})