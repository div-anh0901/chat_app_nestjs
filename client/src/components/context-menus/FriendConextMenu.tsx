import { IoIosArchive, IoMdExit } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useContext } from 'react';
import { AppDispatch, RootState } from "../../store";
import { ContextMenu, ContextMenuItem } from "../../utils/styles";
import { SocketContext } from "../../utils/context/SocketContext";
import { toggleContextMenu } from "../../store/friends/friendsSlice";
import { removeFriendThunk } from "../../store/friends/friendsThunk";
import { useNavigate } from "react-router";
import { AuthContext } from "../../utils/context/AuthContext";
import { checkConversationOrCreate } from "../../utils/api";


export const FriendContextMenu = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {points,selectedFriendContextMenu } = useSelector((state: RootState) => state.friends);
    const navigate = useNavigate();
    const { user} = useContext(AuthContext);
    const socket = useContext(SocketContext);

    const getUserFriendInstance = ()=>{
      return  user?.id === selectedFriendContextMenu?.sender.id
            ? selectedFriendContextMenu?.receiver
            : selectedFriendContextMenu?.sender;
    }

    const removeFriend = () => {
        if (!selectedFriendContextMenu) return;
        dispatch(toggleContextMenu(false));
       dispatch(removeFriendThunk(selectedFriendContextMenu.id)).then(() =>
            socket.emit('getOnlineFriends')
        );
    };

    const sendMessage = () => {
        const recipient = getUserFriendInstance();
        recipient && checkConversationOrCreate(recipient.id)
            .then(({ data }) => navigate(`/conversations/${data.id}`))
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <ContextMenu top={points.y} left={points.x}>
            <ContextMenuItem onClick={removeFriend} >
                <IoMdExit size={20} color="#ff0000" />
                <span style={{ color: '#ff0000' }}>Remove Friend</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={sendMessage} >
                <IoIosArchive size={20} color="#fff"  />
                <span style={{ color: '#fff' }}>Message</span>
            </ContextMenuItem>
        </ContextMenu>
    )
}