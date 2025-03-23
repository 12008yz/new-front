import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { 
  selectCoinFlipState,
  placeBet,
  makeChoice,
  resetCoinFlipGame
} from "../../features/gamesSlice";
import { 
  placeCoinFlipBet, 
  makeCoinFlipChoice,
  connectSocket,
  disconnectSocket
} from "../../socket";
import Coin from "./Coin";
import LiveBets from "./LiveBets";

const CoinFlip = () => {
  const dispatch = useDispatch();
  const coinFlipState = useSelector(selectCoinFlipState);
  const { result, history } = coinFlipState;
  const [bet, setBet] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [userGambled, setUserGambled] = useState(false);

  const user = useSelector((state: any) => state.user.user);

  const handleBet = () => {
    if (choice === null || bet <= 0) return;
    
    if (!user) {
      console.error('User not found');
      return;
    }

    if (user.walletBalance < bet) {
      console.error('Insufficient balance');
      return;
    }

    dispatch(placeBet({ userId: user.id, bet, choice }));
    dispatch(makeChoice({ userId: user.id, choice }));
    
    placeCoinFlipBet(user, bet, choice);
    makeCoinFlipChoice(user, choice);
    
    setUserGambled(true);
    console.log(`User choice: ${choice === 0 ? "Heads" : "Tails"}, Bet: K₽${bet}`); // Лог выбора пользователя
  };

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (result !== null) {
      setSpinning(false);
      console.log(`Coin flip result: ${result === 0 ? "Heads" : "Tails"}`); // Лог результата монеты
      setTimeout(() => {
        // Reset the betting state after the animation completes
        setBet(0);
        setChoice(null);
        dispatch(resetCoinFlipGame());
        setCountDown(9); // Устанавливаем countdown в соответствии с сервером
      }, 1200);
    }
  }, [result, dispatch]);

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
    </div>
  );
};

export default CoinFlip;
