import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchPerusahaan = createAsyncThunk(
  'perusahaan/fetchPerusahaan',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/mou-perusahaan');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Terjadi kesalahan saat mengambil data perusahaan.');
    }
  }
);


export const createMouPerusahaan = createAsyncThunk('perusahaan/createMouPerusahaan', async (data) => {
  const response = await axios.post('http://localhost:5000/mou-perusahaan', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Token auth
    },
  });
  return response.data;
});


export const fetchMouDetailById = createAsyncThunk('perusahaan/fetchMouDetailById', async (id) => {
  const response = await axios.get(`http://localhost:5000/mou-perusahaan/${id}`);
  return response.data;
});

export const updateMouPerusahaan = createAsyncThunk(
  'perusahaan/updateMouPerusahaan',
  async ({ id, formData }, { rejectWithValue }) => {
      try {
          const response = await axios.patch(`http://localhost:5000/mou-perusahaan/${id}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
          });

          console.log("Response from API:", response.data);
          return response.data; // Pastikan server mengembalikan data yang diperbarui
      } catch (error) {
          return rejectWithValue(error.response?.data || 'Gagal memperbarui MoU.');
      }
  }
);

// Slice
const perusahaanSlice = createSlice({
  name: 'perusahaan',
  initialState: {
    perusahaan: [],
    loading: false,
    error: null,
    toast: { show: false, type: '', message: '' }
  },
  reducers: {
    updatePerusahaanStatus: (state, action) => {
      const { id, newStatus } = action.payload;
      const company = state.perusahaan.find((company) => company._id === id);
      if (company) company.status = newStatus;
    },
    deletePerusahaan: (state, action) => {
      state.perusahaan = state.perusahaan.filter((company) => company._id !== action.payload);
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Perusahaan
      .addCase(fetchPerusahaan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerusahaan.fulfilled, (state, action) => {
        state.perusahaan = action.payload;
        state.loading = false;
      })
      .addCase(fetchPerusahaan.rejected, (state) => {
        state.loading = false;
        state.error = 'Terjadi kesalahan saat mengambil data perusahaan.';
      })

      // Create Mou Perusahaan
      .addCase(createMouPerusahaan.pending, (state) => {
        state.loading = true;
        // state.error = null;
      })
      .addCase(createMouPerusahaan.fulfilled, (state, action) => {
        state.perusahaan.push(action.payload);
        state.loading = false;
      })
      .addCase(createMouPerusahaan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Mou Detail
      .addCase(fetchMouDetailById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMouDetailById.fulfilled, (state, action) => {
        state.mouDetail = action.payload;
        state.loading = false;
      })
      .addCase(fetchMouDetailById.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch MoU details';
      })

      // Update Mou Data
      .addCase(updateMouPerusahaan.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMouPerusahaan.fulfilled, (state, action) => {
        console.log("Updated Data:", action.payload);
        state.perusahaan = state.perusahaan.map((company) =>
            company._id === action.payload._id ? { ...company, ...action.payload } : company
        );
        state.loading = false;
      })    
      .addCase(updateMouPerusahaan.rejected, (state) => {
        state.loading = false;
        state.error = 'Terjadi kesalahan saat memperbarui data MoU.';
      });
  },
});

// Actions
export const { updatePerusahaanStatus, deletePerusahaan } = perusahaanSlice.actions;

// Reducer
export default perusahaanSlice.reducer;
