import React, {
  BaseSyntheticEvent,
  FunctionComponent,
  UIEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleUp,
  faAngleDown,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  setPinnedTopCardsLookAmount,
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
  useJQueryResizable,
  customSelectResizableHandles,
} from "../../../../utils/utils";
library.add(faAngleUp, faAngleDown, faCircle);

export type CustomSelectProps = {
  colSpan: number;
};

const CustomSelect: FunctionComponent<CustomSelectProps> = ({ colSpan }) => {
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const entireDeckLength = useSelector(
    (state: RootState) => state.content.playerDeck.entireDeck.length
  );
  const libraryLength = useSelector(
    (state: RootState) => state.content.playerDeck.library.length
  );
  const topCardsLookAmount = useSelector(
    (state: RootState) => state.content.topCardsLookAmount
  );
  const pinnedTopCardsLookAmount = useSelector(
    (state: RootState) => state.content.pinnedTopCardsLookAmount
  );
  // Used to get the options container height.
  const optionsContainerRef = useRef<HTMLElement>(null);
  // Used to limit the height of the dropdown.
  const [maxScrollBarHeight, setMaxScrollBarHeight] = useState<number>(0);
  const [selectOpen, setSelectOpen] = useState<boolean>(true);

  console.log("Rendering select");
  const handles = useMemo(() => customSelectResizableHandles(), []);
  useJQueryResizable(document.getElementById("select-scrollbars"), handles);

  useEffect(() => {
    const optionsContainerHeight = optionsContainerRef.current!.offsetHeight;
    setMaxScrollBarHeight(optionsContainerHeight);
  }, [entireDeckLength, selectOpen]);

  return (
    <React.Fragment>
      <div className={`col-span-${colSpan} relative`}>
        <button
          id="select-button"
          className="w-full whitespace-nowrap grid grid-cols-12 border-y border-x text-white text-xs hover:bg-[#383838]"
          onClick={() => {
            onToggleSelect(selectOpen, setSelectOpen);
          }}
        >
          <span className="col-span-1"></span>{" "}
          <span className="col-span-6 pointer-events-none">Top</span>
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
          className={`${selectOpen ? "border-x border-y" : "hidden"}`}
          autoHide={false}
          style={{
            width: "100%",
            height: "100px",
            border: selectOpen ? "1px solid white" : "none",
            maxHeight: selectOpen ? maxScrollBarHeight : "unset",
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
          <main
            id="option-container"
            className={"w-[99%] absolute"}
            ref={optionsContainerRef}
          >
            {[...Array<number>(entireDeckLength).keys()]
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
                    <span className="mr-2 pointer-events-none whitespace-nowrap">
                      {n}{" "}
                      <FontAwesomeIcon
                        icon="circle"
                        size="xs"
                        style={{
                          color: n > libraryLength ? "#ff0000" : "transparent",
                          height: "5px",
                          marginBottom: "2.5px",
                        }}
                      />
                    </span>
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
