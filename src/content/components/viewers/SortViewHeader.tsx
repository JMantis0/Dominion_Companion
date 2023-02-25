import React from "react";
import SortButton from "./SortButton";

const SortViewHeader = () => {
  return (
    <React.Fragment>
      <div className="col-span-1"></div>
      <div className="col-span-3">
        <span>Card</span>
        <SortButton category="card" />
      </div>
      <div className="col-span-2">
        <span>Deck</span>
        <SortButton category="zone" />
      </div>
      <div className="col-span-1">
        <span>/</span>
      </div>
      <div className="col-span-2">
        <span>Owned</span>
        <SortButton category="owned" />
      </div>
      <div className="col-span-2 whitespace-nowrap">
        Prbl % <SortButton category="probability" />
      </div>
      <div className="col-span-1"></div>
    </React.Fragment>
  );
};

export default SortViewHeader;
