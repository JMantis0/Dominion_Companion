import React from "react";
import SortButton from "./SortButton";

const SortViewHeader = () => {
  return (
    <React.Fragment>
      <div className={"text-xs grid grid-cols-12"}>
        <div className="col-span-5 whitespace-nowrap">
          <SortButton title="Card" category="card" />
        </div>
        <div className="col-span-2 whitespace-nowrap">
          <SortButton title="D #" category="zone" />
        </div>
    
        <div className="col-span-2 whitespace-nowrap">
          <SortButton title="T #" category="owned" />
        </div>
        <div className="col-span-3 whitespace-nowrap">
          <SortButton title="Drw%" category="probability" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default SortViewHeader;
