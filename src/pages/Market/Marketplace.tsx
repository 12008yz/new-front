import React, { useState, useEffect } from "react";
import MarketItem from "./MarketItem";
import MainButton from "../../components/MainButton";
import Title from "../../components/Title";
import Skeleton from "react-loading-skeleton";
import { useUserContext } from "../../UserContext";
import Pagination from "../../components/Pagination";
import Filters from "./Filters";
import { FiFilter } from 'react-icons/fi';
import SellItemModal from './SellItemModal'
import { useGetItemsQuery } from "../../app/services/market/MarketServicer";
import { IMarketItem } from "../../app/types";

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<IMarketItem[]>([]);
  const [openSellModal, setOpenSellModal] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState({
    name: '',
    rarity: '',
    sortBy: '',
    order: 'asc'
  });
  const [openFilters, setOpenFilters] = useState<boolean>(false);


  const { data: itemsData } = useGetItemsQuery({ page, filters });
  useEffect(() => {
    if (itemsData && itemsData.items && Array.isArray(itemsData.items)) {
        setItems(itemsData.items); // Устанавливаем массив из items
    } else {
        console.error("itemsData не содержит массив items:", itemsData);
    }
}, [itemsData]);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    setRefresh(true);
    scrollTo(0, 0);
  }, [page]);

  return (
    <div className="flex flex-col items-center h-screen">

      <SellItemModal
        isOpen={openSellModal}
        onClose={() => setOpenSellModal(false)}
        setRefresh={setRefresh}
      />
      <div className="flex items-center justify-center w-full max-w-[1600px] relative ">
        <Title title="Marketplace" />

        <div className="absolute md:right-24 -top-6 md:top-0">
            <div className="w-52">
              <MainButton
                onClick={() => setOpenSellModal(true)}
                text="Sell an item"
              />
            </div>
        </div>

        <div className="flex flex-col md:flex-row items-center w-full justify-end gap-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div onClick={() => setOpenFilters(!openFilters)} className="border p-2 rounded-md cursor-pointer">
              <FiFilter className="text-2xl " />
            </div>
            {openFilters && (
              <Filters filters={filters} setFilters={setFilters} />
            )}
          </div>
        </div>
      </div>
      {
        items.length > 0 && (
          <Pagination totalPages={Math.ceil(items.length / 10)} currentPage={page} setPage={setPage} />
        )
      }
      
      <div className="flex flex-wrap items-center gap-4 justify-center px-8 ">
{items.length === 0 ? (
          <div>Предметов нет</div>

        ) : (
          <div className="flex flex-wrap items-center gap-4 justify-center px-8  max-w-[1600px]">
            {items.map((item) => (
              <MarketItem
                key={item.uniqueId} // Используем uniqueId для ключа
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
