import { Link } from "react-router-dom";
import CaseComponent from '../../components/Case'
import {Case} from '../../app/types'
import Title from '../../components/Title'
import socket from "../../socket";

interface CaseListingProps {
  name: string,
  description?: string,
  cases: Case[]
}

const CaseListing: React.FC<CaseListingProps> = ({
  name,
  description,
  cases
}) => {

  return (
    <div className="flex flex-col items-center justify-center max-w-[1600px]">
      <Title title={name} />
      {description && <div className="text">{description}</div>}
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:flex-wrap">
        {cases && cases.length > 0 ? (
          cases.map((item) => {
            if (item.id) {
              return (
                <Link to={`/case/${item.id}`} key={item.id} onClick={() => {
                    socket.emit('itemDropped', {
                        image: item.image,
                        name: item.title,
                        caseId: item.id,
                    });
                }}>
                  <CaseComponent
                    title={item.title}
                    image={item.image}
                    price={item.price}
                  />
                  
                </Link>
              );
            } else {
              return null;
            }
          })
        ) : (
          <div>No cases found</div>
        )}
      </div>
    </div>
  );
}

export default CaseListing;