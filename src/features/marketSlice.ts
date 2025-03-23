import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { marketplaceApi } from '../app/services/market/MarketServicer'; 
import { IMarketItem } from '../app/types';
import { userApi } from '../app/services/users/UserServicer'; // Импортируем userApi
import { updateUser } from './authSlice'; // Импортируем действие updateUser

const marketSlice = createSlice({
    name: 'market',
    initialState: {
        items: [] as IMarketItem[], // Массив рыночных предметов
        selectedItem: null as IMarketItem | null, // Выбранный предмет
        loading: false, // Статус загрузки
        error: null as string | null, // Ошибка, если есть
    },
    reducers: {
        setItems(state, action: PayloadAction<IMarketItem[]>) {
            state.items = action.payload;
        },
        setSelectedItem(state, action: PayloadAction<IMarketItem | null>) {
            state.selectedItem = action.payload;
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
        .addMatcher(marketplaceApi.endpoints.getItems.matchFulfilled, (state, action) => {
            state.items = action.payload.items; // Успешное получение предметов
            state.loading = false;
            state.error = null;
        })
            .addMatcher(marketplaceApi.endpoints.getItems.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null; // Обработка ошибки
            })
            .addMatcher(marketplaceApi.endpoints.buyItem.matchFulfilled, (state, action) => {
                // Обработка успешной покупки предмета
                state.loading = false;
                state.error = null;

                console.log("Покупка успешна, обновляем данные пользователя");
                // Обновляем данные пользователя после успешной покупки
                userApi.endpoints.getMe.initiate(); // Запрос для получения актуальных данных о пользователе
            })
            .addMatcher(marketplaceApi.endpoints.buyItem.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null; // Обработка ошибки
            })
            .addMatcher(marketplaceApi.endpoints.sellItem.matchFulfilled, (state, action) => {
                // Обработка успешной продажи предмета
                state.loading = false;
                state.error = null;

                console.log("Продажа успешна, обновляем данные пользователя");
                // Обновляем данные пользователя после успешной продажи
                userApi.endpoints.getMe.initiate(); // Запрос для получения актуальных данных о пользователе
            })
            .addMatcher(marketplaceApi.endpoints.sellItem.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null; // Обработка ошибки
            })
            .addMatcher(marketplaceApi.endpoints.removeListing.matchFulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            
            .addMatcher(marketplaceApi.endpoints.removeListing.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null; // Обработка ошибки
            });
    }
});

// Экспортируйте действия
export const { setItems, setSelectedItem, setLoading, setError } = marketSlice.actions;

// Экспортируйте редюсер
export default marketSlice.reducer;

// Используйте уже существующие хуки из marketplaceApi
export const {
    useGetItemsQuery,
    useGetItemListingsQuery,
    useSellItemMutation,
    useBuyItemMutation,
    useRemoveListingMutation,
} = marketplaceApi;
