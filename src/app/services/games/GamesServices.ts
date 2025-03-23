import { api } from '../../api';

export const gamesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        openBox: builder.mutation<{ success: boolean; items: any[] }, { id: number; quantity?: number }>({
            query: ({ id, quantity }) => ({
                url: `/game/openCase/${id}`,
                method: 'POST',
                body: { quantity: quantity || 1 },
            }),
        }),
        upgradeItem: builder.mutation<{ success: boolean; upgradedItem: any }, { selectedItemIds: number[]; targetItemId: number }>({
            query: ({ selectedItemIds, targetItemId }) => ({
                url: `/game/upgrade/`,
                method: 'POST',
                body: { selectedItemIds, targetItemId },
            }),
        }),
        spinSlots: builder.mutation<{ success: boolean; result: any }, number>({
            query: (betAmount) => ({
                url: `/game/slots/`,
                method: 'POST',
                body: { betAmount },
            }),
        }),
    }),
});

// Экспортируйте хуки для использования в компонентах
export const {
    useOpenBoxMutation,
    useUpgradeItemMutation,
    useSpinSlotsMutation,
} = gamesApi;