import React, {
  BaseSyntheticEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  // useEffect,
  useState,
} from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  setPinnedTopCardsLookAmount,
  setSelectOpen,
  setTopCardsLookAmount,
} from "../../../../../redux/contentSlice";
import { AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import Scrollbars from "react-custom-scrollbars-2";
library.add(faAngleUp, faAngleDown);
// const selectedClass = "bg-[#1b1b1b] border-[#272727] text-[#dfdfdf]";
// const unselectedClass =
//   "hover:bg-[#1b1b1b] hover:border-[#272727] text-[#aaa] hover:text-[#dfdfdf]";

const toggleSelect = (
  selectState: boolean,
  dispatch: Dispatch<AnyAction>,
  setSelectOpen: ActionCreatorWithPayload<boolean, "content/setSelectOpen">
) => {
  dispatch(setSelectOpen(!selectState));
};

const mouseEnterOption = (
  cardAmount: number,
  dispatch: Dispatch<AnyAction>,
  setTopCardsLookAmount: ActionCreatorWithPayload<
    number,
    "content/setTopCardsLookAmount"
  >
) => {
  dispatch(setTopCardsLookAmount(cardAmount));
};

const mouseLeaveOption = (
  pinnedCardAmount: number,
  dispatch: Dispatch<AnyAction>,
  setTopCardsLookAmount: ActionCreatorWithPayload<number, string>
) => {
  dispatch(setTopCardsLookAmount(pinnedCardAmount));
};

const optionClick = (
  cardAmount: number,
  dispatch: Dispatch<AnyAction>,
  setTopCardsLookAmount: ActionCreatorWithPayload<
    number,
    "content/setTopCardsLookAmount"
  >,
  setPinnedTopCardsLookAmount: ActionCreatorWithPayload<
    number,
    "content/setPinnedTopCardsLookAmount"
  >
) => {
  dispatch(setTopCardsLookAmount(cardAmount));
  dispatch(setPinnedTopCardsLookAmount(cardAmount));
};

// const nonOptionClick = (
//   event: MouseEvent,
//   setSelectOpen: Dispatch<SetStateAction<boolean>>
// ) => {
//   const element = event.target as HTMLElement;
//   const parent = element.parentElement;
//   const parentId = parent === null ? "null" : parent.id;
//   if (parentId !== "option-container" && element.id !== "select-button" && element.id !== "thumb-track") {
//     setSelectOpen(false);
//   }
// };

export type CustomSelectProps = {
  colSpan: number;
};

const CustomSelect: FunctionComponent<CustomSelectProps> = ({ colSpan }) => {
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const selectOpen = useSelector(
    (state: RootState) => state.content.selectOpen
  );
  const totalCards = useSelector(
    (state: RootState) => state.content.playerDeck.entireDeck.length
  );
  const topCardsLookAmount = useSelector(
    (state: RootState) => state.content.topCardsLookAmount
  );
  const pinnedTopCardsLookAmount = useSelector(
    (state: RootState) => state.content.pinnedTopCardsLookAmount
  );

  // Event Listener added on render and removed on dismount handles the closing of the CustomSelect when a click outside of the options occurs.
  // useEffect(() => {
  //   const nonOptionClickListener = (event: MouseEvent) => {
  //     nonOptionClick(event, setSelectOpen);
  //   };
  //   document.addEventListener("click", nonOptionClickListener);
  //   return () => {
  //     document.removeEventListener("click", nonOptionClickListener);
  //   };
  // });

  return (
    <React.Fragment>
      <div className={`col-span-${colSpan} relative`}>
        <button
          id="select-button"
          className="w-full whitespace-nowrap grid grid-cols-12 border-y border-x text-white text-xs"
          onClick={() => {
            toggleSelect(selectOpen, dispatch, setSelectOpen);
          }}
        >
          <span className="col-span-7 pointer-events-none">Top</span>
          <br className="pointer-events-none"></br>
          <span
            className={`col-span-2 ${
              pinnedTopCardsLookAmount === topCardsLookAmount
                ? "text-lime-500"
                : "text-white"
            }  pointer-events-none`}
          >
            {topCardsLookAmount}
          </span>
          <span className="col-span-3 pointer-events-none">
            {selectOpen ? (
              <FontAwesomeIcon icon={"angle-down"} />
            ) : (
              <FontAwesomeIcon icon={"angle-up"} />
            )}
          </span>
        </button>
        <Scrollbars
          className="option-container"
          autoHide={false}
          style={{ width: "100%", height: "100px" }}
          renderTrackHorizontal={(props) => (
            <div {...props} style={{ display: "none" }} />
          )}
          renderThumbVertical={({ style, ...props }) => (
            <main
              {...props}
              id="thumb-track"
              style={{
                ...style,
                backgroundColor: "#e9e9e9",
                width: "3px",
                opacity: ".75",
                height: "30px",
              }}
            />
          )}
        >
          <div
            id="option-container"
            className={`w-full absolute ${selectOpen ? "" : "hidden"} `}
          >
            {[...Array<number>(totalCards).keys()]
              .map((n: number) => n + 1)
              .map((n: number) => {
                return (
                  <button
                    className={`w-full text-xs bg-[#141414] hover:bg-[#383838] block ${
                      pinnedTopCardsLookAmount === n ? "text-lime-500" : "text-white"
                    }`}
                    onMouseEnter={(e: BaseSyntheticEvent) => {
                      mouseEnterOption(
                        parseInt(e.target.value),
                        dispatch,
                        setTopCardsLookAmount
                      );
                    }}
                    onMouseLeave={() => {
                      mouseLeaveOption(
                        pinnedTopCardsLookAmount,
                        dispatch,
                        setTopCardsLookAmount
                      );
                    }}
                    onClick={(e: BaseSyntheticEvent) => {
                      optionClick(
                        parseInt(e.target.value),
                        dispatch,
                        setTopCardsLookAmount,
                        setPinnedTopCardsLookAmount
                      );
                    }}
                    value={n}
                    key={n}
                  >
                    {n}
                  </button>
                );
              })}
          </div>
        </Scrollbars>
      </div>
    </React.Fragment>
  );
};

export default CustomSelect;
