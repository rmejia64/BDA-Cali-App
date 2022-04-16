import { createSlice } from '@reduxjs/toolkit';

export const pickupsSlice = createSlice({
    name: 'pickups',
    initialState: {
        pickups: {},
    },
    reducers: {},
});

export default pickupsSlice.reducer;
