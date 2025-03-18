// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../slice/authSlice'
import infoLokerReducer from '../slice/infoLokerSlice';
import tracerStudyReducer from '../slice/tracerStudySlice';
import perusahaanReducer from '../slice/mouPerusahaanSlice';
import tracerStudyAlumniReducer from '../slice/tracerStudySliceAlumni';
import infoLokerPerusahaanReducer from '../slice/infoLokerPerusahaanSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    infoLoker: infoLokerReducer,
    infoLokerPerusahaan: infoLokerPerusahaanReducer,
    tracerStudy: tracerStudyReducer,
    perusahaan: perusahaanReducer,
    tracerStudyAlumni: tracerStudyAlumniReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['perusahaan/updateMouData/fulfilled'],
        ignoredPaths: ['payload.formData.dokumen_mou'],
      },
    }),
});
