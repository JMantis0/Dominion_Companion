import React, { FunctionComponent, useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSortUp,
  faSortDown,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import {
  setDiscardSortState,
  setOpponentSortState,
  setOpponentTrashSortState,
  setSortedButtonsState,
  setTrashSortState,
  SortButtonState,
} from "../../redux/contentSlice";
library.add(faSortUp, faSortDown, faSort);

type SortButtonProps = {
  title: string;
  category: "card" | "zone" | "owned" | "probability";
  /**
   * A reducer from the content slice
   */
  reducer:
    | typeof setSortedButtonsState
    | typeof setDiscardSortState
    | typeof setOpponentSortState
    | typeof setOpponentTrashSortState
    | typeof setTrashSortState;
  /**
   * A portion of the redux state from the content slice, one of the SortedButton states
   * passed from Viewer, to ViewHeader, to SortButton
   */
  reduxState: SortButtonState;
};
const SortButton: FunctionComponent<SortButtonProps> = ({
  title,
  category,
  reducer,
  reduxState,
}) => {
  const [sortState, setSortState] = useState<"ascending" | "descending">(
    "ascending"
  );
  sortState;
  const dispatch = useDispatch();
  useEffect(() => {
    setSortState("ascending");
    return () => {};
  }, []);
  const handleClick = () => {
    let sortToDispatch: "ascending" | "descending";
    if (reduxState.category !== category) {
      sortToDispatch = "ascending";
    } else {
      sortToDispatch =
        reduxState.sort === "ascending" ? "descending" : "ascending";
    }
    dispatch(
      reducer({
        category: category,
        sort: sortToDispatch,
      })
    );
    setSortState(sortToDispatch);
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full border-y border-x hover:outline-1  ${
          reduxState.category === category
            ? "outline-2 text-lime-500"
            : "text-white"
        }`}
      >
        <div className="grid grid-cols-12 ">
          <div className="col-span-9">
            <span>{title}</span>
          </div>
          <div className="col-span-3">
            {
              <React.Fragment>
                {reduxState.category !== category ? (
                  <FontAwesomeIcon icon={"sort"} />
                ) : reduxState.sort === "ascending" ? (
                  <FontAwesomeIcon icon={"sort-down"} />
                ) : (
                  <FontAwesomeIcon icon={"sort-up"} />
                )}
              </React.Fragment>
            }
          </div>
        </div>
      </button>
    </div>
  );
};
export default SortButton;
