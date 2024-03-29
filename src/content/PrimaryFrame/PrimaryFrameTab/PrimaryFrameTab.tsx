import React, { BaseSyntheticEvent, FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setPinnedPrimaryFrameTab,
  setPrimaryFrameTab,
} from "../../../redux/contentSlice";
import {
  onPrimaryFrameTabClick,
  onPrimaryFrameTabMouseEnter,
  onPrimaryFrameTabMouseLeave,
} from "../../../utils/utils";
import type { PrimaryFrameTabType } from "../../../utils";

type PrimaryFrameTabProps = {
  title: PrimaryFrameTabType;
  count: number;
  colSpan: number;
  position: "Top" | "Bottom";
};

const PrimaryFrameTab: FunctionComponent<PrimaryFrameTabProps> = ({
  title,
  count,
  colSpan,
  position,
}) => {
  const dispatch = useDispatch();
  const selectedTab = useSelector(
    (state: RootState) => state.content.primaryFrameTab
  );
  const pinnedTab = useSelector(
    (state: RootState) => state.content.pinnedPrimaryFrameTab
  );
  const selected = position === "Top" ? "border-b-0" : "border-t-0";
  const unSelected = position === "Top" ? "border-b-2" : "border-t-2";
  return (
    <button
      role="button"
      className={`col-span-${colSpan} border-box h-full text-xs whitespace-nowrap w-full border-x ${
        selectedTab === title ? selected : unSelected
      } ${pinnedTab === title ? "text-lime-500" : null}`}
      onClick={(e: BaseSyntheticEvent) => {
        const tabName = e.target.name;
        onPrimaryFrameTabClick(
          tabName,
          dispatch,
          setPrimaryFrameTab,
          setPinnedPrimaryFrameTab
        );
      }}
      onMouseEnter={(e: BaseSyntheticEvent) => {
        const tabName = e.target.name;
        onPrimaryFrameTabMouseEnter(tabName, dispatch, setPrimaryFrameTab);
      }}
      onMouseLeave={() => {
        onPrimaryFrameTabMouseLeave(pinnedTab, dispatch, setPrimaryFrameTab);
      }}
      name={title}
    >
      {title} {count}
    </button>
  );
};

export default PrimaryFrameTab;
