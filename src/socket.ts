import { io } from 'socket.io-client';
import store from './app/store';
import {
  updateCoinFlipGameState,
  setCoinFlipResult,
  startCoinFlipGame,
  updateUserData,
} from './features/gamesSlice';

// Подключение к серверу WebSocket
const socket = io('http://localhost:3000', {
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

socket.on('coinFlip:result', (result) => {
  store.dispatch(setCoinFlipResult(result));
});

socket.on('coinFlip:start', () => {
  store.dispatch(startCoinFlipGame());
});

socket.on('userDataUpdated', (userData) => {
  store.dispatch(updateUserData(userData));
});

// Функции для управления сокетом
export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

// Функции для взаимодействия с игрой
export const placeCoinFlipBet = (user: any, bet: number, choice: number) => {
  socket.emit('coinFlip:bet', user, bet, choice);
};

export const makeCoinFlipChoice = (user: any, choice: number) => {
  socket.emit('coinFlip:choice', user, choice);
};

export default socket;