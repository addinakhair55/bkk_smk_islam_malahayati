import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUser = createAsyncThunk("auth/getUser", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get("http://localhost:5000/auth/profile", config);

        if (!response.data || !response.data._id) {
            return rejectWithValue({ message: "Data pengguna tidak valid!" });
        }

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Gagal mengambil data pengguna!" });
    }
});


export const loginUser = createAsyncThunk("auth/loginUser", async (data, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:5000/auth/login", data);
        localStorage.setItem("token", response.data.token);
        dispatch(getUser()); // Fetch user details
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, role: null, loading: false, error: null },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.role = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.role = action.payload.role || "guest";
            })            
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;
