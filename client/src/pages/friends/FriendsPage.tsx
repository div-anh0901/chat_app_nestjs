import { useEffect ,useContext} from 'react';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { fetchFriendsThunk } from "../../store/friends/friendsThunk";
import { FriendList } from "../../components/friends/FriendsList";
import { SocketContext } from '../../utils/context/SocketContext';
import { Friend } from '../../utils/types';
import { removeFriend, setOfflineFriend, setOnlineFriend } from '../../store/friends/friendsSlice';


export const FriendsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const socket = useContext(SocketContext);
  
    useEffect(() => {
        socket.emit('getOnlineFriends');
        const interval = setInterval(() => {
            socket.emit('getOnlineFriends');
        }, 10000);

        socket.on('onFriendRemoved', (friend: Friend) => {
            dispatch(removeFriend(friend));
            socket.emit('getOnlineFriends');
        })


        return () => {
            clearInterval(interval);
            socket.off('getOnlineFriends');
            socket.off('onFriendRemoved');
        }
    }, []);


    useEffect(() => {
        socket.on('getOnlineFriends', (friends: Friend[]) => {
            dispatch(setOnlineFriend(friends));
            dispatch(setOfflineFriend())
        })
    },[])




    return (    
       <FriendList/>
    )
}