import React, {
  BaseSyntheticEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { setTopCardsLookAmount } from "../../../../../redux/contentSlice";
import { AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
library.add(faChevronDown, faAngleDown);
// const selectedClass = "bg-[#1b1b1b] border-[#272727] text-[#dfdfdf]";
// const unselectedClass =
//   "hover:bg-[#1b1b1b] hover:border-[#272727] text-[#aaa] hover:text-[#dfdfdf]";

const toggleSelect = (
  selectState: boolean,
  setSelectOpen: Dispatch<SetStateAction<boolean>>
) => {
  setSelectOpen(!selectState);
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
  setPinnedTopCardsLookAmount: Dispatch<SetStateAction<number>>,
  setSelectOpen: Dispatch<SetStateAction<boolean>>
) => {
  dispatch(setTopCardsLookAmount(cardAmount));
  setPinnedTopCardsLookAmount(cardAmount);
  setSelectOpen(false);
};

export type CustomSelectProps = {
  colSpan: number;
};

const CustomSelect: FunctionComponent<CustomSelectProps> = ({ colSpan }) => {
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const totalCards = useSelector(
    (state: RootState) => state.content.playerDeck.entireDeck.length
  );
  const topCardsLookAmount = useSelector(
    (state: RootState) => state.content.topCardsLookAmount
  );
  const [pinnedTopCardsLookAmount, setPinnedTopCardsLookAmount] =
    useState<number>(topCardsLookAmount);

  // Event Listener added on render and removed on dismount handles the closing of the CustomSelect when a click outside of the options occurs.
  useEffect(() => {
    const nonOptionClick = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      const parent = element.parentElement;
      const parentId = parent === null ? "null" : parent.id;
      if (parentId !== "option-container" && element.id !== "select-button") {
        setSelectOpen(false);
      }
    };
    document.addEventListener("click", nonOptionClick);
    return () => {
      document.removeEventListener("click", nonOptionClick);
    };
  });

  return (
    <React.Fragment>
      <div className={`col-span-${colSpan} relative`}>
        <button
          id="select-button"
          className="w-full whitespace-nowrap grid grid-cols-12 border-y border-x"
          onClick={(e: BaseSyntheticEvent) => {
            toggleSelect(selectOpen, setSelectOpen);
          }}
        >
            <span className="col-span-7 pointer-events-none">Top</span>
            <span className={"col-span-2 text-lime-500 pointer-events-none"}>
              {topCardsLookAmount}
            </span>

            <span className="col-span-3 pointer-events-none">
              <FontAwesomeIcon icon={"angle-down"} />
            </span>
        </button>
        <div
          id="option-container"
          className={`w-full absolute ${selectOpen ? "" : "hidden"} `}
        >
          {[...Array<number>(totalCards).keys()].map((n: number) => {
            return (
              <button
                className={`w-full text-xs bg-[#141414] hover:bg-[#1b1b1b] block ${
                  topCardsLookAmount === n ? "text-lime-500" : "text-white"
                } ${n === 0 ? "hidden" : ""}`}
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
                    setPinnedTopCardsLookAmount,
                    setSelectOpen
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
      </div>
    </React.Fragment>
  );
};

export default CustomSelect;
