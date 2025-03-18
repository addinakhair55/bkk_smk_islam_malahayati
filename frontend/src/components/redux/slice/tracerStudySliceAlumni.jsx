import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL API
const API_URL = 'http://localhost:5000/tracer-study';

export const fetchMyTracerStudy = createAsyncThunk(
  'alumni/fetchMyTracerStudy',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/my-tracer-study`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // Jangan dianggap error, cukup return null
      }
      return rejectWithValue(error.response?.data || 'Terjadi kesalahan.');
    }
  }
);

// Menambahkan data tracer study baru
export const createTracerStudyAlumni = createAsyncThunk(
  "alumni/createTracerStudy",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Terjadi kesalahan");
    }
  }
);

// Mengupdate data tracer study (untuk admin & alumni pemilik data)
export const updateTracerStudyAlumni = createAsyncThunk(
  "alumni/updateTracerStudy",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/my-tracer-study`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Terjadi kesalahan");
    }
  }
);

const tracerStudyAlumniSlice = createSlice({
  name: 'tracerStudyAlumni',
  initialState: {
    tracerStudy: {},
    loading: false,
    error: null,
    hasTracerStudy: false,
  },
  reducers: {
    setLoading: (state, action) => {
        state.loading = action.payload;
    }
},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTracerStudy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTracerStudy.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
            state.tracerStudy = action.payload;
            state.hasTracerStudy = true;
        } else {
            state.tracerStudy = {};
            state.hasTracerStudy = false;
        }
      })
      .addCase(fetchMyTracerStudy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Gagal memuat data tracer study.';
      })    

      // Create
      .addCase(createTracerStudyAlumni.pending, (state) => { state.loading = true; })
      .addCase(createTracerStudyAlumni.fulfilled, (state, action) => {
        state.loading = false;
        state.tracerStudy = action.payload; 
      })
      .addCase(createTracerStudyAlumni.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(updateTracerStudyAlumni.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTracerStudyAlumni.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTracerStudyAlumni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError, clearSuccess } = tracerStudyAlumniSlice.actions;
export default tracerStudyAlumniSlice.reducer;
