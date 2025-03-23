import { User } from '../app/types';
import Player from './Player';
import Monetary from './Monetary';
import podium from '../images/podium.svg'

interface CardProps {
    user: User | null; // добавили null в тип User
    rank: number;
}

const TopPlayer: React.FC<CardProps> = ({ user, rank }) => {
    if (!user) return null;
  
    return (
      <div className={`relative w-64 ${rank === 1 ? '-mt-10' : 'hidden md:block'}`}>
        <div className='relative  z-50 flex flex-col items-center justify-center'>
          <Player user={user} size="small" direction="row" showLevel={true} />
          <div className='flex flex-col items-center gap-2'>
            <span className='text-2xl font-bold mt-1'>
              #{rank}
            </span>
          </div>
          <div className="text-gray-500 truncate mt-6">
            <Monetary value={user.weeklyWinnings} />
          </div>
        </div>
        <img src={podium} alt="podium" className="absolute top-[70px] z-0" />
      </div>
    );
  };

export default TopPlayer;