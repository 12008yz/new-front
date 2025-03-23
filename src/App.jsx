import { BrowserRouter as Router } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify"; // Импортируйте ToastContainer
import "react-tooltip/dist/react-tooltip.css";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./UserContext"; 
import socket from "./socket"; // Импортируем socket

const Header = lazy(() => import("./components/header/index"));
const AppRoutes = lazy(() => import("./Routes"));

function App() {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [recentCaseOpenings, setRecentCaseOpenings] = useState([]);
  const [notification, setNotification] = useState();
  const [openNotifications, setOpenNotifications] = useState(false); // Добавлено состояние для уведомлений

  useEffect(() => {
    // Обработка события обновления количества онлайн пользователей
    socket.on("onlineUsers", (count) => {
      setOnlineUsers(count);
    });

    // Обработка события открытия кейса
    socket.on("caseOpened", (data) => {
      setRecentCaseOpenings((prev) => [...prev, data]);
      setNotification(`Кейс открыт: ${data.winningItems.length} предметов!`);
      setOpenNotifications(true);
    });

    // Очистка обработчиков при размонтировании компонента
    return () => {
      socket.off("onlineUsers");
      socket.off("caseOpened");
    };
  }, []);

  return (
    <UserProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Header 
            onlineUsers={onlineUsers}
            notification={notification}
            setNotification={setNotification}
          />
          <AppRoutes />
          <ToastContainer />
        </Suspense>
      </Router>
    </UserProvider>
  );
}

export default App;