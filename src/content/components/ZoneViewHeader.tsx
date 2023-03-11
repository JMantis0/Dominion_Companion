import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import React, { FunctionComponent } from "react";
import { SortButtonState } from "../../redux/contentSlice";
import SortButton from "./SortButton";

type ZoneViewHeaderProps = {
  dispatchFunc:
    | ActionCreatorWithPayload<SortButtonState, "content/setSortedButtonsState">
    | ActionCreatorWithPayload<SortButtonState, "content/setDiscardSortState">
    | ActionCreatorWithPayload<SortButtonState, "content/setOpponentSortState">
    | ActionCreatorWithPayload<SortButtonState, "content/setOpponentTrashSortState">
    | ActionCreatorWithPayload<SortButtonState, "content/setTrashSortState">;
    
  reduxState: SortButtonState;
};

const ZoneViewHeader: FunctionComponent<ZoneViewHeaderProps> = ({
  dispatchFunc,
  reduxState,
}) => {
  return (
    <React.Fragment>
      <div className={"text-xs grid grid-cols-12"}>
        <div className="col-span-7 whitespace-nowrap">
          <SortButton
            title="Card"
            category="card"
            reducer={dispatchFunc}
            reduxState={reduxState}
          />
        </div>
        <div className="col-span-5 whitespace-nowrap">
          <SortButton
            title="Amount"
            category="zone"
            reducer={dispatchFunc}
            reduxState={reduxState}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ZoneViewHeader;
