import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWindowMinimize,
  faWindowRestore,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setMinimized } from "../../../redux/contentSlice";
library.add(faWindowMinimize, faWindowRestore);

const baseStyle =
  "absolute -right-0 -top-0 border-[2px] bg-slate-800 w-[25px] h-[25px] ";
const minStyle = "text-green-300 border-green-300 ";
const maxStyle = "text-red-300 border-red-300 ";
const minimizedStyle = baseStyle + minStyle;
const maximizedStyle = baseStyle + maxStyle;

const MinimizeButton = () => {
  const dispatch = useDispatch();
  const minimized = useSelector((state: RootState) => state.content.minimized);

  return (
    <button
      className={minimized ? minimizedStyle : maximizedStyle}
      id="minButton"
      onClick={() => {
        if (!minimized) {
          dispatch(setMinimized(true));
        } else {
          dispatch(setMinimized(false));
        }
      }}
    >
      {minimized ? (
        <FontAwesomeIcon size="2xs" icon="window-restore" />
      ) : (
        <FontAwesomeIcon icon="window-minimize" />
      )}
    </button>
  );
};

export default MinimizeButton;
