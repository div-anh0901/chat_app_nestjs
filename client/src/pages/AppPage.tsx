import { Outlet, useNavigate } from "react-router"
import { UserSidebar } from "../components/sidebars/UserSidebar"
import { LayoutPage } from "../utils/styles"
import { useContext,useEffect } from 'react'
import { SocketContext } from "../utils/context/SocketContext"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"
import { AccepteVideoCallPayload, AcceptFriendRequestResponse, FriendRequest, SelectableTheme, VideoCallPayload } from "../utils/types"
import { addFriendRequest, removeFriendRequest } from "../store/friends/friendsSlice"
import { useToast } from "../utils/hook/useToast"
import { IoMdPersonAdd } from "react-icons/io"
import { BsFillPersonCheckFill } from 'react-icons/bs';
import { fetchFriendsThunk } from "../store/friends/friendsThunk"
import { ThemeProvider } from "styled-components"
import { DarkTheme, LightTheme } from "../utils/themes"
import { AuthContext } from "../utils/context/AuthContext"
import Peer from "peerjs"
import { setCall, setCaller, setConnection, setIsReceivingCall, setLocalStream, setPeer, setRemoteStream } from "../store/call/callSlice"
import { CallReceiveDialog } from "../components/calls/CallReceiveDialog"

export const AppPage = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { info } = useToast({ theme: 'dark' });
    const storageTheme = localStorage.getItem('theme') as SelectableTheme;
    const { theme } = useSelector((state: RootState) => state.settings);
    const { peer, call, isReceivingCall, caller, connection } = useSelector(
        (state: RootState) => state.call
    );
    useEffect(() => {
        dispatch(fetchFriendsThunk());
    }, [dispatch]);

    // useEffect(() => {
    //     if (!user) return;
    //     const newPeer = new Peer(user.peer.id);
    //     dispatch(setPeer(newPeer))
    // },[]);



    useEffect(() => {
        socket.on('onFriendRequestReceived', (payload: FriendRequest) => {
            dispatch(addFriendRequest(payload));
            info(`Incoming Friend Request from ${payload.sender.firstName}`, {
                position: 'bottom-left',
                icon: IoMdPersonAdd,
                onClick: () => navigate('/friends/requests')
            })
        });

        socket.on('onFriendRequestCancelled', (payload: FriendRequest) => {
            dispatch(removeFriendRequest(payload));
        });
        
        socket.on('onFriendRequestRejected', (payload: FriendRequest) => {
            dispatch(removeFriendRequest(payload));
        });

        socket.on('onFriendRequestAccepted', (payload: AcceptFriendRequestResponse) => {
            dispatch(removeFriendRequest(payload.friendRequest));
            socket.emit('getOnlineFriends');
            info(`${payload.friendRequest.receiver.firstName} accepted your friend request`, {
                position: 'bottom-left',
                icon: BsFillPersonCheckFill,
                onClick: () => navigate('/friends/requests')
            })
        });
        // socket.on('onVideoCall', (data: VideoCallPayload) => {
        //     if (isReceivingCall) return;
        //     dispatch(setCaller(data.caller));
        //     dispatch(setIsReceivingCall(true));
        // })

        return () => {
            //socket.removeAllListeners();
            socket.off('onFriendRequestReceived');
            socket.off('onFriendRequestCancelled');
            socket.off('onFriendRequestRejected');
            socket.off('onFriendRequestAccepted');
         //   socket.off('onVideoCall');
        };
   // }, [socket, isReceivingCall]);
    }, [socket]);

    // useEffect(() => {
    //     if (!peer) return;
    //     peer.on('call', (incomingCall) => {
    //         navigator.mediaDevices.getUserMedia({
    //             video: true,
    //             audio: true
    //         }).
    //             then((stream) => {
    //                 incomingCall.answer(stream);
    //                 dispatch(setLocalStream(stream));
    //                 dispatch(setCall(incomingCall));
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             })
    //     })
    // }, [peer, call, dispatch]);

    // useEffect(() => {
    //     if (!call) return;
    //     call.on('stream', (remoteStream) => {
    //         dispatch(setRemoteStream(remoteStream))
    //     })
    // }, [call]);

    // useEffect(() => {
    //     socket.on('onVideoCallAccept', (data: AccepteVideoCallPayload) => {
    //         if (!peer) return;
    //         if (data.caller.id === user!.id) {
    //             const conversation = peer.connect(data.acceptor.peer.id);
    //             dispatch(setConnection(conversation));
    //             navigator.mediaDevices.getUserMedia({
    //                 video: true,
    //                 audio: true
    //             })
    //                 .then((stream) => {
    //                     const newCall = peer.call(data.acceptor.peer.id, stream);
    //                     dispatch(setCall(newCall));
    //                 }).catch((err) => {
    //                     console.log(err);
    //                 })
    //         }
            
    //     });
    //     return () => {
    //         socket.off('onVideoCallAccept');
    //     };
    // }, [peer]);

    // useEffect(() => {
    //     if (connection) {
    //         connection.on('open', () => {
    //             console.log('connection was opened');
    //         });
    //         connection.on('error', () => {
    //             console.log('an error has occured');
    //         });
    //         connection.on('data', (data) => {
    //             console.log('data received', data);
    //         });
    //     }
    //     return () => {
    //         connection?.off('open');
    //         connection?.off('error');
    //         connection?.off('data');
    //     };
    // }, [connection])



    return (
        <ThemeProvider
            theme={
                storageTheme
                    ? storageTheme === 'dark'
                        ? DarkTheme
                        : LightTheme
                    : theme === 'dark'
                        ? DarkTheme
                        : LightTheme
            }
        >
         {/* {isReceivingCall && caller && <CallReceiveDialog/>} */}
            <LayoutPage>
                <UserSidebar />
                <Outlet />
            </LayoutPage>
            </ThemeProvider>
    )   
}