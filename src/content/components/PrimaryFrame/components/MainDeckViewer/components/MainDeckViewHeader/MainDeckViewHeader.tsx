import React, { BaseSyntheticEvent, useState } from "react";
import { useSelector } from "react-redux";
import {
  setSortedButtonsState,
  setTurn,
} from "../../../../../../../redux/contentSlice";
import { RootState } from "../../../../../../../redux/store";
import SortButton from "../../../components/SortButton/SortButton";
import { useDispatch } from "react-redux";

const MainDeckViewHeader = () => {
  const dispatch = useDispatch();
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );
  const turn = useSelector((state: RootState) => state.content.turn);
  const [pinnedToggleButton, setPinnedToggleButton] = useState<
    "Current" | "Next"
  >("Current");
  const handleMouseEnterButton = (e: BaseSyntheticEvent) => {
    const buttonName = e.target.name;
    dispatch(setTurn(buttonName));
  };
  const handleMouseLeaveButton = () => {
    dispatch(setTurn(pinnedToggleButton));
  };
  const handleToggleButtonClick = (e: BaseSyntheticEvent) => {
    const buttonName = e.target.name;
    setPinnedToggleButton(buttonName);
    dispatch(setTurn(buttonName));
  };

  return (
    <React.Fragment>
      <div className={"text-xs text-white grid grid-cols-12"}>
        <div className={"col-span-7"}></div> 
          <button
            className={`border-x border-y whitespace-nowrap col-span-3 ${turn === "Current" ? "text-lime-500" : "text-white"}`}
            name={"Current"}
            onMouseEnter={handleMouseEnterButton}
            onMouseLeave={handleMouseLeaveButton}
            onClick={handleToggleButtonClick}
          >
            This Turn
          </button>
          <button
            className={`border-x border-y whitespace-nowrap col-span-2 ${turn === "Next" ? "text-lime-500" : "text-white"}`}
            name={"Next"}
            onMouseEnter={handleMouseEnterButton}
            onMouseLeave={handleMouseLeaveButton}
            onClick={handleToggleButtonClick}
          >
            Next Turn
          </button>
        <div className="col-span-3 whitespace-nowrap">
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
        <div className="col-span-2 whitespace-nowrap">
          <SortButton
            title="Top5"
            category="hyper5"
            reducer={setSortedButtonsState}
            reduxState={sortButtonState}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default MainDeckViewHeader;
