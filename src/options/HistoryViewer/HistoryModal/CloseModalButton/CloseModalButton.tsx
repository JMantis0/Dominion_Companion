import React from "react";

import { setModalSwitch } from "../../../../redux/optionsSlice";
import { useDispatch } from "react-redux";

const CloseModalButton = () => {
  const dispatch = useDispatch();
  return (
    <div className="absolute -top-7 -right-7">
      <button
        onClick={() => {
          dispatch(setModalSwitch(false));
        }}
      >
        <img src={require("./domx.PNG")}></img>
      </button>
    </div>
  );
};

export default CloseModalButton;
