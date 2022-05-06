import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        data: null,
        drivers: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload[0];
            state.data = action.payload[1];
        },
        setDrivers: (state, action) => {
            state.drivers = action.payload;
        },
    },
});

export const { setUser, setDrivers } = userSlice.actions;

export default userSlice.reducer;
