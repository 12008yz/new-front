import { useState } from "react";
import Rarities from "./Rarities";
import { BsPinAngleFill } from "react-icons/bs";
import { useFixItemMutation } from "../app/services/users/UserServicer";
import { RotatingLines } from "react-loader-spinner";

interface itemProps {
  item: {
    id: string;
    name: string;
    image: string;
    rarity: string;
  };
  fixable?: boolean;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  size?: "small" | "large";
}

const Item: React.FC<itemProps> = ({ item, fixable, setRefresh, size = "large" }) => {
  const [hovering, setHovering] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [fixItem] = useFixItemMutation();

  const fixPlayerItem = async (itemId: string) => {
    try {
      await fixItem(itemId);
      setRefresh && setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const color = Rarities.find((rarity) => {
      const match = rarity.name.toLowerCase() === item?.rarity.toLowerCase();
      return match;
  })?.color || "white";
  const ItemsWidthSize = size === "large" ? "w-32 md:w-44" : "w-24 md:w-32";
  const ItemHeightSize = size === "large" ? "h-32 md:h-44" : "h-24 md:h-32";

  return (
    <div
      className={`flex flex-col ${ItemsWidthSize} items-center justify-center bg-[#212031] rounded relative border-b-2`}
      style={{
        borderColor: color
      }}
      key={item?.name + Math.random()}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="overflow-hidden">
        <img
          src={item?.image}
          alt={item?.name}
          className={`${ItemsWidthSize} ${ItemHeightSize} hover:scale-105 transition-all object-contain`}
          onLoad={() => setLoaded(true)}
        />
        <div
          className="w-auto"
          style={{
            boxShadow: `0px 0px 120px 80px ${color}`,
          }}
        />
      </div>
      {fixable && (
        <div
          className={`absolute top-1 right-1 transition-all ${hovering ? "opacity-100 " : "opacity-0 -translate-y-2"}`}
          onClick={() =>
            fixPlayerItem(item.id)
          }
        >
          <BsPinAngleFill className="text-2xl text-blue-500 hover:text-blue-300 transition-all cursor-pointer" />
        </div>
      )}
      <div className="flex gap-2 items-center -ml-1 max-w-[160px]">
        <div className={`w-1 h-1 md:h-2 md:w-2 aspect-square rounded-full`} style={{
          backgroundColor: color
        }} />
        <p className={`text-xs md:text-base py-2 max-h-[32px] md:max-h-none text-center 
        overflow-hidden truncate w-full max-w-[80px] md:max-w-none ${size === "large" ? "md:w-auto" : "md:w-20"}`}>
          {item?.name}
        </p>
      </div>
    </div>
  );
};

export default Item;