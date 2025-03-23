import React, { useEffect, useState } from 'react';
import socket from '../socket'; // Убедитесь, что путь к socket правильный

interface DroppedItem {
  image: string;
  name: string;
}

const LiveDrop = () => {
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>(() => {
    const savedItems = localStorage.getItem('droppedItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    socket.on('caseOpened', (data) => {
      setDroppedItems((prevItems) => {
        const newItems = [...data.winningItems, ...prevItems];
        if (newItems.length > 5) {
          newItems.pop(); // Удаляем последний элемент, если больше 5
        }
        localStorage.setItem('droppedItems', JSON.stringify(newItems)); // Сохраняем в localStorage
        return newItems;
      });
    });

    return () => {
      socket.off('caseOpened'); // Очистка обработчика при размонтировании
    };
  }, []);

  return (
    <div className="flex flex-col gap-1 pt-1 items-center justify-center">
      <div className="flex flex-col max-w-[1920px] w-full">
        <span className="text-[#9793ba] text-[10px]">LIVE DROP</span>
        <div className="flex h-28 bg-[#141225]">
          <div className="flex overflow-hidden justify-start transition-all">
            {droppedItems.map((item, index) => (
              <div key={index} className="dropped-item" style={{ width: '100px', height: '100px' }}>
                <img src={item.image} alt={item.name} className="object-cover" />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDrop;