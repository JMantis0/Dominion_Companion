import React, { FunctionComponent, SetStateAction } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSortUp,
  faSortDown,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onSortButtonClick } from "../../../utils/utils";
import type { SortButtonState, SortCategory } from "../../../utils";

library.add(faSortUp, faSortDown, faSort);

type SortButtonProps = {
  title: string;
  category: SortCategory;
  currentSortState: SortButtonState;
  setSortButtonState: React.Dispatch<SetStateAction<SortButtonState>>;
};

const SortButton: FunctionComponent<SortButtonProps> = ({
  title,
  category,
  currentSortState,
  setSortButtonState,
}) => {
  return (
    <div>
      <button
        onClick={() => {
          onSortButtonClick(category, currentSortState, setSortButtonState);
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
