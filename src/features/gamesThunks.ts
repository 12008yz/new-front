import { createAsyncThunk } from '@reduxjs/toolkit';
import { gamesApi } from '../app/services/games/GamesServices';
import { userApi } from '../app/services/users/UserServicer';
import { updateUser } from './authSlice';

export const openBoxAndRefreshUser = createAsyncThunk(
  'games/openBoxAndRefreshUser',
  async (params: { id: number; quantity?: number }, { dispatch }) => {
    const result = await dispatch(gamesApi.endpoints.openBox.initiate(params)).unwrap();
    const userData = await dispatch(userApi.endpoints.getMe.initiate()).unwrap();
    dispatch(updateUser(userData));
    return result;
  }
);
