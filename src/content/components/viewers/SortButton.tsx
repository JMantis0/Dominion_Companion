import React, { FunctionComponent, useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSortUp,
  faSortDown,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSortedButtonsState } from "../../../redux/contentSlice";
import { RootState } from "../../../redux/store";

library.add(faSortUp, faSortDown, faSort);

type SortButtonProps = {
  title: string;
  category: "card" | "zone" | "owned" | "probability";
};
const SortButton: FunctionComponent<SortButtonProps> = ({
  title,
  category,
}) => {
  const [sortState, setSortState] = useState<"ascending" | "descending">(
    "ascending"
  );
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setSortState("ascending");
    return () => {};
  }, []);

  const handleClick = () => {
    let sortToDispatch: "ascending" | "descending";
    if (sortButtonState.category !== category) {
      sortToDispatch = "ascending";
    } else {
      sortToDispatch =
        sortButtonState.sort === "ascending" ? "descending" : "ascending";
    }
    dispatch(
      setSortedButtonsState({
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
          sortButtonState.category === category
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
                {sortButtonState.category !== category ? (
                  <FontAwesomeIcon icon={"sort"} />
                ) : sortButtonState.sort === "ascending" ? (
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
