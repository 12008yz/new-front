import React, { useEffect, useState } from "react";
import Avatar from "../../Avatar";
import { FaRegBell, FaRegBellSlash } from "react-icons/fa";
import ClaimBonus from "../ClaimBonus";
import { IoMdExit } from "react-icons/io";
import { BiWallet } from "react-icons/bi";
import Monetary from "../../Monetary";
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction, updateUser } from "../../../features/authSlice";
import { useGetNotificationsQuery, useGetMeQuery } from '../../../app/services/users/UserServicer';
import Notifications from './Notitfications';
import { RootState } from '../../../app/store';
import { localStorageService } from "../../../utils/localStorage";

const RightContent = () => {
    const dispatch = useDispatch();
    
    // Получаем данные пользователя
    const { data: userMeData, isLoading: isMeLoading, error: userError } = useGetMeQuery();
    
    // Обновляем состояние пользователя в Redux, если данные загружены
    useEffect(() => {
        if (userMeData) {
            console.log("Обновление пользователя:", userMeData); // Лог для отладки
            dispatch(updateUser(userMeData));
        }
        if (userError) {
            console.error("Ошибка получения данных пользователя:", userError);
        }
    }, [userMeData, userError, dispatch]);
    
    // Получаем данные пользователя из Redux
    const user = useSelector((state: RootState) => state.user.user);
    
    // Состояния для уведомлений
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    
    // Получаем уведомления
    const { data: notifications = [] } = useGetNotificationsQuery(1);

    // Проверяем непрочитанные уведомления
    useEffect(() => {
        const unreadCount = notifications.filter((notification: { read: boolean }) => !notification.read).length;
        setHasUnreadNotifications(unreadCount > 0);
    }, [notifications]);

    // Обработка выхода
    const handleLogout = () => {
        dispatch(logoutAction());
    };

    return (
        <div className="flex items-center gap-4">
            {/* Бонус */}
            {user?.nextBonus && (
                <div className="hidden md:flex">
                    <ClaimBonus bonusDate={user.nextBonus} userData={user} />
                </div>
            )}

            {/* Основной контент */}
            {user && (
                <>
                    {/* Баланс */}
                    <div className="flex items-center gap-2 text-green-400 font-normal text-lg hover:text-green-300 transition-all">
                        <BiWallet className="text-2xl hidden md:block" />
                        <div className="max-w-[80px] md:max-w-[140px] overflow-hidden text-sm md:text-lg truncate">
                            <Monetary value={Math.floor(user.walletBalance)} />
                        </div>
                    </div>

                    {/* Уведомления */}
                    <div className="relative cursor-pointer" onClick={() => setOpenNotifications(!openNotifications)}>
                        {notifications ? (
                            <FaRegBellSlash style={{ fontSize: "20px" }} />
                        ) : (
                            <FaRegBell style={{ width: "20px" }} />
                        )}
                        {hasUnreadNotifications && !openNotifications && (
                            <div className="absolute -top-1 -right-[2px] w-3 h-3 bg-red-500 rounded-full" />
                        )}
                        <Notifications openNotifications={openNotifications} setOpenNotifications={setOpenNotifications} />
                    </div>

                    {/* Профиль пользователя */}
                    <div className="flex items-center gap-2">
                        <div>
                            <Avatar 
                                image={user.profilePicture} 
                                loading={isMeLoading} 
                                id={user.id} 
                                size="medium" 
                                level={user.level} 
                                showLevel={true} 
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{user.username}</span>
                        </div>
                    </div>
                </>
            )}

            {/* Выход */}
            <div
                className="text-[#625F7E] font-normal text-lg cursor-pointer hover:text-gray-200 transition-all"
                onClick={handleLogout}
            >
                <IoMdExit className="text-2xl" />
            </div>
        </div>
    );
}

export default RightContent;
