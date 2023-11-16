import React, { FunctionComponent, useEffect } from "react";
import PrimaryFrame from "./PrimaryFrame/PrimaryFrame";
import "../assets/tailwind.css";
import "jqueryui";
import { DOMObserver } from "../utils/DOMObserver";

const DomRoot: FunctionComponent = () => {
  useEffect(() => {
    DOMObserver.initInterval = setInterval(
      DOMObserver.initIntervalCallback,
      1000
    );
    return () => {
      clearInterval(DOMObserver.initInterval);
      clearInterval(DOMObserver.resetInterval);
    };
  }, []);
  return (
    <div id="domRoot" className="-z-100 relative h-[0px] w-[0px]">
      <PrimaryFrame />
    </div>
  );
};

export default DomRoot;
