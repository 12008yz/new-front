import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userApi } from '../app/services/users/UserServicer'; 
import { authApi } from '../app/services/auth/auth'; 
import { User } from '../app/types'; 

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        loading: false,
        error: null as string | null,
    },
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearUser(state) {
            state.user = null;
            state.error = null;
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        // Auth actions
        builder
            .addMatcher(userApi.endpoints.getMe.matchFulfilled, (state, action) => {
                console.log("Данные пользователя из getMe:", action.payload); // Лог для отладки
                state.user = action.payload || null;
                state.loading = false;
                state.error = null;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
                state.user = action.payload || null;
                state.loading = false;
                state.error = null;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            });

        // User actions
        builder
            .addMatcher(userApi.endpoints.getInventory.matchFulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addMatcher(userApi.endpoints.getInventory.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addMatcher(userApi.endpoints.claimBonus.matchFulfilled, (state, action) => {
                if (state.user) {
                    state.user.walletBalance += action.payload.value;
                    state.user.nextBonus = action.payload.nextBonus;
                    state.user = { ...state.user };
                }
                state.loading = false;
                state.error = null;
            })
            .addMatcher(userApi.endpoints.claimBonus.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addMatcher(userApi.endpoints.updateProfilePicture.matchFulfilled, (state) => {
                // Профиль обновляется через getMe, поэтому здесь просто сбрасываем состояние
                state.loading = false;
                state.error = null;
            })
            .addMatcher(userApi.endpoints.updateProfilePicture.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            });
    }
});

export const { setUser, setLoading, setError, clearUser } = userSlice.actions;
export default userSlice.reducer;

export const {
    useGetMeQuery,
    useGetInventoryQuery,
    useFixItemMutation,
    usePutFixDescriptionMutation,
    useClaimBonusMutation,
    useUpdateProfilePictureMutation,
    useGetNotificationsQuery,
    useGetTopPlayersQuery,
    useGetMyRankingQuery,
} = userApi;