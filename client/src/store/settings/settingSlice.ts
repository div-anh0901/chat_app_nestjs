import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectableTheme } from "../../utils/types";


export interface SettingsState{
    theme: SelectableTheme;
}

const initialState: SettingsState = {
    theme:'dark'
}

export const settingSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<SelectableTheme>) => {
            state.theme = action.payload;
        }
    }
});


export const { setTheme } = settingSlice.actions;

export default settingSlice.reducer;