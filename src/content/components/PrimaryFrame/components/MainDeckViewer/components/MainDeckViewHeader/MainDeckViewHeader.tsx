import React from "react";
import { useSelector } from "react-redux";
import { setSortedButtonsState, setTurn } from "../../../../../../../redux/contentSlice";
import { RootState } from "../../../../../../../redux/store";
import SortButton from "../../../components/SortButton/SortButton";
import { useDispatch } from "react-redux";

const MainDeckViewHeader = () => {
  const dispatch = useDispatch()
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );
  const turn = useSelector((state:RootState) => state.content.turn)
  return (
    <React.Fragment>
      <div className={"text-xs grid grid-cols-12"}>
        <div className={"col-span-7"}></div>
        <div className={"col-span-5"}>
          <button
            className={`${
              turn === "Current" ? "bg-lime-400" : "bg-red-500"
            }`}
            onClick={() => {
              dispatch(setTurn("Current"));
            }}
          >
            This Turn
          </button>
          <button
            className={`${
              turn === "Next" ? "bg-lime-400" : "bg-red-500"
            }`}
            onClick={() => {
              dispatch(setTurn("Next"));
            }}
          >
            Next Turn
          </button>
        </div>
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
