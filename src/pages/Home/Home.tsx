import { useEffect } from "react";
import { useGetCasesQuery } from "../../features/casesSlice"; 
import Banner from "./Banner"; 
import CaseListing from "./CaseListing";
import GameListing from "./GamesListing";
import Leaderboard from "./Leaderboard";
import { toast } from "react-toastify";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Case } from "../../app/types";
import crashBanner from '../../images/crashBanner.webp'
import marisaBanner from '../../images/marisaBanner.png'
import paris from '../../images/paris.webp'
import homeBanner from '../../images/homeBanner.webp'
import KANICASINO from '../../images/KANICASINO.webp'
const Home = () => {
  const { data: cases = [] as Case[], error, isLoading } = useGetCasesQuery();

  useEffect(() => {
    if (error) {
      toast.error("Error while connecting to the server");
    }
  }, [error]);

  const BannerContent = [
    {
      left: {
        image: marisaBanner,
        title: "CRASH GAME",
        description: "Не сгорай, лети высоко! Испытай свою удачу прямо сейчас!",
        link: "/crash",
      },
      right: (
        <div>
          <img src={crashBanner} alt="upgrade" />
        </div>
      ),
    },
    {
      left: {
        image: paris,
        title: "NEW UPGRADE GAME",
        description: "Go big or go home. Try your luck now!",
        link: "/upgrade",
      },
      right: null,
    },
    {
      left: {
        image: homeBanner,
        title: "hide",
        description: "Try your luck now!",
        link: "/slots",
      },
      right: (
        <div className="hidden 2xl:flex 2xl:mr-36">
          <img src={KANICASINO} alt="kanicasino" />
        </div>
      ),
    },
  ];

  return (
    <div className=" flex justify-center">
      <div className="flex-col w-full max-w-[1920px]">
       <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        showArrows={false}
        interval={7000}
        stopOnHover={false}
      >
        {BannerContent.map((item, index) => (
          <Banner key={index} left={item.left} right={item.right} />
        ))}
      </Carousel>

      {isLoading ? (
        <div className="flex items-center justify-center w-full mt-[164px]">
          <p className="text-white">Loading...</p>
        </div>
      ) : (
        cases.length > 0 ? (
          <CaseListing
            name="Новые Кейсы"
            cases={cases}
          />
        ) : (
          <div>No cases found</div>
        )
      )}
      <GameListing name="Our Games" />
      <Leaderboard />
    </div>
    </div>
  );
};

export default Home;