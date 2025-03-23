import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate


import MainButton from "../../components/MainButton";
import { toast } from "react-toastify"; // Импортируем toast

import { useSelector } from "react-redux";
import { RootState } from "../../app/store"; // Adjust the import based on your store setup
import { Link } from "react-router-dom";
import { IMarketItem } from "../../app/types";
import { useBuyItemMutation } from "../../app/services/market/MarketServicer"; // Импортируем хук buyItem
import { useGetProfileQuery } from "../../app/services/users/UserServicer"; // Импортируем хук для получения профиля

interface Props {
  item: IMarketItem;
}

const MarketItem: React.FC<Props> = ({ item }) => {
  const user = useSelector((state: RootState) => state.user.user); // Access the user object directly
  const [loading, setLoading] = useState<boolean>(true);
  const [buyItem] = useBuyItemMutation(); // Инициализируем мутацию buyItem

  const { data: sellerProfile } = useGetProfileQuery(String(item.sellerId)); // Получаем профиль продавца, передавая sellerId как строку

  const handleImageLoad = () => {
    setLoading(false);
  };

  const isFromLoggedUser = user && user.id === item.sellerId; // Check if user exists before accessing id

  const navigate = useNavigate(); // Инициализируем useNavigate


  const handleBuy = async () => {
    // Логика покупки

    try {
      await buyItem(item.id).unwrap(); // Используем unwrap для обработки результата

      toast.success("Вы успешно купили предмет"); // Уведомление о покупке
      console.log("Item purchased successfully");

      navigate("/marketplace"); // Перенаправляем на страницу marketplace


    } catch (error) {
      console.error("Failed to purchase item:", error);
    }
  };

  return (
    <div className="border border-[#161448] rounded-lg p-4 bg-gradient-to-tr from-[#1D1730] to-[#141333] transition-all duration-500 ease-in-out w-[226px] h-[334px]">
      <div className="flex items-center gap-2 relative">
        <span className="text-lg font-semibold text-white truncate">
          {item.itemName}
        </span>
        <Link to={`/profile/${item.sellerId}`}>
          <span className="text-xs text-white underline truncate">({sellerProfile?.username || "Unknown"})</span> {/* Используем имя продавца из профиля */}
        </Link>
      </div>
      <img
        src={item.itemImage}
        alt={item.itemName}
        className={`mb-2 w-full h-48 object-cover rounded ${loading ? "hidden" : ""}`}
        onLoad={handleImageLoad}
      />

      <p className="text-blue-500 text-center py-1 text-ellipsis truncate">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "DOL",
          minimumFractionDigits: 0,
        })
          .format(item.price)
          .replace("DOL", "K₽")}
      </p>
      <MainButton text="Buy" onClick={handleBuy} disabled={loading} /> 
    </div>
  );
};

export default MarketItem;
