import { useEffect, useState } from "react";
import { useGetCaseQuery } from "../../app/services/cases/CaseServices";
import Title from "../../components/Title";
import Item from "../../components/Item";
import { useAppDispatch } from "../../app/hooks";
import { openBoxAndRefreshUser } from "../../features/gamesThunks";
import MainButton from "../../components/MainButton";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { BasicItem } from "../../app/types";
import QuantityButton from "../../components/QuantityButton";
import RouletteContainer from "./RouletteContainer";
import Monetary from '../../components/Monetary';
import { useDispatch, useSelector } from 'react-redux';
import { saveTokens } from '../../features/authSlice';

const CasePage = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [openedItems, setOpenedItems] = useState<BasicItem[]>([]);
  const [showPrize, setShowPrize] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [animationAux, setAnimationAux] = useState<boolean>(false);
  const [animationAux2, setAnimationAux2] = useState<boolean>(false);

  const id = window.location.pathname.split("/")[2];
  const { data: caseData, isLoading: loadingCase, error } = useGetCaseQuery(Number(id));

  useEffect(() => {
    if (error) {
      toast.error("Ошибка при получении данных о кейсе");
    }
    window.scrollTo(0, 0);
  }, [error]);

  const resetProps = () => {
    setShowPrize(false);
    setAnimationAux2(false);
    setAnimationAux(!animationAux);
    setTimeout(() => {
      setStarted(true);
    }, 500);
    setTimeout(() => {
      setStarted(false);
      setShowPrize(true);
    }, 7500);
    setTimeout(() => {
      setAnimationAux2(true);
      setLoadingButton(false);
    }, 8000);
  }

  const handleOpenCase = async () => {
    if (!caseData) {
        toast.error("Данные о кейсе недоступны!"); // Сообщение об ошибке
        return; // Прерываем выполнение функции, если caseData недоступен
    }

    const totalCost = caseData.price * quantity; // Общая стоимость открытия кейсов
    if (totalCost > user.walletBalance) {
        toast.error("Недостаточно средств для открытия кейса!"); // Сообщение об ошибке
        return; // Прерываем выполнение функции, если средств недостаточно
    }

    setLoadingButton(true); // Устанавливаем состояние загрузки
    try {
        const response = await dispatch(openBoxAndRefreshUser({ id: Number(id), quantity })).unwrap();
        setOpenedItems(response.items);
        const newBalance = user.walletBalance - totalCost; // Обновляем баланс
        const updatedUser = { ...user, walletBalance: newBalance };
        dispatch(saveTokens({ 
            accessToken: localStorage.getItem('accessToken') || '', 
            user: updatedUser 
        }));
        resetProps(); // Сброс состояния после открытия кейса
    } catch (error: any) {
        setLoadingButton(false);
        toast.error(`${error.data.message}!`, {
            theme: "dark",
        });
    }
};

  return (
    <div className="flex flex-col items-center w-screen min-h-screen bg-[#0f0e17]">
      <div className="flex flex-col items-center overflow-hidden md:max-w-[1920px] flex-grow">
        <h1 className="text-2xl color-[#e1dde9] font-bold py-7">
          {loadingCase ? <Skeleton width={200} height={30} /> : caseData ? caseData.title : "Кейс не найден"}
        </h1>

        <RouletteContainer 
          started={started}
          showPrize={showPrize}
          loading={loadingCase}
          data={caseData}
          openedItems={openedItems}
          animationAux={animationAux}
          animationAux2={animationAux2}
          quantity={quantity} hasSpinned={false}        />
        
        <div className={`flex flex-col md:flex-row justify-center items-center gap-4 w-68 mt-8 ${started ? "opacity-0" : "opacity-100"} transition-all`}>
          {loadingCase ? (
            <Skeleton width={240} height={40} />
          ) : (
            <div className="w-60 ml-0 md:ml-20">
              <MainButton
                text={<div className="flex items-center justify-center text-base">
                <span className="mr-1">Open case - </span>{<Monetary value={caseData?.price ? caseData.price * quantity : 0}/> }
                </div>}
                onClick={handleOpenCase}
                loading={loadingButton}
                disabled={loadingButton || (caseData && (caseData.price * quantity) > user.walletBalance)}
              />
            </div>
          )}
          {!loadingCase && (
            <QuantityButton quantity={quantity} setQuantity={setQuantity} disabled={started} />
          )}
        </div>

        <div className="flex flex-col md:p-8 gap-2 items-center ">
          <Title title="Items in this case" />
          <div className="flex flex-wrap gap-6 px-8 justify-center w-screen max-w-[1920px]">
            {loadingCase
              ? { array: Array(12).fill(0) }.array.map((_, i) => (
                <Skeleton
                  width={176}
                  height={216}
                  highlightColor="#161427"
                  baseColor="#1c1a31"
                  key={i}
                />
              ))
              : Array.isArray(caseData?.items) ? (
                caseData.items.map((item: any) => (
                  <Item item={item} key={item.name} />
                ))
              ) : (
                <div>Нет доступных предметов</div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasePage;
