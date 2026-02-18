import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"
import receipeReducer from "../features/receipeSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        receipe: receipeReducer
    }
});
