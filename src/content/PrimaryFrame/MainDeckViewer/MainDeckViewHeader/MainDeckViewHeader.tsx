import React, { FunctionComponent, SetStateAction } from "react";
import SortButton from "../../SortButton/SortButton";
import { SortButtonState } from "../../../../utils";

type MainDeckViewHeaderProps = {
  sortButtonState: SortButtonState;
  setSortButtonState: React.Dispatch<SetStateAction<SortButtonState>>;
};

const MainDeckViewHeader: FunctionComponent<MainDeckViewHeaderProps> = ({
  sortButtonState,
  setSortButtonState,
}) => {
  return (
    <React.Fragment>
      <div className={"text-xs text-white grid grid-cols-10 col-span-10"}>
        <div className="col-span-3 whitespace-nowrap">
          <SortButton
            title="Card"
            category="card"
            currentSortState={sortButtonState}
            setSortButtonState={setSortButtonState}
          />
        </div>
        <div className="col-span-2 whitespace-nowrap">
          <SortButton
            title="D #"
            category="zone"
            currentSortState={sortButtonState}
            setSortButtonState={setSortButtonState}
          />
        </div>
        <div className="col-span-2 whitespace-nowrap">
          <SortButton
            title="T #"
            category="owned"
            currentSortState={sortButtonState}
            setSortButtonState={setSortButtonState}
          />
        </div>
        <div className="col-span-3 whitespace-nowrap">
          <SortButton
            title="Drw%"
            category="probability"
            currentSortState={sortButtonState}
            setSortButtonState={setSortButtonState}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default MainDeckViewHeader;
