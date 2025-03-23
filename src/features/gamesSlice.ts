import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { gamesApi } from '../app/services/games/GamesServices';
import { userApi } from '../app/services/users/UserServicer';
import { BasicItem } from '../app/types';

interface OpenBoxResult {
  success: boolean;
  items: BasicItem[];
}

interface CoinFlipState {
  bets: {
    heads: Record<string, number>;
    tails: Record<string, number>;
  };
  choices: {
    heads: Record<string, number>;
    tails: Record<string, number>;
  };
  result: number | null;
  gameState: {
    heads: {
      players: Record<string, any>;
      bets: Record<string, number>;
      choices: Record<string, number>;
    };
    tails: {
      players: Record<string, any>;
      bets: Record<string, number>;
      choices: Record<string, number>;
    };
  };
  history: Array<{ result: number }>;
  isGameStarted: boolean;
}

interface User {
  id: string;
  walletBalance: number;
}

interface GamesState {
  loading: boolean;
  error: string | null;
  gameResults: OpenBoxResult | null;
  selectedItem: BasicItem | null;
  coinFlip: CoinFlipState;
  users: Record<string, User>;
}

const initialState: GamesState = {
  loading: false,
  error: null,
  gameResults: null,
  selectedItem: null,
  users: {},
  coinFlip: {
    bets: {
      heads: {},
      tails: {},
    },
    choices: {
      heads: {},
      tails: {},
    },
    result: null,
    gameState: {
      heads: {
        players: {},
        bets: {},
        choices: {},
      },
      tails: {
        players: {},
        bets: {},
        choices: {},
      },
    },
    history: [],
    isGameStarted: false,
  },
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setGameResults(state, action) {
      state.gameResults = action.payload;
    },
    setSelectedItem(state, action) {
      state.selectedItem = action.payload;
    },
    clearGameResults(state) {
      state.gameResults = null;
    },
    clearSelectedItem(state) {
      state.selectedItem = null;
    },
    placeBet(state, action: PayloadAction<{ userId: string; bet: number; choice: number }>) {
      const { userId, bet, choice } = action.payload;
      const betType = choice === 0 ? 'heads' : 'tails';
      state.coinFlip.bets[betType][userId] = bet;
      
      // Обновление баланса пользователя
      const user = state.users[userId];
      if (user) {
        user.walletBalance -= bet;
      }
    },
    makeChoice(state, action: PayloadAction<{ userId: string; choice: number }>) {
      const { userId, choice } = action.payload;
      const choiceType = choice === 0 ? 'heads' : 'tails';
      state.coinFlip.choices[choiceType][userId] = choice;
      
      // Логирование выбора
      console.log(`User ${userId} chose ${choiceType}`);
    },
    setCoinFlipResult(state, action: PayloadAction<number>) {
      state.coinFlip.result = action.payload;
    },
    updateCoinFlipGameState(
      state,
      action: PayloadAction<{
        heads: {
          players: Record<string, any>;
          bets: Record<string, number>;
          choices: Record<string, number>;
        };
        tails: {
          players: Record<string, any>;
          bets: Record<string, number>;
          choices: Record<string, number>;
        };
      }>
    ) {
      state.coinFlip.gameState = action.payload;
    },
    startCoinFlipGame(state) {
      state.coinFlip.isGameStarted = true;
    },
    resetCoinFlipGame(state) {
      state.coinFlip = {
        bets: {
          heads: {},
          tails: {},
        },
        choices: {
          heads: {},
          tails: {},
        },
        result: null,
        gameState: {
          heads: {
            players: {},
            bets: {},
            choices: {},
          },
          tails: {
            players: {},
            bets: {},
            choices: {},
          },
        },
        history: [],
        isGameStarted: false,
      };
    },
    updateUserData(state, action: PayloadAction<{ userId: string; walletBalance: number }>) {
      const { userId, walletBalance } = action.payload;
      const user = state.users[userId];
      if (user) {
        user.walletBalance = walletBalance;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(gamesApi.endpoints.openBox.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(gamesApi.endpoints.openBox.matchFulfilled, (state, action) => {
        state.gameResults = action.payload;
        state.loading = false;
        state.error = null;
        // Обновление данных пользователя после успешного открытия коробки
        userApi.endpoints.getMe.initiate();
      })
      .addMatcher(gamesApi.endpoints.openBox.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to open box';
      })
      .addMatcher(gamesApi.endpoints.upgradeItem.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(gamesApi.endpoints.upgradeItem.matchFulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Обновление данных пользователя после успешного улучшения предмета
        userApi.endpoints.getMe.initiate();
      })
      .addMatcher(gamesApi.endpoints.upgradeItem.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upgrade item';
      })
      .addMatcher(gamesApi.endpoints.spinSlots.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(gamesApi.endpoints.spinSlots.matchFulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Обновление данных пользователя после успешного вращения слотов
        userApi.endpoints.getMe.initiate();
      })
      .addMatcher(gamesApi.endpoints.spinSlots.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to spin slots';
      });
  },
});

export const { 
  setLoading, 
  setError, 
  setGameResults, 
  setSelectedItem,
  clearGameResults,
  clearSelectedItem,
  placeBet,
  makeChoice,
  setCoinFlipResult,
  updateCoinFlipGameState,
  startCoinFlipGame,
  resetCoinFlipGame,
  updateUserData
} = gamesSlice.actions;

// Селекторы
export const selectGameResults = (state: { games: GamesState }) => state.games.gameResults;
export const selectSelectedItem = (state: { games: GamesState }) => state.games.selectedItem;
export const selectGamesLoading = (state: { games: GamesState }) => state.games.loading;
export const selectGamesError = (state: { games: GamesState }) => state.games.error;
export const selectCoinFlipState = (state: { games: GamesState }) => state.games.coinFlip;

export default gamesSlice.reducer;

export const {
  useOpenBoxMutation,
  useUpgradeItemMutation,
  useSpinSlotsMutation,
} = gamesApi;