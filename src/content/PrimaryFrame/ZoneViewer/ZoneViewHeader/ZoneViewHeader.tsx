import React, { FunctionComponent } from "react";

import SortButton from "../../SortButton/SortButton";
import { SortButtonState, SortReducer } from "../../../../utils/utils";

type ZoneViewHeaderProps = {
  dispatchFunc: SortReducer;
  currentSortState: SortButtonState;
};

const ZoneViewHeader: FunctionComponent<ZoneViewHeaderProps> = ({
  dispatchFunc,
  currentSortState,
}) => {
  return (
    <React.Fragment>
      <div className={"text-xs grid grid-cols-12"}>
        <div className="col-span-7 whitespace-nowrap">
          <SortButton
            title="Card"
            category="card"
            reducer={dispatchFunc}
            currentSortState={currentSortState}
          />
        </div>
        <div className="col-span-5 whitespace-nowrap">
          <SortButton
            title="Amount"
            category="zone"
            reducer={dispatchFunc}
            currentSortState={currentSortState}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ZoneViewHeader;
