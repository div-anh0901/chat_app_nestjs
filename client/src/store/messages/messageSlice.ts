import {  createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { ConversationMessage, DeleteMessageResponse, MessageEventPayload, MessageType } from "../../utils/types";
import { deleteMessageThunk, editMessageThunk, fetchMessagesThunk } from "./messageThunk";

export interface MessagesState {
    messages: ConversationMessage[];
    loading: boolean;
}

const initialState: MessagesState = {
    messages: [],
    loading: false,
};


const selectConversationMessages = (state: RootState) =>
    state.messages.messages;
const selectConversationMessageId = (state: RootState, id: number) => id;
export const selectConversationMessage = createSelector(
    [selectConversationMessages, selectConversationMessageId],
    (conversationMessage, id) => conversationMessage.find((cm) => cm.id === id));

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state,action: PayloadAction<MessageEventPayload>) => { 
            const { conversation, message } = action.payload;
            console.log(conversation);
            console.log(message);
            const conversationMessage = state.messages.find(
                (cm) => cm.id === conversation.id
            );
            conversationMessage?.messages.unshift(message);
        },
        deleteMessage: (state, action: PayloadAction<DeleteMessageResponse>) => {
            const { payload } = action;
            const conversationMessage = state.messages.find((cm) => cm.id === payload.conversationId);
            if (!conversationMessage) return;

            const messageIndex = conversationMessage.messages.findIndex((m) => m.id === payload.messageId);
            conversationMessage.messages.splice(messageIndex, 1);
        },
        editMessage: (state, action: PayloadAction<MessageType>) => {
            const message = action.payload;

            const conversationMessage = state.messages.find((cm) => cm.id === message.conversation.id);
            if (!conversationMessage) return;
            const messageIndex = conversationMessage.messages.findIndex((m) => m.id === message.id);
            conversationMessage.messages[messageIndex] = message;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
                const { id, messages } = action.payload.data;
                const index = state.messages.findIndex((cm) => cm.id === id);
                const exists = state.messages.find((cm) => cm.id === id);
                if (exists) {
                    state.messages[index] = action.payload.data;
                } else {
                    state.messages.push(action.payload.data);
                }
            })
            .addCase(deleteMessageThunk.fulfilled, (state, action) => {
                const { data } = action.payload;
                const conversationMessage = state.messages.find((cm) => cm.id === data.conversationId);
                if (!conversationMessage) return;
                const messageIndex = conversationMessage.messages.findIndex((m) => m.id === data.messageId);
                conversationMessage?.messages.splice(messageIndex, 1);
            })
            .addCase(editMessageThunk.fulfilled, (state, action) => {
                const { data: message } = action.payload;
                const { id } = message.conversation;
                const conversationMessage = state.messages.find((cm) => cm.id === id);
                if (!conversationMessage) return;
                const messageIndex = conversationMessage.messages.findIndex(
                    (m) => m.id === message.id
                );
                conversationMessage.messages[messageIndex] = message;
            })
    },
});


export const { addMessage, deleteMessage,editMessage } = messagesSlice.actions;

export default messagesSlice.reducer;