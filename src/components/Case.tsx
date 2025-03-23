import { useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import Monetary from './Monetary';

interface CaseProps {
  title: string;
  image: string | null; // добавьте null в тип image, используйте изображения из public/image
  price: number;
}

const Case: React.FC<CaseProps> = ({ title, image, price }) => {
  console.log('CaseComponent props:', title, image, price);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="flex flex-col w-64 items-center rounded transition-all"
    >
      {!loaded && (
        <div className="flex w-full h-64 items-center justify-center">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="50px"
            visible={true}
          />
        </div>
      )}
      {image && ( // добавьте проверку на существование изображения
        <img
          src={image}
          alt={title}
          className={`w-1/2 md:w-full h-32 md:h-64 object-cover -ml-4 ${loaded ? '' : 'hidden'}`}
          onLoad={() => setLoaded(true)}
        />
      )}
      <div className="flex flex-col gap-2 p-4 items-center">
        <div className="font-bold text-lg">{title}</div>
        <div className="font-medium text-md to-green-400">
          <Monetary value={price} />
        </div>
      </div>
    </div>
  );
};

export default Case;