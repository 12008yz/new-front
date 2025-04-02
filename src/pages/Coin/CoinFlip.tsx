import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userApi, useGetMeQuery } from "../../app/services/users/UserServicer"; // Импортируем userApi
import { motion } from "framer-motion";
import { 
  selectCoinFlipState,
  placeBet,
  makeChoice,
  resetCoinFlipGame,
  setCoinFlipResult,
  startCoinFlipGame,
  endCoinFlipGame
} from "../../features/gamesSlice";
import socket, { 
  connectSocket,
  disconnectSocket
} from "../../socket";
import Coin from "./Coin";
import LiveBets from "./LiveBets";

const CoinFlip = () => {
  const dispatch = useDispatch();
  const { data: user, isLoading } = useGetMeQuery(); // Загрузка данных пользователя

  useEffect(() => {
    const handleGameStart = () => {
      setSpinning(false);
      setCountDown(5); // Устанавливаем таймер на 5 секунд для ставок
      console.log(`Время для ставок начинается в: ${new Date().toLocaleTimeString()}`); // Лог времени начала ставок
      dispatch(startCoinFlipGame()); // Устанавливаем isGameStarted в true
      setTimeout(() => {
        setSpinning(true); // Запускаем анимацию вращения
        console.log("Анимация вращения запущена"); // Лог состояния spinning
        setTimeout(() => {
          setSpinning(false); // Останавливаем анимацию через 5 секунд
          console.log("Анимация вращения остановлена"); // Лог состояния spinning
          setCountDown(9); // Устанавливаем таймер на 9 секунд ожидания результата
        }, 5000); // Время вращения
      }, 5000); // Время ожидания ставок
    };

    const handleGameResult = (result: number) => { // Указываем тип для result
      dispatch(setCoinFlipResult(result)); // Устанавливаем результат
      dispatch(endCoinFlipGame()); // Устанавливаем isGameStarted в false
      console.log(`Результат игры: ${result}`); // Лог результата
    };

    socket.on('coinFlip:start', handleGameStart);
    socket.on('coinFlip:result', handleGameResult);

    return () => {
      socket.off('coinFlip:start', handleGameStart);
      socket.off('coinFlip:result', handleGameResult);
    };
  }, [dispatch]);
  
  const coinFlipState = useSelector(selectCoinFlipState);
  const { result, history } = coinFlipState;
  const [bet, setBet] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [userGambled, setUserGambled] = useState(false);

  const handleBet = () => {
    if (isLoading) {
      console.error('Данные пользователя загружаются, подождите.');
      return;
    }
    if (choice === null || bet <= 0) return;
    
    if (!user) {
      console.error('User not found');
      return;
    }

    if (user.walletBalance < bet) {
      console.error('Insufficient balance');
      return;
    }

    // Обновляем состояние ставок и отправляем данные на сервер
    dispatch(placeBet({ userId: Number(user.id), bet, choice })); // Приведение user.id к типу number
    dispatch(makeChoice({ userId: Number(user.id), choice })); // Приведение user.id к типу number
    
    setUserGambled(true);
    console.log(`User choice: ${choice === 0 ? "Tails" : "Heads"}, Bet: K₽${bet}`); // Лог выбора пользователя
    console.log('Пользователь:', user);
  };

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (countDown > 0 && !spinning) {
      setTimeout(() => {
        setCountDown(countDown - 0.1);
      }, 100);
    }
  }, [countDown]);

  return (
    <div className="w-screen flex flex-col items-center justify-center gap-12">
      <div className="flex bg-[#212031] rounded flex-col lg:flex-row">
        <div className="lg:w-[340px] flex flex-col items-center gap-4 border-r border-gray-700 py-4 px-6">
          <input
            type="number"
            value={bet}
            onChange={(e) => {
              const value = Number(e.target.value);
              setBet(value < 0 ? 0 : value);
            }}
            className="p-2 border rounded w-1/2 lg:w-full"
          />
          <div className="flex flex-col gap-2 w-full">
            <label className="text-lg font-semibold">Choose a side</label>
            <div className="flex items-center justify-between gap-2 w-full flex-col lg:flex-row">
              {[{
                  name: "Heads",
                  color: "red",
                  id: 0
                }, {
                  name: "Tails",
                  color: "green",
                  id: 1
                }].map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      console.log(`Selected choice: ${e.id}`);
                      setChoice(e.id);
                    }}
                    className={`p-2 border rounded w-1/2 ${e.color === 'red' ? 'bg-red-500' : 'bg-green-500'} ${choice === e.id && "bg-opacity-30"}`}
                  >
                    {e.name}
                  </button>
                ))
              }
            </div>
          </div>
          <button 
            onClick={handleBet} 
            className="p-2 border rounded bg-indigo-600 hover:bg-indigo-700 w-full mt-4" 
            disabled={choice === null || bet <= 0 || userGambled || spinning}
          >
            {spinning ? "Spinning..."
              : choice === null ? "Choose a side"
              : bet <= 0 ? "Place the bet value"
              : userGambled ? "You're in!"
              : "Enter the Game"}
          </button>
        </div>
        <div className="flex flex-col">
          <div className="flex lg:w-[800px] border-b border-gray-700 p-4">
            <div className="flex bg-[#19172D] rounded items-center justify-center w-full h-[340px] relative">
              {countDown > 0 && (
                <div className="absolute top-0 left-0 p-2">
                  <span>Next game in: {countDown.toFixed(1)}</span>
                </div>
              )}
              <Coin spinning={spinning} result={result} />
            </div>
          </div>
          <div className="flex w-screen lg:w-[800px] p-4 flex-col">
            <h3 className="mb-2 text-lg font-semibold">Game History:</h3>
            <div className="flex items-center gap-2 justify-end w-full overflow-hidden h-[24px]">
              {history?.map((entry: { result: number }, index: number) => (
                <motion.div
                  key={index}
                  className={`min-w-[24px] min-h-[24px] rounded-full ${entry.result === 0 ? "bg-red-500" : "bg-green-500"}`}
                  initial={index === history.length - 1 ? { opacity: 0, x: 30 } : {}}
                  animate={index === history.length - 1 ? { opacity: 1, x: 0 } : {}}
                  transition={{ ease: "easeOut", duration: 1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-8 flex-col lg:flex-row">
        {["Heads", "Tails"].map((type, i) => (
          <LiveBets type={type} key={i} />
        ))}
      </div>
      <div className="result-display">
        <h2>Результат: {result !== null ? (result === 0 ? "Heads" : "Tails") : "Игра еще не началась"}</h2>
      </div>
    </div>
  );
};

export default CoinFlip;