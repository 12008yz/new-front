import { useEffect, useState } from "react";
import { ModalProvider } from "../../ModalContext"; 
import UserFlow from "./userFlow";
import Navbar from "./Navbar/Navbar";
import { ImConnection } from "react-icons/im";
import CaseOpenedNotification from "./CaseOpenedNotification";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Notifications from "./Navbar/Notitfications";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import { BasicItem } from "../../app/types";
import LiveDrop from '../LiveDrop'; // Импортируем новый компонент

interface CaseOpeningItem {
  caseImage: string;
  timestamp: number;
  user: {
    id: number; // Изменено на number
    name: string;
    profilePicture: string;
  };
  winningItems: BasicItem[];
}

interface Header {
  onlineUsers: number;
  recentCaseOpenings: CaseOpeningItem[];
  notification: any;
  setNotification: React.Dispatch<React.SetStateAction<any>>;
}

interface ItemsQueue {
  items: BasicItem[];
  caseImages: string[];
  user: {
    id: number; // Изменено на number
    name: string;
    profilePicture: string;
  };
}

const Header: React.FC<Header> = ({ onlineUsers, recentCaseOpenings, notification, setNotification }) => {
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [ItemsQueue, setItemsQueue] = useState<ItemsQueue[]>([]);

  const navigate = useNavigate();
  const isHome = window.location.pathname === "/";

  const items = [
    {
      name: "ONLINE",
      icon: <ImConnection />,
      value: onlineUsers,
    },
  ];

  useEffect(() => {
    if (openNotifications === true) {
      setNotification([]);
    }
  }, [openNotifications]);

  useEffect(() => {
    if (notification?.message) {
      toast.info(notification.message);
    }
  }, [notification]);

  return (
    <div className="flex flex-col p-4 w-screen justify-center ">
      <div className="flex pb-2 items-center">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-green-400 text-sm font-normal"
          >
            {item.icon}
            <div className="font-bold">{item.value || 0}</div> {/* Отображаем 0, если значение отсутствует */}
            <div className="text-[#84819a] text-sm">{item.name}</div>
          </div>
        ))}
      </div>
      <Navbar 
        openNotifications={openNotifications} 
        setOpenNotifications={setOpenNotifications} 
        openSidebar={openSidebar} 
        setOpenSidebar={setOpenSidebar} 
        onlineUsers={onlineUsers} // Передаем количество онлайн пользователей
      />
      <ModalProvider>
        <UserFlow />  {/* Обернуть UserFlow в ModalProvider */}
      </ModalProvider>
      <LiveDrop />
      {!isHome && (
        <div className="p-4">
          <div className="flex items-center gap-2 text-[#84819a] cursor-pointer w-fit" onClick={() => navigate(-1)}>
            <BiArrowBack />
            <span>Back</span>
          </div>
        </div>
      )}
      {openSidebar && <Sidebar closeSidebar={() => setOpenSidebar(false)} />}
    </div>
  );
};

export default Header;