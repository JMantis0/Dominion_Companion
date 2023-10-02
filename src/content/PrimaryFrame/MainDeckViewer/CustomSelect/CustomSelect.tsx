import React, {
  BaseSyntheticEvent,
  FunctionComponent,
  UIEvent,
  useEffect,
  useRef,
} from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  setPinnedTopCardsLookAmount,
  setSelectOpen,
  setSelectScrollPosition,
  setTopCardsLookAmount,
} from "../../../../redux/contentSlice";
import { Dispatch, AnyAction } from "redux";
import Scrollbars from "react-custom-scrollbars-2";
import {
  onMouseEnterOption,
  onMouseLeaveOption,
  onSelectScroll,
  onOptionClick,
  onToggleSelect,
} from "../../../../utils/utils";
library.add(faAngleUp, faAngleDown);
// const selectedClass = "bg-[#1b1b1b] border-[#272727] text-[#dfdfdf]";
// const unselectedClass =
//   "hover:bg-[#1b1b1b] hover:border-[#272727] text-[#aaa] hover:text-[#dfdfdf]";



export type CustomSelectProps = {
  colSpan: number;
};

const CustomSelect: FunctionComponent<CustomSelectProps> = ({ colSpan }) => {
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const selectOpen = useSelector(
    (state: RootState) => state.content.selectOpen
  );
  const totalCards = useSelector(
    (state: RootState) =>
      state.content.playerDeck.library.length +
      state.content.playerDeck.graveyard.length
  );
  const topCardsLookAmount = useSelector(
    (state: RootState) => state.content.topCardsLookAmount
  );
  const pinnedTopCardsLookAmount = useSelector(
    (state: RootState) => state.content.pinnedTopCardsLookAmount
  );
  const selectScrollPosition = useSelector(
    (state: RootState) => state.content.selectScrollPosition
  );
  const selectScrollRef = useRef<Scrollbars>(null);

  // On any render, the scroll  position is set to whatever value was previously set to the redux variable selectScrollPosition
  useEffect(() => {
    if (selectScrollRef.current !== undefined && selectScrollRef.current) {
      selectScrollRef.current!.scrollTop(selectScrollPosition);
    }
  }, []);

  return (
    <React.Fragment>
      <div className={`col-span-${colSpan} relative`}>
        <button
          id="select-button"
          className="w-full whitespace-nowrap grid grid-cols-12 border-y border-x text-white text-xs hover:bg-[#383838]"
          onClick={() => {
            onToggleSelect(selectOpen, dispatch, setSelectOpen);
          }}
        >
          <span className="col-span-1"></span>{" "}
          <span className="col-span-6 pointer-events-none">Top</span>
          {/* <br className="pointer-events-none"></br> */}
          <span
            className={`col-span-5 ${
              pinnedTopCardsLookAmount === topCardsLookAmount
                ? "text-lime-500"
                : "text-white"
            }  pointer-events-none`}
          >
            {topCardsLookAmount}
          </span>
          <span className="col-span-12 pointer-events-none">
            {selectOpen ? (
              <FontAwesomeIcon icon={"angle-down"} />
            ) : (
              <FontAwesomeIcon icon={"angle-up"} />
            )}
          </span>
        </button>
        <Scrollbars
          ref={selectScrollRef}
          className={`${selectOpen ? "border-x border-y" : ""}`}
          autoHide={false}
          style={{
            width: "100%",
            height: "100px",
            border: selectOpen ? "1px solid white" : "none",
          }}
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
                width: "90%",
                opacity: ".75",
                height: "10px",
                left: "20%",
              }}
            />
          )}
          onScroll={(e: UIEvent) => {
            const element = e.target as HTMLElement;
            const selectScrollPosition = element.scrollTop;
            onSelectScroll(
              selectScrollPosition,
              dispatch,
              setSelectScrollPosition
            );
          }}
        >
          <main
            id="option-container"
            className={`w-[99%] h-[99%] absolute ${selectOpen ? "" : "hidden"}`}
          >
            {[...Array<number>(totalCards).keys()]
              .map((n: number) => n + 1)
              .map((n: number) => {
                return (
                  <button
                    className={`w-full text-xs bg-[#141414] hover:bg-[#383838] block ${
                      pinnedTopCardsLookAmount === n
                        ? "text-lime-500"
                        : "text-white"
                    }`}
                    onMouseEnter={(e: BaseSyntheticEvent) => {
                      onMouseEnterOption(
                        parseInt(e.target.value),
                        dispatch,
                        setTopCardsLookAmount
                      );
                    }}
                    onMouseLeave={() => {
                      onMouseLeaveOption(
                        pinnedTopCardsLookAmount,
                        dispatch,
                        setTopCardsLookAmount
                      );
                    }}
                    onClick={(e: BaseSyntheticEvent) => {
                      onOptionClick(
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
          </main>
        </Scrollbars>
      </div>
    </React.Fragment>
  );
};

export default CustomSelect;
