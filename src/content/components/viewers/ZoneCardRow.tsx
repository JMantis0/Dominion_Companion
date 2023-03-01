import React, { FunctionComponent } from "react";

type ZoneCardRowProps = {
  cardName: string;
  cardAmountInZone: number;
};

const ZoneCardRow: FunctionComponent<ZoneCardRowProps> = ({
  cardName,
  cardAmountInZone,
}) => {
  return (
    <React.Fragment>
      <div
        className={
          "text-xs grid grid-cols-12 last:border border-x even:border-y"
        }
      >
        <div className="text-white col-span-1"></div>
        <div className="text-white col-span-6">{cardName}</div>
        <div className="text-white col-span-1"></div>
        <div className="text-white col-span-3">{cardAmountInZone}</div>
        <div className="text-white col-span-1"></div>
      </div>
    </React.Fragment>
  );
};

export default ZoneCardRow;
