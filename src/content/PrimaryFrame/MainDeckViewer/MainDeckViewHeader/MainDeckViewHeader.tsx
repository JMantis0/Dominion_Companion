import React from "react";
import { useSelector } from "react-redux";
import { setSortedButtonsState } from "../../../../redux/contentSlice";
import { RootState } from "../../../../redux/store";
import SortButton from "../../SortButton/SortButton";

const MainDeckViewHeader = () => {
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );

  return (
    <React.Fragment>
      <div className={"text-xs text-white grid grid-cols-12 "}>
        <div className="col-span-3 whitespace-nowrap">
          <SortButton
            title="Card"
            category="card"
            reducer={setSortedButtonsState}
            currentSortState={sortButtonState}
          />
        </div>
        <div className="col-span-2 whitespace-nowrap">
          <SortButton
            title="D #"
            category="zone"
            reducer={setSortedButtonsState}
            currentSortState={sortButtonState}
          />
        </div>

        <div className="col-span-2 whitespace-nowrap">
          <SortButton
            title="T #"
            category="owned"
            reducer={setSortedButtonsState}
            currentSortState={sortButtonState}
          />
        </div>
        <div className="col-span-3 whitespace-nowrap">
          <SortButton
            title="Drw%"
            category="probability"
            reducer={setSortedButtonsState}
            currentSortState={sortButtonState}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default MainDeckViewHeader;
