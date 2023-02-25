import React, { FunctionComponent, useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSortedButtonsState } from "../../../redux/contentSlice";
import { RootState } from "../../../redux/store";

library.add(faSortUp, faSortDown);

type SortButtonProps = {
  category: "card" | "zone" | "owned" | "probability";
};
const SortButton: FunctionComponent<SortButtonProps> = ({ category }) => {
  const [sortState, setSortState] = useState<"ascending" | "descending">(
    "ascending"
  );
  sortState;
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setSortState("ascending");
    return () => {};
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="col-span-1">
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
        <div className="col-span-1">
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
        </div>
      </div>
    </div>
  );
};

export default SortButton;
