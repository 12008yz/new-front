import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetProfileQuery } from "../../app/services/users/UserServicer";
import UserInfo from "./UserInfo";
import FixedItem from "./FixedItem";
import Pagination from "../../components/Pagination";
import Skeleton from "react-loading-skeleton";
import Item from "../../components/Item";
import { RootState } from "../../app/store";
import { setProfile, clearProfile } from "../../features/profileSlice";
import socket from "../../socket";

interface Inventory {
  totalPages: number;
  currentPage: number;
  items: any[];
}

interface SocketData {
  id: number;
  message: string;
}
const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data: profileData, isLoading: loadingProfile } = useGetProfileQuery(id!.toString());
  const profile = useSelector((state: RootState) => state.profile.profile);
  
  const [invItems, setInvItems] = useState<any[]>([]);
  const [inventory, setInventory] = useState<Inventory>();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    // Сброс скролла при загрузке страницы
    window.scrollTo(0, 0);
    
    if (profileData) {
      dispatch(setProfile(profileData));
      const itemsPerPage = 12;
      const items = profileData.inventory || [];
      const totalPages = Math.ceil(items.length / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      setInvItems(items.slice(startIndex, endIndex));
      setInventory({
        totalPages,
        currentPage: page,
        items,
      });
    }

    // Обработчики событий WebSocket
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('data', (data: SocketData) => {
      console.log('Received data:', data);
      // Обновите состояние компонента на основе полученных данных
  });

    return () => {
      dispatch(clearProfile());
      socket.off('connect');
      socket.off('disconnect');
      socket.off('data');
    };
  }, [profileData, dispatch, page, id]);

  return (
    <div className="flex flex-col items-center w-screen">
      <div className="flex flex-col max-w-[1312px] py-4 w-full">
        {loadingProfile ? (
          <Skeleton circle={true} height={144} width={144} />
        ) : (
          profile && (
            <UserInfo user={profile} isSameUser={profile.id === Number(id)} />
          )
        )}
      </div>

      <div className="flex flex-col items-center w-full bg-[#141225] min-h-screen">
        <div className="flex flex-col p-8 gap-2 items-center w-full max-w-[1312px]">
          <h2 className="text-2xl font-bold py-4 ">Inventory</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {invItems.length > 0 ? (
              invItems.map((item: any, i: number) => (
                <Item key={item.id} item={item} />
              ))
            ) : (
              <h2>No items</h2>
            )}
          </div>
          {inventory && inventory.items.length > 10 && (
            <Pagination 
              totalPages={inventory.totalPages} 
              currentPage={inventory.currentPage} 
              setPage={setPage} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;