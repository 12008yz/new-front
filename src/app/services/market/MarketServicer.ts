import { api } from '../../api';
import { IMarketItem } from '../../types'; // Импортируйте интерфейс IMarketItem

export const marketplaceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getItems: builder.query<{ totalPages: number; currentPage: number; items: IMarketItem[] }, { page: number; filters: any }>({
            query: ({ page, filters }) => {
                const { name, rarity, sortBy, order } = filters;
                return {
                    url: `/marketplace`,
                    params: {
                        page,
                        limit: 30,
                        name,
                        rarity,
                        sortBy,
                        order
                    }
                };
            },
        }),
        getItemListings: builder.query<IMarketItem, { itemId: number }>({
            query: ({ itemId }) => ({
                url: `/marketplace/item/${itemId}`,
            }),
        }),
        sellItem: builder.mutation<{ success: boolean }, { item: IMarketItem; price: number }>({
            query: ({ item, price }) => {
                if (!item?.uniqueId) {
                    throw new Error('UniqueId is required');
                }
                console.log('Отправка данных на продажу:', { uniqueId: item.uniqueId, price });
                return {
                    url: `/marketplace/`,
                    method: 'POST',
                    body: { uniqueId: item.uniqueId, price },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                };
            },
        }),
        buyItem: builder.mutation<{ success: boolean; newBalance: number }, number>({
            query: (id) => ({
                url: `/marketplace/buy/${id}`,
                method: 'POST',
            }),
        }),
        removeListing: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/marketplace/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Экспортируйте хуки для использования в компонентах
export const {
    useGetItemsQuery,
    useGetItemListingsQuery,
    useSellItemMutation,
    useBuyItemMutation,
    useRemoveListingMutation,
} = marketplaceApi;
