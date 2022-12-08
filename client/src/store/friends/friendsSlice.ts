import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend, FriendRequest, Points } from "../../utils/types";
import { acceptFriendRequestThunk, cancelFriendRequestThunk, createFriendRequestThunk, fetchFriendRequestThunk, fetchFriendsThunk, rejectFriendRequestThunk, removeFriendThunk } from "./friendsThunk";

export interface FriendsState{
    friends: Friend[],
    friendRequests: FriendRequest[],
    onlineFriends: Friend[],
    offlineFriends: Friend[],
    showContextMenu: boolean,
    selectedFriendContextMenu?: Friend,
    points: Points
}

const initialState: FriendsState={
    friends: [],
    friendRequests: [],
    onlineFriends: [],
    offlineFriends: [],
    showContextMenu:false,
    points:{x:0,y:0}
}

const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        addFriendRequest: (state, action: PayloadAction<FriendRequest>) => {
            state.friendRequests.push(action.payload)
        },
        removeFriendRequest: (state, action: PayloadAction<FriendRequest>) => {
            const { id } = action.payload;
            state.friendRequests = state.friendRequests.filter(friendRequest => friendRequest.id !== id);
        },
        setOnlineFriend: (state, action: PayloadAction<Friend[]>) => {
            state.onlineFriends = action.payload;
        },
        setOfflineFriend: (state) => {
            state.offlineFriends = state.friends.filter(friend => !state.onlineFriends.find(onlineFriend => onlineFriend.id === friend.id));
        },
        toggleContextMenu: (state, action:PayloadAction<boolean>) => {
            state.showContextMenu = action.payload;
        },
        setSelectedFriend: (state, action: PayloadAction<Friend>) => {
            state.selectedFriendContextMenu = action.payload;
        },
        setContextMenuLocation: (state, action: PayloadAction<Points>) => {
            state.points = action.payload;
        },
        removeFriend: (state, action: PayloadAction<Friend>) => {
            state.friends = state.friends.filter(friend => friend.id !== action.payload.id);
        }

    },
    extraReducers: (builder) =>
        builder.addCase(fetchFriendsThunk.fulfilled, (state, action) => {
            state.friends = action.payload.data;
        })
            .addCase(fetchFriendRequestThunk.fulfilled, (state, action) => {
                state.friendRequests = action.payload.data;
            })
            .addCase(createFriendRequestThunk.fulfilled, (state, action) => {
                state.friendRequests.push(action.payload.data);
            })
            .addCase(createFriendRequestThunk.rejected, (state, action) => {
                console.log(createFriendRequestThunk.rejected)
            })
            .addCase(cancelFriendRequestThunk.fulfilled, (state, action) => {
                const { id } = action.payload.data;
                state.friendRequests = state.friendRequests.filter(friendRequest => friendRequest.id !== id);
            })
            .addCase(acceptFriendRequestThunk.fulfilled, (state, action) => {
                const { friend, friendRequest: { id } } = action.payload.data;
                state.friendRequests = state.friendRequests.filter((friendRequest => friendRequest.id !== id));
            })
            .addCase(rejectFriendRequestThunk.fulfilled, (state, action) => {
                const { id } = action.payload.data;
                state.friendRequests = state.friendRequests.filter(friendRequest=>  friendRequest.id  !== id)
            })
            .addCase(removeFriendThunk.fulfilled, (state, action) => {
                state.friends = state.friends.filter(friend => friend.id !== action.payload.data.id);
            })
});



export const {
    removeFriend,
    setContextMenuLocation,
    setSelectedFriend,
    toggleContextMenu,
    addFriendRequest,
    removeFriendRequest,
    setOnlineFriend,
    setOfflineFriend
} = friendsSlice.actions;

export default friendsSlice.reducer;
