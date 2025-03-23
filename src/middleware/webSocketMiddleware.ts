import { Middleware } from '@reduxjs/toolkit';
import socket from '../socket'; // Импортируем socket для работы с WebSocket
import { setUser } from '../features/userSlice'; // Импортируем действие для обновления пользователя

const webSocketMiddleware: Middleware = (store) => (next) => (action) => {
    // Обработка получения данных о пользователе
    socket.on("userData", (data) => {
        store.dispatch(setUser(data)); // Обновляем состояние пользователя в Redux
    });

    // Обработка обновления данных о пользователе (например, баланс, уровень)
    socket.on("userUpdate", (data) => {
        store.dispatch(setUser(data)); // Обновляем состояние пользователя в Redux
    });

    // Обработка уведомлений о покупке
    socket.on("purchaseNotification", (data) => {
        console.log("Purchase notification received:", data);
        // Здесь можно добавить логику для обработки уведомления о покупке
    });

    return next(action); // Передаем действие дальше по цепочке
};

export default webSocketMiddleware;
