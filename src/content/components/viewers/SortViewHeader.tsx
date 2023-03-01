import React from "react";
import SortButton from "./SortButton";

const SortViewHeader = () => {
  return (
    <React.Fragment>
      <div className={"text-xs grid grid-cols-12"}>
        {/* <div className="col-span-1"></div> */}
        <div className="col-span-5 whitespace-nowrap">
          <SortButton title="Card Name" category="card" />
        </div>
        <div className="col-span-2 whitespace-nowrap">
          <SortButton title="Dk #" category="zone" />
        </div>
        {/* <div className="col-span-1 whitespace-nowrap">
          <span>/</span>
        </div> */}
        <div className="col-span-2 whitespace-nowrap">
          <SortButton title="Tot #" category="owned" />
        </div>
        <div className="col-span-3 whitespace-nowrap">
          <SortButton title="Draw%" category="probability" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default SortViewHeader;
