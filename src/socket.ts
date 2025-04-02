import { io } from 'socket.io-client';
import store from './app/store';
import {
  updateCoinFlipGameState,
  setCoinFlipResult,
  startCoinFlipGame,
  updateUserData,
  placeBet,
  makeChoice,
  setGameResults,
} from './features/gamesSlice';

// Подключение к серверу WebSocket
const socket = io('http://localhost:3000', { 
  // Добавим логирование при каждом подключении
  transports: ['websocket'], // Используем только WebSocket
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

// Обработчики событий подключения
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

// Обработчики событий игры "Монетка"
socket.on('coinFlip:gameState', (gameState) => {
  store.dispatch(updateCoinFlipGameState(gameState));
});

socket.on('coinFlip:start', () => {
  store.dispatch(startCoinFlipGame()); // Начинаем игру
  console.log(`Игра началась! Время: ${new Date().toLocaleTimeString()}`);  
});

socket.on('coinFlip:result', (result) => {
  console.log(`Игра закончилась! Время: ${new Date().toLocaleTimeString()}`, result);
  store.dispatch(setCoinFlipResult(result)); // Обновляем результат броска монеты
});

  socket.on('userDataUpdated', (userData) => {
      console.log("Received user data update:", userData); // Логирование обновленных данных пользователя
  store.dispatch(updateUserData(userData)); // Обновляем данные пользователя
});

// Функции для управления сокетом
export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

socket.on('coinFlip:bet', ({ userId, bet, choice }: { userId: number; bet: number; choice: number }) => {
  console.log(`Ставка от пользователя ${userId}: K₽${bet} на ${choice === 0 ? "Heads" : "Tails"} в ${new Date().toLocaleTimeString()}`);
  store.dispatch(placeBet({ userId, bet, choice })); // Обновляем состояние ставок
});

socket.on('coinFlip:choice', ({ userId, choice }: { userId: number; choice: number }) => {
  store.dispatch(makeChoice({ userId, choice })); // Обновляем состояние выбора
});

socket.on('caseOpened', (data) => {
  // Обновление состояния выпавших предметов
  store.dispatch(setGameResults({ success: true, items: data.winningItems }));
});

// Экспортируем сокет для использования в других частях приложения
export default socket;
