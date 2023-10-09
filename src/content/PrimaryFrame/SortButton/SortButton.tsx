import React, { FunctionComponent } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSortUp,
  faSortDown,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { onSortButtonClick } from "../../../utils/utils";
import type {
  SortButtonState,
  SortCategory,
  SortReducer,
} from "../../../utils";

library.add(faSortUp, faSortDown, faSort);

type SortButtonProps = {
  title: string;
  category: SortCategory;
  /**
   * A reducer from the content slice.
   */
  reducer: SortReducer;
  /**
   * A portion of the redux state from the content slice, one of the SortedButton states.
   */
  currentSortState: SortButtonState;
};

const SortButton: FunctionComponent<SortButtonProps> = ({
  title,
  category,
  reducer,
  currentSortState,
}) => {
  const dispatch = useDispatch();
  return (
    <div>
      <button
        onClick={() => {
          onSortButtonClick(category, currentSortState, dispatch, reducer);
        }}
        className={`w-full border-y border-x hover:bg-[#383838] ${
          currentSortState.category === category
            ? "outline-2 text-lime-500"
            : "text-white"
        }`}
      >
        <div className="grid grid-cols-12 ">
          <div className="col-span-8 text-xs">
            <span>{title}</span>
          </div>
          <div className="col-span-4">
            {
              <React.Fragment>
                {currentSortState.category !== category ? (
                  <FontAwesomeIcon icon={"sort"} />
                ) : currentSortState.sort === "ascending" ? (
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
