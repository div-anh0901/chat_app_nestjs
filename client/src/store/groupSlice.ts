import { createAsyncThunk, createSelector, createSlice,PayloadAction } from "@reduxjs/toolkit";
import { group } from "console";
import { RootState } from ".";
import {
    createGroup as createGroupAPI,
    fetchGroups as fetchGroupsAPI,
    leaveGroup as leaveGroupAPI,
    removeGroupRecipient as removeGroupRecipientAPI,
    updateGroupOwner as updateGroupOwnerAPI
} from "../utils/api";
import  {CreateGroupParams, Group,Points, RemoveGroupRecipientParams, UpdateGroupOwnerParams} from '../utils/types'
export interface GroupState {
    groups: Group[];
    showGroupContextMenu: boolean;
    selectedGroupContextMenu?: Group;
    points: Points;
}

const initialState: GroupState = {
    groups: [],
    showGroupContextMenu: false,
    points: { x: 0, y: 0 },
    
}


export const fetchGroupsThunk = createAsyncThunk(
    'groups/fetch',
    () => {
        return fetchGroupsAPI();
    }
)

export const createGroupThunk = createAsyncThunk(
    'groups/create',
    (params: CreateGroupParams) => {
        return createGroupAPI(params);
    }
)

export const leaveGroupThunk = createAsyncThunk(
    'groups/leave',
    (id: number) => {
        leaveGroupAPI(id);
    }
)

export const removeGroupRecipientThunk = createAsyncThunk(
    'groups/recipient/delete',
    (params: RemoveGroupRecipientParams) => removeGroupRecipientAPI(params)
)

export const updateGroupOwnerThunk = createAsyncThunk(
    'group/owner/update',
    (params: UpdateGroupOwnerParams) => updateGroupOwnerAPI(params)
)

export const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        addGroup: (state, action: PayloadAction<Group>) => {
            state.groups.unshift(action.payload);
        },
        updateGroup: (state, action: PayloadAction<Group>) => {
            const updateGroup = action.payload;
            const existingGroup = state.groups.find((g) => g.id === updateGroup.id);
            const index = state.groups.findIndex((g) => g.id === updateGroup.id);
            if (existingGroup) {
                state.groups[index] = updateGroup;
            }
        },
        removeGroup: (state, action: PayloadAction<Group>) => {
            const group = state.groups.find((g) => g.id === action.payload.id);
            const index = state.groups.findIndex((g) => g.id === action.payload.id);

            if (!group) return;
            state.groups.splice(index, 1);
        },
        toggleContextMenu: (state, action: PayloadAction<boolean>) => {
            state.showGroupContextMenu = action.payload;
        },
        setSelectedGroup: (state, action: PayloadAction<Group>) => {
            state.selectedGroupContextMenu = action.payload;
        },
        setContextMenuLocation: (state, action: PayloadAction<Points>) => {
            state.points = action.payload;
        },

        

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroupsThunk.fulfilled, (state, action) => {
                state.groups = action.payload.data;
            })
            .addCase(removeGroupRecipientThunk.fulfilled, (state, action) => {
                const { data: updateGroup } = action.payload;
                const existingGroup = state.groups.find(
                    (g) => g.id === updateGroup.id
                );
                const index = state.groups.findIndex(g => g.id === updateGroup.id);
                if (existingGroup) {
                    state.groups[index] = updateGroup;
                }
            })
            .addCase(updateGroupOwnerThunk.fulfilled, (state, action) => {
                console.log('updateGroupOwnerThunk.fulfilled');
            })
            .addCase(leaveGroupThunk.fulfilled, (state, action) => {
                console.log('leaveGroupThunk.fulfilled')
            })
       
    },
});

const selectGroups = (state: RootState) => state.groups.groups;
const selectGroupId = (state: RootState, id: number) => id;

export const selectGroupById = createSelector(
    [selectGroups, selectGroupId],
    (groups, groupId) => groups.find((g) => g.id === groupId)
)
export const { addGroup, updateGroup, removeGroup, toggleContextMenu, setSelectedGroup, setContextMenuLocation } = groupsSlice.actions;

export default groupsSlice.reducer;