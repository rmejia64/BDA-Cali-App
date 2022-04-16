import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './User';

export default configureStore({
    reducer: {
        user: usersReducer,
    },
});
