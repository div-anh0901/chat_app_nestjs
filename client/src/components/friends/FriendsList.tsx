import { useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { setContextMenuLocation, setSelectedFriend, toggleContextMenu } from "../../store/friends/friendsSlice";
import { FriendListContainer } from "../../utils/styles/friends";
import { ContextMenuEvent, Friend } from "../../utils/types";
import { FriendContextMenu } from "../context-menus/FriendConextMenu";
import { FriendsListItem } from "./FriendsListItem";


export const FriendList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {showContextMenu,friends,onlineFriends,offlineFriends} = useSelector((state: RootState) => state.friends);
    
    const onContextMenu = (e: ContextMenuEvent, friend: Friend)=>{
        e.preventDefault();
        dispatch(toggleContextMenu(true));
        dispatch(setContextMenuLocation({ x: e.pageX, y: e.pageY }));
        dispatch(setSelectedFriend(friend));
    }

    useEffect(() => {
        const handleClick = () => dispatch(toggleContextMenu(false));
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    },[])

    return (
        <FriendListContainer>
            {onlineFriends.length > 0 && <span>Online ({onlineFriends.length})</span>}
            {onlineFriends.map((friend) => (
                <FriendsListItem
                    key={friend.id}
                    friend={friend}
                    onContextMenu={onContextMenu}
                    online={true}
                />
            ))}
            <span>Offline </span>
            {friends
                .filter(
                    (friend) =>
                        !onlineFriends.find((onlineFriend) => onlineFriend.id === friend.id)
                )
                .map((friend) => (
                    <FriendsListItem
                        key={friend.id}
                        friend={friend}
                        onContextMenu={onContextMenu}
                        online={false}
                    />
                ))}
            {showContextMenu && <FriendContextMenu />}
        </FriendListContainer>
    )

}