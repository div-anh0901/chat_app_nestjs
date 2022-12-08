import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { useEffect} from 'react';
import { fetchFriendRequestThunk } from "../../store/friends/friendsThunk";
import { FriendList } from "../../components/friends/FriendsList";
import { FriendRequestList } from "../../components/friends/FriendRequestList";


export const FriendRequestPage = () => {
    const dipatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dipatch(fetchFriendRequestThunk());
    }, []);

    return (
        <>
            <FriendRequestList/>
        </>
    )
}