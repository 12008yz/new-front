import { useRef } from "react";
import { useUpdateProfilePictureMutation } from "../../app/services/users/UserServicer";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import Countdown from "../../components/Countdown";
import FixedItem from "./FixedItem";
import Avatar from "../../components/Avatar";
import { User } from '../../app/types';

interface UserProps {
  user: User;
  isSameUser: boolean;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserInfo: React.FC<UserProps> = ({
  user: { id, profilePicture, level, username, xp, fixedItem, nextBonus },
  isSameUser,
  setRefresh,
}) => {
  console.log("User Info Data:", { id, profilePicture, level, username, xp, fixedItem, nextBonus });
  const fileInput = useRef<HTMLInputElement>(null);
  const [updateProfilePicture] = useUpdateProfilePictureMutation();

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSizeMB = file.size / 1024 / 1024; // size in MB
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const isValidFileType = validFileTypes.includes(file.type);

      if (fileSizeMB > 3) {
        toast.error('File size must be less than 3MB');
        return;
      }

      if (!isValidFileType) {
        toast.error('File type must be jpeg, jpg or png');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await updateProfilePicture(reader.result as string).unwrap();
          if (res.success) {
            setRefresh && setRefresh(true);
            toast.success('Profile picture updated successfully');
          } else {
            toast.error('Failed to update profile picture');
          }
        } catch (error: any) {
          console.log(error);
          toast.error(error.message);
        }
      };
      reader.readAsDataURL(file);
    }
    
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row items-center gap-7">
        <div className="relative group">
          <Avatar image={profilePicture} loading={false} id={id} size={'extra-large'} level={level} showLevel={true} />
          {isSameUser && (
            <button
              className="absolute inset-0 w-full h-full opacity-0 hover:opacity-70 bg-blue-500 transition-all flex items-center justify-center rounded-full cursor-pointer group-hover:opacity-70"
              onClick={() => fileInput.current?.click()}
            >
              <span className="text-white">It's you!</span>
            </button>
          )}
          <input
            type="file"
            className="hidden"
            onChange={handleProfilePictureChange}
            ref={fileInput}
            accept="image/png, image/jpeg, image/jpg"
          />
        </div>
        <div className="flex flex-col w-80 md:w-[686px]">
          <div className="flex gap-4 items-center">
            <span className="text-2xl font-semibold color-[#dddcfc]">{username}</span>
            {nextBonus && new Date(nextBonus).getTime() > Date.now() && (
              <Countdown nextBonus={nextBonus} />
            )}
          </div>
          <div className="flex flex-col gap-2 mt-5">
            <div className="flex w-full">
              <div className={`h-1 bg-blue-400 rounded rounded-l-none z-10`} style={{ width: `${(xp / calculateRequiredXP(level)) * 100}%` }} />
              <div className={`h-1 bg-[#3a365a] rounded rounded-r-none -translate-x-1 z-0`} style={{ width: `${100 - (xp / calculateRequiredXP(level)) * 100}%` }} />
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="text-[#dddcfc] font-semibold">
                {`XP ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(xp)} / 
                ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(calculateRequiredXP(level))}`}
              </span>
              <Tooltip id="my-tooltip" />
              <span className="text-[#3a365a] underline -translate-x-1 cursor-help" data-tooltip-id="my-tooltip" data-tooltip-content="To every 1K₽ spent, you get 5 XP.">
                How XP works?
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-0">
        {fixedItem && <FixedItem fixedItem={fixedItem} isSameUser={isSameUser} setRefresh={setRefresh} />}
      </div>
    </div>
  );
};

const calculateRequiredXP = (level: number) => {
  const baseXP = 1000;
  let requiredXP = baseXP;
  for (let i = 1; i <= level; i++) {
    requiredXP += baseXP * Math.pow(1.25, i - 1);
  }
  return Math.round(requiredXP);
};

export default UserInfo;
