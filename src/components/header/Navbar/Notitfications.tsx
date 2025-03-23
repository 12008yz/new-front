import { useEffect, useRef } from 'react';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { RotatingLines } from 'react-loader-spinner';
import moment from 'moment';
import { useGetNotificationsQuery } from '../../../app/services/users/UserServicer'; // Импортируем новый хук

interface NotificationsProps {
    openNotifications: boolean;
    setOpenNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Notification {
    content: string;
    createdAt: string;
    read: boolean;
    title: string;
    type: 'friendRequest' | 'message' | 'alert';
}

const Notifications: React.FC<NotificationsProps> = ({ openNotifications, setOpenNotifications }) => {
    const notificationsRef = useRef(null);
    console.log("Состояние openNotifications:", openNotifications); // Логирование состояния
    const { data: notifications = [],} = useGetNotificationsQuery(1); // Получаем уведомления для первой страницы

    const handleCloseNotifications = () => {
        setOpenNotifications(false);
    };

    useOutsideClick(notificationsRef, handleCloseNotifications);

    return (
        <div className={`bg-[#19172d] rounded absolute z-50 top-1 md:right-10 w-full md:w-80 min-h-[400px] ${openNotifications ? 'flex flex-col' : 'hidden'}`} ref={notificationsRef}>
            {
            
               notifications.length > 0 ? (
                    notifications.map((notification: Notification, index: number) => (
                        <div key={index} className="flex flex-col p-4 border-b border-[#2a2942]">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-[#3c3b5c] rounded-full min-w-[32px] h-8 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c3c4d9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <p className="text-[#c3c4d9] text-sm font-bold">{notification.title}</p>
                                            <p className="text-[#c3c4d9] text-xs">{notification.content}</p>
                                        </div>
                                        <p className={`text-xs ${moment().diff(notification.createdAt, 'days') < 1 ? 'text-blue-500' : 'text-[#c3c4d9]'}`}>
                                            {moment(notification.createdAt).fromNow()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-96">
                        <p className="text-white">No notifications</p>
                    </div>
                )
            }
        </div>
    );
};

export default Notifications;