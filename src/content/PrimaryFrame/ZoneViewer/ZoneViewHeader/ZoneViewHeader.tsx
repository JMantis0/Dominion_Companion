import React, { FunctionComponent, SetStateAction } from "react";
import SortButton from "../../SortButton/SortButton";
import type { SortButtonState } from "../../../../utils";

type ZoneViewHeaderProps = {
  currentSortState: SortButtonState;
  setSortButtonState: React.Dispatch<SetStateAction<SortButtonState>>;
};

const ZoneViewHeader: FunctionComponent<ZoneViewHeaderProps> = ({
  currentSortState,
  setSortButtonState,
}) => {
  return (
    <React.Fragment>
      <div className={"text-xs grid grid-cols-12"}>
        <div className="col-span-7 whitespace-nowrap">
          <SortButton
            title="Card"
            category="card"
            currentSortState={currentSortState}
            setSortButtonState={setSortButtonState}
          />
        </div>
        <div className="col-span-5 whitespace-nowrap">
          <SortButton
            title="Amount"
            category="zone"
            currentSortState={currentSortState}
            setSortButtonState={setSortButtonState}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ZoneViewHeader;
