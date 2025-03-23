import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetItemListingsQuery, useRemoveListingMutation } from "../../app/services/market/MarketServicer";
import Item from "./Item";
import Pagination from "../../components/Pagination";
import { IMarketItem } from "../../app/types";
import SellItemModal from "./SellItemModal";
import ConfirmPurchaseModal from "./CoinfirmPurchaseModal";

const defaultItem: IMarketItem = {
  id: 0,
  sellerId: {
    id: 0,
    username: "",
  },
  item: {
    id: 0,
    name: "",
    image: "",
    uniqueId: "",
  },
  price: 0,
  itemName: "",
  itemImage: "",
  uniqueId: "",
};

const ItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Ensure id is a string

  const [item, setItem] = useState<IMarketItem | null>(null);
  const [loadingRemoval, setLoadingRemoval] = useState<boolean>(false);
  const [openBuyModal, setOpenBuyModal] = useState<boolean>(false);
  const [openSellModal, setOpenSellModal] = useState<boolean>(false);
  const [removeListing] = useRemoveListingMutation();
  const [selectedItem, setSelectedItem] = useState<IMarketItem | null>(null);

  const { data: itemsData } = useGetItemListingsQuery({
    itemId: Number(id), // Ensure this uses the correct uniqueId
  });


  console.log("Received itemsData:", itemsData);


  const buyItem = (item: IMarketItem) => {
    setSelectedItem(item);
    setOpenBuyModal(true);
  };

  useEffect(() => {
    if (itemsData) {
      console.log("Setting item with data:", itemsData); // Log the data being set
      setItem(itemsData); // Set the item directly
    } else {
      console.error("Invalid item data:", itemsData);
    }
  }, [itemsData]);


  const removeItem = async (item: IMarketItem) => {
    setLoadingRemoval(true);
    try {
      await removeListing(item.uniqueId); // Use uniqueId instead of id
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRemoval(false);
    }
  };

  return (
    <div className="flex flex-col w-screen items-center min-h-screen">

      <SellItemModal
        isOpen={openSellModal}
        onClose={() => setOpenSellModal(false)}
      />
      <ConfirmPurchaseModal
        isOpen={openBuyModal}
        onClose={() => setOpenBuyModal(false)}
        item={selectedItem || defaultItem} // Use defaultItem if selectedItem is null
      />
      <h1 className="text-3xl font-bold mb-6">Item Listings</h1>
      {item ? (
      <Item
        key={item.uniqueId} // Используем uniqueId для ключа
        item={item}
      />

      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-2xl font-bold text-center">
            Предмет не найден.
          </h1>
        </div>
      )}

    </div>
  );
};

export default ItemPage;
