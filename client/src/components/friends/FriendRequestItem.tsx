import { FriendRequest, HandleFriendRequestAction } from "../../utils/types"
import { FC,useContext} from 'react';
import { AuthContext } from "../../utils/context/AuthContext";
import { FriendListContainer, FriendRequestItemContainer, FriendRequestItemIcon } from "../../utils/styles/friends";
import { MdCheck, MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { acceptFriendRequestThunk, cancelFriendRequestThunk, rejectFriendRequestThunk } from "../../store/friends/friendsThunk";
import { UserAvatar } from "../users/UserAvatar";

type Props = {
    friendRequest: FriendRequest
}

export const FriendRequestItem: FC<Props> = ({ friendRequest }) => {
    const { user } = useContext(AuthContext);
    const friendUserInstance = user?.id === friendRequest.sender.id ? friendRequest.receiver : friendRequest.sender;

    const ICON_SIZE = 24;
    const isIncomingRequest = () => user?.id === friendRequest.receiver.id;
    const dispatch = useDispatch<AppDispatch>();
    const handleFriendRequest = (type?: HandleFriendRequestAction) => {
     
        switch (type) {
            case 'accept':
                return dispatch(acceptFriendRequestThunk(friendRequest.id));
            case 'reject':
                return dispatch(rejectFriendRequestThunk(friendRequest.id));
            default: {
                return dispatch(cancelFriendRequestThunk(friendRequest.id));
            }

        }
    }


    return (
        <FriendRequestItemContainer>
            <div className="user" >
                <UserAvatar user={friendUserInstance} />
                <div className="name">
                  
                    {isIncomingRequest() ? (
                        <>
                            <span>{`${friendRequest.sender.firstName} ${friendRequest.sender.lastName}`}</span>
                            <span className="status" >Incoming Friend Request</span>
                        </>
                   
                    ) : (
                        <>
                            <span>{`${friendRequest.receiver.firstName} ${friendRequest.receiver.lastName}`}</span>
                            <span className="status" >Outgoing  Friend Request</span>
                        </>
                    )}
                </div>
            </div>
            <div className="icons" >
                {isIncomingRequest() && (<FriendRequestItemIcon
                    isAccept={true}
                    onClick={()=>handleFriendRequest('accept')}
                >
                    <MdCheck size={ICON_SIZE} />
                </FriendRequestItemIcon>)}
                <FriendRequestItemIcon
                    onClick={() => isIncomingRequest() ? handleFriendRequest('reject') :handleFriendRequest()}
                >
                    <MdClose size={ICON_SIZE} />
                </FriendRequestItemIcon>
            </div>
        </FriendRequestItemContainer>
    )
}
