import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../api/axios";

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_arg, { rejectWithValue }) => {
    try {
        const res = await API.get("/auth/me");
        return res.data?.user || null;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const res = await API.post("/auth/register", userData);
        return res.data?.user || null;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
    try {
        const res = await API.post("/auth/login", userData);
        return res.data?.user || null;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const logout = createAsyncThunk("auth/logout", async (_arg, { rejectWithValue }) => {
    try {
        await API.post("/auth/logout");
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        authChecked: false,
        loading: false,
        error: null
    },
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.authChecked = true;
                state.user = action.payload;
                state.isAuthenticated = Boolean(action.payload);
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.authChecked = true;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = Boolean(action.payload);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = Boolean(action.payload);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.authChecked = true;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
