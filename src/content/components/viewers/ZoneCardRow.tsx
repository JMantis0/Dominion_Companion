import React, { FunctionComponent } from "react";

type ZoneCardRowProps = {
  cardName: string;
  cardAmountInZone: number;
  cardAmountOwned: number;
};

const ZoneCardRow: FunctionComponent<ZoneCardRowProps> = ({
  cardName,
  cardAmountInZone,
  cardAmountOwned,
}) => {
  return (
    <React.Fragment>
      <div className="col-span-1"></div>
      <div className="col-span-6">{cardName}</div>
      <div className="col-span-1"></div>
      <div className="col-span-3">{cardAmountInZone}</div>
      {/* <div className="col-span-3">{cardAmountOwned}</div> */}
      <div className="col-span-1"></div>
    </React.Fragment>
  );
};

export default ZoneCardRow;
