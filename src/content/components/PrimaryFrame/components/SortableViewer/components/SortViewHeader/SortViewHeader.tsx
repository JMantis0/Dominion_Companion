import React from "react";
import { useSelector } from "react-redux";
import { setSortedButtonsState } from "../../../../../../../redux/contentSlice";
import { RootState } from "../../../../../../../redux/store";
import SortButton from "../../../components/SortButton/SortButton";

const SortViewHeader = () => {
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );
  return (
    <React.Fragment>
      <div className={"text-xs grid grid-cols-12"}>
        <div className="col-span-5 whitespace-nowrap">
          <SortButton
            title="Card"
            category="card"
            reducer={setSortedButtonsState}
            reduxState={sortButtonState}
          />
        </div>
        <div className="col-span-2 whitespace-nowrap">
          <SortButton
            title="D #"
            category="zone"
            reducer={setSortedButtonsState}
            reduxState={sortButtonState}
          />
        </div>

        <div className="col-span-2 whitespace-nowrap">
          <SortButton
            title="T #"
            category="owned"
            reducer={setSortedButtonsState}
            reduxState={sortButtonState}
          />
        </div>
        <div className="col-span-3 whitespace-nowrap">
          <SortButton
            title="Drw%"
            category="probability"
            reducer={setSortedButtonsState}
            reduxState={sortButtonState}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default SortViewHeader;
