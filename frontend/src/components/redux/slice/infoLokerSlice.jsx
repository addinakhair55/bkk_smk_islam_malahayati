import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getToken = () => localStorage.getItem('token');

export const fetchInfoLoker = createAsyncThunk(
  'infoLoker/fetchInfoLoker',
  async () => {
    const response = await axios.get('http://localhost:5000/info-lowongan-kerja', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  }
);

export const fetchInfoLokerById = createAsyncThunk(
    "infoLoker/fetchInfoLokerById",
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


export const createInfoLoker = createAsyncThunk(
  'infoLoker/createInfoLoker',
  async (formDataToSend) => {
    const response = await axios.post('http://localhost:5000/info-lowongan-kerja', formDataToSend, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getToken()}` 
      }
    });
    return response.data;
  }
);

 export const deleteInfoLoker = createAsyncThunk(
    "nfoLoker/deleteInfoLoker",
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

export const updateInfoLoker = createAsyncThunk(
  'infoLoker/updateInfoLoker',
  async ({ id, updatedData }) => {
      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, value]) => {
          if (value !== null) {
              formData.append(key, value);
          }
      });

      const response = await axios.put(
        `http://localhost:5000/info-lowongan-kerja/${id}`,
        updatedData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${getToken()}`
            },
        }
    );    
      return { id, updatedData: response.data };
  }
);

const initialState = {
  infoLoker: [],
  status: 'idle',
  error: null,
  loading: false,
};

// Slice for infoLoker
const infoLokerSlice = createSlice({
  name: 'infoLoker',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Info Loker
      .addCase(fetchInfoLoker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfoLoker.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.infoLoker = Array.isArray(action.payload) ? action.payload : [action.payload];
      })  
      .addCase(fetchInfoLoker.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
      })

      // byId

      .addCase(fetchInfoLokerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfoLokerById.fulfilled, (state, action) => {
          state.loading = false;
          state.infoLoker = action.payload;
      })
      .addCase(fetchInfoLokerById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      })    
      
      // Create
      .addCase(createInfoLoker.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createInfoLoker.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.infoLoker.push(action.payload);
      })
      .addCase(createInfoLoker.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Delete Info Loker actions
     .addCase(deleteInfoLoker.pending, (state) => {
             state.loading = true;
             state.error = null;
             state.status = "loading";
           })
      .addCase(deleteInfoLoker.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        if (Array.isArray(state.infoLoker)) {
          state.infoLoker = state.infoLoker.filter(
            item => item._id !== action.payload
          );
        } else {
          state.infoLoker = [];
        }
      })
      .addCase(deleteInfoLoker.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Update Info Loker actions
      .addCase(updateInfoLoker.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateInfoLoker.fulfilled, (state, action) => {
          state.status = 'succeeded';
          if (Array.isArray(state.infoLoker)) {
            const index = state.infoLoker.findIndex(loker => loker.id === action.payload.id);
            if (index !== -1) {
                state.infoLoker[index] = action.payload;
            }
        }
        
      })
      .addCase(updateInfoLoker.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
      });
  },
});

export default infoLokerSlice.reducer;