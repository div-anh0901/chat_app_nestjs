
import { CreateMessageParams, DeleteMessageParams, EditMessagePayload } from "../../utils/types";
import { createMessage as createMessageAPI, deleteMessage as deleteMessageAPI, editMessage as editMessageAPI, getConversationMessages } from "../../utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const fetchMessagesThunk = createAsyncThunk(
    'messages/fetch',
    async (id: number) => {
        return getConversationMessages(id);
    }
);

export const deleteMessageThunk = createAsyncThunk(
    'message/delete',
    (params: DeleteMessageParams) => {
        return deleteMessageAPI(params);
    }
)

export const editMessageThunk = createAsyncThunk(
    'message/edit',
    (params: EditMessagePayload) => {
        return editMessageAPI(params)
    }
)

export const createMessageThunk = createAsyncThunk(
    'message/create',
    async (params: CreateMessageParams, thunkAPI) => {
            try {
                const response = await createMessageAPI(params);
                return thunkAPI.fulfillWithValue(response);
            } catch (error) {
                return thunkAPI.fulfillWithValue(error);
            }
    } 
)