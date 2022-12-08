import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './conversationSlice';
import groupSliceReducer from './groupSlice';
import messageReducer from './messages/messageSlice';
import selectedSliceReducer from './selectedSlice';
import groupMessageReducer from './groupMessageSlice';
import messageContainerReducer from './messageContainerSlice';
import groupRecipientsSidebarReducer from './groupRecipientsSidebarSlice';
import friendsReducer from './friends/friendsSlice';
import rateLimitReducer from './rate-limit/rateLimitSlice';
import  messagePanelReducer from './message-panel/MessagePanelSlice';
import systemMessageReducer from './system-message/systemMessageSlice';
import settingReducer from './settings/settingSlice';
import  callReducer  from './call/callSlice';
export const store = configureStore({
    reducer: {
        conversation: conversationReducer,
        messages: messageReducer,
        selectedConversationType: selectedSliceReducer,
        groups: groupSliceReducer,
        friends: friendsReducer,
        rateLimit: rateLimitReducer,
        groupMessages: groupMessageReducer,
        messageContainer: messageContainerReducer,
        groupSidebar: groupRecipientsSidebarReducer,
        messagePanel: messagePanelReducer,
        systemMessages: systemMessageReducer,
        settings: settingReducer,
        call: callReducer
        
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;