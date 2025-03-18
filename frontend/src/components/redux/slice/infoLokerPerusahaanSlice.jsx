import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getToken = () => localStorage.getItem("token");

  export const fetchInfoLokerPerusahaan = createAsyncThunk(
    "infoLokerPerusahaan/fetchInfoLokerPerusahaan",
    async (_, { rejectWithValue }) => {
      try {
        const token = getToken();

        if (!token) throw new Error("Token tidak ditemukan!");

        const response = await axios.get("http://localhost:5000/info-lowongan-kerja/my-lowongan", {
          headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );

  export const fetchInfoLokerPerusahaanById = createAsyncThunk(
    "infoLokerPerusahaan/fetchInfoLokerPerusahaanById",
    async (id, { rejectWithValue }) => {
      try {
        const token = getToken();
  
        if (!token) throw new Error("Token tidak ditemukan!");
  
        const response = await axios.get(
          `http://localhost:5000/info-lowongan-kerja/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );
  
  
  export const createInfoLokerPerusahaan = createAsyncThunk(
    "infoLokerPerusahaan/createInfoLokerPerusahaan",
    async ({ formData, userId }) => {
      const token = getToken();
      
      formData.append("createBy", userId);

      const response = await axios.post(
        "http://localhost:5000/info-lowongan-kerja",
        formData,
        { 
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          } 
        }
      );
      return response.data;
    }
  );

  
  export const updateInfoLokerPerusahaan = createAsyncThunk(
    "infoLokerPerusahaan/updateInfoLokerPerusahaan",
    async ({ id, formData, userId }, { rejectWithValue }) => {
      try {
        const token = getToken();
        formData.append("updateBy", userId);
  
        const response = await axios.put(
          `http://localhost:5000/info-lowongan-kerja/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );
  
  export const deleteInfoLokerPerusahaan = createAsyncThunk(
    "infoLokerPerusahaan/deleteInfoLokerPerusahaan",
    async (id, { rejectWithValue }) => {
      try {
        const token = getToken();
        await axios.delete(`http://localhost:5000/info-lowongan-kerja/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return id;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );
  
// Initial state
const initialState = {
  infoLokerPerusahaan: [],
  status: "idle",
  loading: false,
  error: null,
};

const infoLokerPerusahaanSlice = createSlice({
  name: "infoLokerPerusahaan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfoLokerPerusahaan.pending, (state) => {
          state.loading = true;
          state.error = null;
      })
      .addCase(fetchInfoLokerPerusahaan.fulfilled, (state, action) => {
        state.loading = false;
        state.infoLokerPerusahaan = action.payload;
      })
      .addCase(fetchInfoLokerPerusahaan.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      })
      .addCase(fetchInfoLokerPerusahaanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfoLokerPerusahaanById.fulfilled, (state, action) => {
          state.loading = false;
          state.infoLokerPerusahaan = action.payload;
      })
      .addCase(fetchInfoLokerPerusahaanById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      })    
      .addCase(createInfoLokerPerusahaan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInfoLokerPerusahaan.fulfilled, (state, action) => {
        state.loading = false;
        state.infoLokerPerusahaan.push(action.payload);
      })
      .addCase(createInfoLokerPerusahaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      .addCase(updateInfoLokerPerusahaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteInfoLokerPerusahaan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(deleteInfoLokerPerusahaan.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        if (Array.isArray(state.infoLokerPerusahaan)) {
          state.infoLokerPerusahaan = state.infoLokerPerusahaan.filter(
            item => item._id !== action.payload
          );
        } else {
          state.infoLokerPerusahaan = [];
        }
      })
      .addCase(deleteInfoLokerPerusahaan.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default infoLokerPerusahaanSlice.reducer;
