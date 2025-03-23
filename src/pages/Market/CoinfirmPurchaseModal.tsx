import React, { useState } from "react";
import { useBuyItemMutation } from "../../app/services/market/MarketServicer";
import MainButton from "../../components/MainButton";
import { toast } from "react-toastify";
import { useUserContext } from "../../UserContext";
import { IMarketItem, User } from "../../app/types";
import { useDispatch } from "react-redux";
import { saveTokens } from "../../features/authSlice"; // Импортируем saveTokens

interface Props {
  item: IMarketItem;
  isOpen: boolean;
  onClose: () => void;
  setRefresh?: (value: boolean) => void;
}

const ConfirmPurchaseModal: React.FC<Props> = ({
  item,
  isOpen,
  onClose,
  setRefresh,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUserContext();
  const dispatch = useDispatch(); // Инициализируем dispatch
  const [buyItem] = useBuyItemMutation();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (user) {
        await buyItem(Number(item.id));
        setRefresh && setRefresh(true);
        dispatch(saveTokens({
          accessToken: '', // Укажите токен, если он доступен
          user: {
            ...user,
            walletBalance: user.walletBalance - item.price,
          } as User
        })); // Обновляем состояние пользователя через Redux

        toast.success("Purchase successful!");
      } else {
        console.error("User is null");
      }
    } catch (error: any) {
      toast.error(error);
      console.log(error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed flex items-center justify-center h-screen w-screen z-50 top-[40px] bg-black/40">
      <div className="bg-[#17132B] p-8 rounded w-[600px] min-h-[290px] ">
        <h2 className="text-lg font-semibold mb-2">Confirm Purchase</h2>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-lg">
            Are you sure you want to buy the {item.item.name} for {item.price} KP?
          </p>
          <img src={item.item.image} alt="" className="h-28" />
        </div>

        <div className="flex items-center justify-end gap-4 mt-12">
          <button
            className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <div className="w-44">
            <MainButton
              text="Confirm"
              onClick={handleConfirm}
              loading={loading}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPurchaseModal;
