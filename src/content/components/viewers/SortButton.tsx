import React, { FunctionComponent, useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown19,
  faArrowUp91,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSortedButtonsState } from "../../../redux/contentSlice";
import { RootState } from "../../../redux/store";

library.add(faArrowDown19, faArrowUp91, faSortUp, faSortDown);

type SortButtonProps = {
  category: "card" | "deck" | "owned" | "probability";
};
const SortButton: FunctionComponent<SortButtonProps> = ({ category }) => {
  const [sortState, setSortState] = useState<"ascending" | "descending">(
    "ascending"
  );
  sortState; //removes ts error
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setSortState("ascending");
    return () => {};
  }, []);

  useEffect(() => {
    // check and make this selected if state says so
    if (category === sortButtonState.category) {
      console.log("sort button state changed", sortButtonState.category);
    }
  }, [sortButtonState]);

  return (
    <div>
      {/* <button
        className={`outline hover:outline-2 rounded focus:ring ${
          sortButtonState.category === category
            ? "bg-slate-500 outline-2"
            : "bg-slate-300"
        }`}
        onClick={() => {
          dispatch(
            setSortedButtonsState({
              category: category,
              sort: sortState === "ascending" ? "descending" : "ascending",
            })
          );
          setSortState(sortState === "ascending" ? "descending" : "ascending");
        }}
      >
        {sortState === "ascending" ? (
          <FontAwesomeIcon icon={"arrow-up-9-1"} />
        ) : (
          <FontAwesomeIcon icon={"arrow-down-1-9"} />
        )}
      </button> */}
      <button
        onClick={() => {
          dispatch(
            setSortedButtonsState({
              category: category,
              sort: "ascending",
            })
          );
          setSortState("ascending");
        }}
        className={`outline hover:outline-2 rounded focus:ring ${
          sortButtonState.category === category &&
          sortButtonState.sort === "ascending"
            ? "bg-slate-500 outline-2"
            : "bg-slate-300"
        }`}
      >
        <FontAwesomeIcon icon={"sort-up"} />
      </button>
      <button
        onClick={() => {
          dispatch(
            setSortedButtonsState({
              category: category,
              sort: "descending",
            })
          );
          setSortState("descending");
        }}
        className={`outline hover:outline-2 rounded focus:ring ${
          sortButtonState.category === category &&
          sortButtonState.sort === "descending"
            ? "bg-slate-500 outline-2"
            : "bg-slate-300"
        }`}
      >
        <FontAwesomeIcon icon={"sort-down"} />
      </button>
    </div>
  );
};

export default SortButton;
