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
import $ from "jquery";
library.add(faAngleUp, faAngleDown);

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
    $("#select-scrollbars").append($("#custom-handle"));
    $("#select-scrollbars").resizable({
      handles: { s: $("#custom-handle") },
      // optional callback
      // resize: function (event, ui) {},
    });
    const customHandle = document.getElementById("custom-handle");

    if (
      customHandle !== null &&
      chrome.runtime !== null &&
      chrome.runtime !== undefined
    ) {
      customHandle.setAttribute(
        "style",
        "background-image: url(chrome-extension://" +
          chrome.runtime.id +
          "/ui-icons_ffffff_256x240.png) !important; z-index:90;left:unset;"
      );
    } else {
      console.log("chrome or custom handle not found");
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
          id="select-scrollbars"
          ref={selectScrollRef}
          className={`${selectOpen ? "border-x border-y" : "hidden"}`}
          autoHide={false}
          style={{
            width: "100%",
            height: "100px",
            border: selectOpen ? "1px solid white" : "none",
          }}
          renderView={({ style, ...props }) => {
            return <div id="scrollbars-view" {...props} style={{ ...style }} />;
          }}
          renderTrackHorizontal={(props) => (
            <div {...props} style={{ display: "none" }} />
          )}
          renderTrackVertical={({ style, ...props }) => {
            const finalStyle = {
              ...style,
              width: "9px",
              right: 0,
              bottom: "2px",
              top: "2px",
              borderRadius: "3px",
            };
            return <div style={finalStyle} {...props} />;
          }}
          renderThumbVertical={({ style, ...props }) => (
            <main
              {...props}
              id="thumb-track"
              style={{
                ...style,
                backgroundColor: "#e9e9e9",
                width: "100%",
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
          <main id="option-container" className={`w-[99%] h-[99%] absolute`}>
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
                    <span className="mr-2 pointer-events-none">{n}</span>
                  </button>
                );
              })}
          </main>
          <div
            id="custom-handle"
            // Order of the classes matters.  This gives the functionality of a south handle with
            // the appearance and positioning of a southeast handle.
            className="ui-resizable-handle ui-resizable-s ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se"
            style={{ zIndex: 90, left: "unset" }}
          ></div>
        </Scrollbars>
      </div>
    </React.Fragment>
  );
};

export default CustomSelect;
