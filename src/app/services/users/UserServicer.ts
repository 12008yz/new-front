import { api } from '../../api';
import { User } from '../../types';

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => `/users/me`,
            providesTags: [{ type: 'User', id: 'CURRENT' }],
        }),
        getProfile: builder.query<User, string>({
            query: (id) => `/users/${id}`,
            providesTags: [{ type: 'Profile', id: 'LIST' }],
        }),
        getInventory: builder.query<any, { id: number; filters?: any }>({
            query: ({ id, filters }) => {
                let url = `/users/inventory/${id}?`; 
                if (filters) {
                    for (const key in filters) {
                        if (filters[key]) {
                            url += `${url.includes('?') ? '&' : '?'}${key}=${filters[key]}`;
                        }
                    }
                }
                return url;
            },
        }),
        fixItem: builder.mutation<{ success: boolean }, string>({
            query: (item) => ({
                url: `/users/fixedItem/`,
                method: 'PUT',
                body: { itemId: item },
            }),
        }),
        putFixDescription: builder.mutation<{ success: boolean }, string>({
            query: (description) => ({
                url: `/users/fixedItem/description`,
                method: 'PUT',
                body: { description },
            }),
        }),
        claimBonus: builder.mutation<{
            message: string;
            nextBonus: string;
            value: number;
        }, void>({
            query: () => ({
                url: `/users/claimBonus`,
                method: 'POST',
            }),
        }),
        updateProfilePicture: builder.mutation<{ success: boolean }, string>({
            query: (image) => ({
                url: `/users/profilePicture/`,
                method: 'PUT',
                body: { image },
            }),
        }),
        getNotifications: builder.query<any, number>({
            query: (page = 1) => `/users/notifications?page=${page}`,
        }),
        getTopPlayers: builder.query<any, void>({
            query: () => `/users/topPlayers`,
        }),
        getMyRanking: builder.query<any, void>({
            query: () => `/users/ranking`,
        }),
    }),
});

export const {
    useGetMeQuery,
    useGetProfileQuery,
    useGetInventoryQuery,
    useFixItemMutation,
    usePutFixDescriptionMutation,
    useClaimBonusMutation,
    useUpdateProfilePictureMutation,
    useGetNotificationsQuery,
    useGetTopPlayersQuery,
    useGetMyRankingQuery,
} = userApi;
