import { useClaimBonusMutation } from "../../app/services/users/UserServicer"; // Импортируйте хук для получения бонуса
import { toast } from "react-toastify"; // Импортируйте toast для уведомлений
import { useEffect, useState } from "react"; // Импортируйте необходимые хуки
import { useUserContext } from "../../UserContext"; // Импортируйте контекст пользователя
import MainButton from "../MainButton"; // Импортируйте кнопку
import Countdown from "../../components/Countdown"; // Импортируйте компонент обратного отсчета
import { User } from "../../app/types"; // Импортируйте тип User
import { useDispatch } from "react-redux"; // Импортируем useDispatch
import { saveTokens, updateUser } from "../../features/authSlice"; // Импортируем saveTokens

const ClaimBonus: React.FC<{ bonusDate: Date; userData: User }> = ({ bonusDate, userData }) => {
    const [bonusAvailable, setBonusAvailable] = useState(false);
    const [loadingBonus, setLoadingBonus] = useState(false);
    const dispatch = useDispatch(); // Инициализируем dispatch
    const [claimBonus] = useClaimBonusMutation(); // Используйте хук для получения бонуса

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (bonusDate) {
            const countdownDate = new Date(bonusDate).getTime();

            interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = countdownDate - now;

                if (distance <= 0) {
                    setBonusAvailable(true);
                    clearInterval(interval);
                }
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [bonusDate]);

    const handleClaimBonus = async () => {
        setLoadingBonus(true);
        try {
            const res = await claimBonus().unwrap(); // Вызов функции claimBonus
            setBonusAvailable(false); // Сбросить доступность бонуса
            toast.success("Бонус успешно получен!", {
                theme: "dark",
            });
            const updatedUser = {
                ...userData,
                nextBonus: new Date(res.nextBonus), 
                walletBalance: userData.walletBalance + res.value
            };
            
            dispatch(saveTokens({
                accessToken: localStorage.getItem('accessToken') || '',
                user: updatedUser
            }));
            
            dispatch(updateUser(updatedUser)); // Синхронизируем с localStorage
        } catch (error: any) {
            toast.error(`${error.data?.message || "Ошибка получения бонуса!"}`, {
                theme: "dark",
            });
        } finally {
            setLoadingBonus(false); // Сбросить состояние загрузки
        }
    };

    return (
        <MainButton
            text={bonusAvailable ? "Получить бонус" : <Countdown nextBonus={bonusDate} color={"#fff"} bold={false} />}
            onClick={handleClaimBonus}
            pulse={true}
            disabled={!bonusAvailable || loadingBonus} // Деактивировать кнопку, если бонус недоступен или идет загрузка
        />
    );
};

export default ClaimBonus;
