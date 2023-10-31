import React, { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import PrimaryFrame from "./PrimaryFrame/PrimaryFrame";
import "../assets/tailwind.css";
import "jqueryui";

const DomRoot: FunctionComponent = () => {
  return (
    <div id="domRoot" className="-z-100 relative h-[0px] w-[0px]">
      <Provider store={store}>
        <PrimaryFrame />
      </Provider>
    </div>
  );
};

export default DomRoot;