import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../app/services/auth/auth';
import { User } from '../app/types';
import { localStorageService } from '../utils/localStorage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const loadInitialState = () => {
  const accessToken = localStorageService.getItem('accessToken');
  const refreshToken = localStorageService.getItem('refreshToken');
  const user = localStorageService.getJSON('user');
  
  return {
    accessToken,
    refreshToken,
    user,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveTokens(state, action: PayloadAction<{ accessToken: string; refreshToken?: string; user?: User }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || '';
      state.user = action.payload.user || null;
      
      localStorageService.setItem('accessToken', action.payload.accessToken);
      if (action.payload.user) {
        localStorageService.setJSON('user', action.payload.user);
      } else {
        localStorageService.removeItem('user');
      }
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorageService.setJSON('user', state.user);
      }
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      
      localStorageService.removeItem('accessToken');
      localStorageService.removeItem('refreshToken');
      localStorageService.removeItem('user');
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.accessToken = action.payload.token;
        state.loading = false;
        state.error = null;
        localStorageService.setItem('accessToken', action.payload.token);
      })
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state, action) => {
        state.user = action.payload || null;
        if (action.payload) {
          localStorageService.setJSON('user', action.payload);
        }
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { saveTokens, logout, setLoading, setError, updateUser } = authSlice.actions;

export const logoutAction = () => logout();

export const selectAuth = (state: { auth: AuthState }) => state.auth;

// Селекторы
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
