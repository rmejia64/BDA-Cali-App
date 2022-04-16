import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        email: '',
        firstName: '',
        lastName1: '',
        lastName2: '',
        type: '',
    },
    reducers: {
        updateUser: (state, action) => {
            state.email = action.payload.email;
            state.firstName = action.payload.firstName;
            state.lastName1 = action.payload.lastName1;
            state.lastName2 = action.payload.lastName2;
            state.type = action.payload.type;
        },
    },
});

export const { updateUser } = userSlice.actions;

export const getUserType = (state) => state.user.type;

export default userSlice.reducer;
