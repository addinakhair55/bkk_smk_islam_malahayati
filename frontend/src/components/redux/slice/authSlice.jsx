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

export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async ({ formData, token }, { rejectWithValue }) => {
      try {
        if (!token) {
          throw new Error("Token tidak tersedia.");
        }
        const response = await axios.put("http://localhost:5000/auth/profile", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Terjadi kesalahan.");
      }
    }
  );

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, role: null, loading: false, error: null, token: localStorage.getItem("token") || null, },
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
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
              })
              .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Terjadi kesalahan.";
              });
    },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;
