import { createSlice } from '@reduxjs/toolkit';
import { User } from '../app/types';
import { userApi } from '../app/services/users/UserServicer';
import { saveTokens } from './authSlice';
import { localStorageService } from '../utils/localStorage';

interface ProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    clearProfile(state) {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.getProfile.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(userApi.endpoints.getProfile.matchFulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        // Синхронизируем данные с authSlice
        const accessToken = localStorageService.getItem('accessToken');
        if (accessToken) {
          saveTokens({ accessToken, user: action.payload });
        }
      })
      .addMatcher(userApi.endpoints.getProfile.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке профиля';
      });
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;

// Селекторы
export const selectProfile = (state: { profile: ProfileState }) => state.profile.profile;
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.loading;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;

export default profileSlice.reducer;
