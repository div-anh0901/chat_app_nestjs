
import { Peer} from 'peerjs';
import {useContext,useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';
import { CallsSidebar } from '../../components/sidebars/calls/CallSidebar';
import { AppDispatch } from '../../store';
import { fetchFriendsThunk } from '../../store/friends/friendsThunk';
import { AuthContext } from '../../utils/context/AuthContext';
export const CallsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(fetchFriendsThunk());
    },[])

    return (
        <>   
            <CallsSidebar />
            <Outlet/>
        </>
    )
    
}