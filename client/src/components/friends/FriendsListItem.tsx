import { ContextMenuEvent, Friend } from "../../utils/types"
import {FC,useContext}from 'react'
import { AuthContext } from "../../utils/context/AuthContext"
import { FriendListItemContainer } from "../../utils/styles/friends"
import { UserAvatar } from "../users/UserAvatar"


type Props = {
    friend: Friend,
    online: boolean,
    onContextMenu: (e: ContextMenuEvent, friend: Friend) => void;
}

export const FriendsListItem: FC<Props> = ({ friend, online,onContextMenu}) => {
    const { user} = useContext(AuthContext);

    const friendUserInstance = user?.id === friend.sender.id ? friend.receiver : friend.sender;
    
    return (
        <FriendListItemContainer onContextMenu={(e)=> onContextMenu(e,friend)} online={true}>
           <UserAvatar user={friendUserInstance}/>
            <div className="friendDetails">
                <span className="username" >
                    {friendUserInstance.username}
                </span>
                {online && (
                    <span className="status">
                        {friendUserInstance.presence?.statusMessage}
                    </span>
                )}
            </div>
        </FriendListItemContainer>
    )
}