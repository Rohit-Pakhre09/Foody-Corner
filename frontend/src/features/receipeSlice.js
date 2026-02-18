import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../api/axios";

export const fetchUserReceipes = createAsyncThunk("receipe/fetchUserReceipes", async (_arg, { rejectWithValue }) => {
    try {
        const res = await API.get("/receipe/receipes");
        return res.data?.data || [];
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const fetchAdminReceipes = createAsyncThunk("receipe/fetchAdminReceipes", async (_arg, { rejectWithValue }) => {
    try {
        const res = await API.get("/receipe/receipes/admin");
        return res.data?.data || [];
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const createReceipe = createAsyncThunk("receipe/createReceipe", async (payload, { rejectWithValue }) => {
    try {
        const res = await API.post("/receipe", payload);
        return res.data?.data || null;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const updateReceipe = createAsyncThunk("receipe/updateReceipe", async ({ id, payload }, { rejectWithValue }) => {
    try {
        const res = await API.put(`/receipe/${id}`, payload);
        return res.data?.data || null;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const deleteReceipe = createAsyncThunk("receipe/deleteReceipe", async (id, { rejectWithValue }) => {
    try {
        await API.delete(`/receipe/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const receipeSlice = createSlice({
    name: "receipe",
    initialState: {
        userReceipes: [],
        allReceipes: [],
        loading: false,
        error: null
    },
    reducers: {
        clearReceipeError: (state) => {
            state.error = null;
        },
        resetReceipes: (state) => {
            state.userReceipes = [];
            state.allReceipes = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserReceipes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserReceipes.fulfilled, (state, action) => {
                state.loading = false;
                state.userReceipes = action.payload;
            })
            .addCase(fetchUserReceipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAdminReceipes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminReceipes.fulfilled, (state, action) => {
                state.loading = false;
                state.allReceipes = action.payload;
            })
            .addCase(fetchAdminReceipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createReceipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReceipe.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createReceipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateReceipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReceipe.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateReceipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteReceipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReceipe.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteReceipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearReceipeError, resetReceipes } = receipeSlice.actions;
export default receipeSlice.reducer;
