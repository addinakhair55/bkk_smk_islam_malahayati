import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks

// eslint-disable-next-line react-refresh/only-export-components
const API = axios.create({
  baseURL: 'http://localhost:5000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTracerStudy = createAsyncThunk(
  'tracerStudy/fetchTracerStudy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/tracer-study');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tracer studies');
    }
  }
);


export const fetchTracerStudyDetail = createAsyncThunk(
  'tracerStudy/fetchTracerStudyDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/tracer-study/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tracer study detail');
    }
  }
);

export const createTracerStudy = createAsyncThunk(
  'tracerStudy/createTracerStudy',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post('/tracer-study', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while creating the tracer study');
    }
  }
);

export const deleteTracerStudy = createAsyncThunk(
  'tracerStudy/deleteTracerStudy',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/tracer-study/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete tracer study');
    }
  }
);

export const updateTracerStudy = createAsyncThunk(
  'tracerStudy/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.put(
        `/tracer-study/${id}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const updateStatus = createAsyncThunk(
  'tracerStudy/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await API.patch(`/tracer-study/${id}/status`, { status });
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update tracer study status');
    }
  }
);

// Slice
const tracerStudySlice = createSlice({
  name: 'tracerStudy',
  initialState: {
    tracerStudy: [],
    loading: false,
    tracerStudyDetail: {},
    data: null,
    error: null,
  },
  reducers: {clearError: (state) => {
    state.error = null;
  },},
  extraReducers: (builder) => {
    // Fetch tracer study data
    builder.addCase(fetchTracerStudy.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTracerStudy.fulfilled, (state, action) => {
      state.loading = false;
      state.tracerStudy = Array.isArray(action.payload) ? action.payload : []; // Pastikan selalu array
      state.error = null;
    });    
    builder.addCase(fetchTracerStudy.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Error fetching tracer study data.';
    });

    // Fetch tracer study detail
    builder.addCase(fetchTracerStudyDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTracerStudyDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.tracerStudyDetail = action.payload;
    });
    builder.addCase(fetchTracerStudyDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Error fetching tracer study detail.';
    });

    // Create tracer study
    builder.addCase(createTracerStudy.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTracerStudy.fulfilled, (state, action) => {
      state.loading = false;
      if (Array.isArray(state.tracerStudy)) {
        state.tracerStudy.push(action.payload);
      } else {
        state.tracerStudy = [action.payload];
      }
    });
    
    builder.addCase(createTracerStudy.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create tracer study data.';
    });

    // Update tracer study
    builder.addCase(updateTracerStudy.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTracerStudy.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(updateTracerStudy.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update status
    builder.addCase(updateStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateStatus.fulfilled, (state, action) => {
      state.loading = false;
      const { id, status } = action.payload;
      const index = state.tracerStudy.findIndex((item) => item._id === id);
      if (index !== -1) {
        state.tracerStudy[index].status = status;
      }
    });
    builder.addCase(updateStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update status.';
    });

    // Delete tracer study
    builder.addCase(deleteTracerStudy.fulfilled, (state, action) => {
      state.tracerStudy = state.tracerStudy.filter((item) => item._id !== action.payload);
    });
  },
});
export const { clearError } = tracerStudySlice.actions;
export default tracerStudySlice.reducer;
