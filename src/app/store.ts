import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api'; 
import authReducer from '../features/authSlice';
import casesReducer from '../features/casesSlice';
import marketReducer from '../features/marketSlice';
import gamesReducer from '../features/gamesSlice';
import userReducer from '../features/userSlice';
import profileReducer from '../features/profileSlice';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    cases: casesReducer,
    games: gamesReducer,
    market: marketReducer,
    user: userReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Добавьте API middleware
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
setupListeners(store.dispatch); // Настройка слушателей для автоматического обновления

export default store;