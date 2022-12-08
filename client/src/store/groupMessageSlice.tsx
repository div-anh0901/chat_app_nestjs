import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { deleteGroupMessage as deleteGroupMessageAPI, fetchMessageGroup,editGroupMessage as editGroupMessageAPI } from "../utils/api";
import { DeleteGroupMessageParams, EditMessagePayload, GroupMessage, GroupMessageEventPayload, GroupMessageType } from "../utils/types";


export interface GroupMessageState {
    messages: GroupMessage[]
};

const initialState: GroupMessageState = {
    messages:[]
}

export const deleteGroupMessageThunk = createAsyncThunk(
    'groupMessages/delete',
    (params: DeleteGroupMessageParams) => deleteGroupMessageAPI(params)
);


export const fetchGroupMessagesThunk = createAsyncThunk(
    'groupMessages/fetch',
    (id: number) => fetchMessageGroup(id)
);

export const editGroupMessageThunk = createAsyncThunk(
    'groupMessages/edit',
    (params: EditMessagePayload) => editGroupMessageAPI(params)
)

export const groupMessageSlice = createSlice({
    name: 'groupMessages',
    initialState,
    reducers: {
        addGroupMessage: (state, action: PayloadAction<GroupMessageEventPayload>) => {
            const { group, message } = action.payload;
            const groupMessage = state.messages.find((gm) => gm.id === group.id);
            groupMessage?.messages.unshift(message);
        },
        editGroupMessage: (state, action: PayloadAction<GroupMessageType>) => {
            const { payload } = action;
            const { id } = payload.group;
            const groupMessage = state.messages.find((gm) => gm.id === id);
            if (!groupMessage) return;
            const messageIndex = groupMessage.messages.findIndex((m) => m.id === payload.id);
            groupMessage.messages[messageIndex] = payload;
            console.log('Updated Message');
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGroupMessagesThunk.fulfilled, (state, action) => {
            const { id } = action.payload.data;
            const index = state.messages.findIndex(m => m.id === id);
            const exists = state.messages.find(m => m.id === id);
         
            exists
                ? (state.messages[index] = action.payload.data)
                : state.messages.push(action.payload.data);
            
        })
            .addCase(deleteGroupMessageThunk.fulfilled, (state, action) => {
                const {data} = action.payload;
                const groupMessages = state.messages.find((gm) => gm.id === data.groupId);
                if (!groupMessages) return;
                const messageIndex = groupMessages.messages.findIndex((m) => m.id === data.messageId);
                groupMessages?.messages.splice(messageIndex, 1);
            })
            .addCase(editGroupMessageThunk.fulfilled, (state, action) => {
                const { data: message } = action.payload;
                const { id } = message.group;
                const groupMessage = state.messages.find((gm) => gm.id === id);
                if (!groupMessage) return;
                const messageIndex = groupMessage.messages.findIndex((m) => m.id === message.id);
                groupMessage.messages[messageIndex] = message;
                console.log('Updated Message');
            })
    }
});


const selectGroupMessages = (state: RootState) => state.groupMessages.messages;
const selectGroupMessageId = (state: RootState, id: number) => id;

export const selectGroupMessage = createSelector([selectGroupMessages, selectGroupMessageId], (groupMessages, id) => groupMessages.find((gm) => gm.id === id));

export const { addGroupMessage ,editGroupMessage} = groupMessageSlice.actions;

export default groupMessageSlice.reducer;