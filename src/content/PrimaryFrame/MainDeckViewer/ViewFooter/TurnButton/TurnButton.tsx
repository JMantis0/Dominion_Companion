import React, { BaseSyntheticEvent, Dispatch, FunctionComponent } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import {
  setPinnedTurnToggleButton,
  setTurnToggleButton,
} from "../../../../../redux/contentSlice";

library.add(faCircle);

const mouseLeaveTurnButton = (
  pinnedTurnButton: "Current" | "Next",
  dispatch: Dispatch<AnyAction>,
  setTurn: ActionCreatorWithPayload<
    "Current" | "Next",
    "content/setTurnToggleButton"
  >
) => {
  dispatch(setTurn(pinnedTurnButton));
};

const mouseEnterTurnButton = (
  buttonName: "Current" | "Next",
  dispatch: Dispatch<AnyAction>,
  setTurnToggleButton: ActionCreatorWithPayload<
    "Current" | "Next",
    "content/setTurnToggleButton"
  >
) => {
  dispatch(setTurnToggleButton(buttonName));
};

const turnToggleButtonClick = (
  buttonName: "Current" | "Next",
  dispatch: Dispatch<AnyAction>,
  setPinnedTurnToggleButton: ActionCreatorWithPayload<
    "Current" | "Next",
    "content/setPinnedTurnToggleButton"
  >,
  setTurnToggleButton: ActionCreatorWithPayload<
    "Current" | "Next",
    "content/setTurnToggleButton"
  >
) => {
  dispatch(setPinnedTurnToggleButton(buttonName));
  dispatch(setTurnToggleButton(buttonName));
};

type TurnButtonProps = {
  buttonName: "Next" | "Current";
};

const TurnButton: FunctionComponent<TurnButtonProps> = ({ buttonName }) => {
  const dispatch = useDispatch();
  const libraryLength = useSelector(
    (state: RootState) => state.content.playerDeck.library.length
  );
  const topCardsLookAmount = useSelector(
    (state: RootState) => state.content.topCardsLookAmount
  );
  const pinnedTurnToggleButton = useSelector(
    (state: RootState) => state.content.pinnedTurnToggleButton
  );

  return (
    <button
      className={`w-full h-[42px] border-x border-y whitespace-nowrap text-xs relative ${
        pinnedTurnToggleButton === buttonName ? "text-lime-500" : "text-white"
      }
        hover:bg-[#383838] ${
          buttonName === "Next" &&
          libraryLength < 5 &&
          topCardsLookAmount > libraryLength
            ? "nextTurnDifferent"
            : ""
        }`}
      name={buttonName}
      onMouseEnter={(e: BaseSyntheticEvent) => {
        const buttonName = e.target.name;
        mouseEnterTurnButton(buttonName, dispatch, setTurnToggleButton);
      }}
      onMouseLeave={() => {
        mouseLeaveTurnButton(
          pinnedTurnToggleButton,
          dispatch,
          setTurnToggleButton
        );
      }}
      onClick={(e: BaseSyntheticEvent) => {
        const buttonName = e.target.name;
        turnToggleButtonClick(
          buttonName,
          dispatch,
          setPinnedTurnToggleButton,
          setTurnToggleButton
        );
      }}
    >
      {buttonName === "Next" &&
      libraryLength < 5 &&
      topCardsLookAmount > libraryLength ? (
        <FontAwesomeIcon
        className="absolute top-0 right-0"
          icon="circle"
          size="xs"
          style={{ color: "#ff0000" }}
        />
      ) : null}
      <span className="pointer-events-none">
        {buttonName === "Current" ? "This" : "Next"}
      </span>
      <br className="pointer-events-none"></br>
      <span className="pointer-events-none">Turn</span>
    </button>
  );
};

export default TurnButton;
