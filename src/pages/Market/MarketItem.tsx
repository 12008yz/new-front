import React from "react";
import { useNavigate } from "react-router-dom";
import MainButton from "../../components/MainButton";
import Rarities from "../../components/Rarities";
import { IMarketItem } from "../../app/types"; // Импортируем тип IMarketItem

interface Props {
  item: IMarketItem; // Используем тип IMarketItem
}

const MarketItem: React.FC<Props> = ({ item }) => {
  const navigate = useNavigate();
  const color = item.itemName ? Rarities.find((rarity) => rarity.name === item.itemName)?.color || "white" : "white";

  return (
    <div className="border border-[#161448] rounded-lg p-4 bg-gradient-to-tr from-[#1D1730] to-[#141333] transition-all duration-500 ease-in-out w-[226px] h-[334px]">
      <div className="flex items-center gap-2 relative">
        <div
          className={`w-1 h-1 md:h-2 md:w-2 aspect-square rounded-full`}
          style={{ backgroundColor: color }}
        />
        <span className="text-lg font-semibold text-white truncate">
          {item.itemName || "Unknown Item"}
        </span>
      </div>
      <img
        src={item.itemImage}
        alt={item.itemName || "Item Image"}
        className="w-full h-48 object-cover rounded"
      />
      <p className="text-blue-500 text-center py-1 text-ellipsis truncate">
        {item.price} KP
      </p>
      <MainButton
        textSize="text-sm"
        text={`Buy for ${item.price} KP`}
        onClick={() => navigate(`/marketplace/item/${item.id}`)}
      />
    </div>
    
  );
};

export default MarketItem;