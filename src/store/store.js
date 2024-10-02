import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducer/authSlice";
import userReducer from "./reducer/userReducer";

const store = configureStore({
    reducer: {
        auth: authSlice,
        users: userReducer,

    }
})

export default store