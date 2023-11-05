import React, { FunctionComponent } from "react";

export type ZoneCardRowProps = {
  cardName: string;
  cardAmountInZone: number;
  color: string;
};
const ZoneCardRow: FunctionComponent<ZoneCardRowProps> = ({
  cardName,
  cardAmountInZone,
  color,
}) => {
  return (
    <React.Fragment>
      <div
        className={
          "text-xs grid grid-cols-12 last:border border-x even:border-y pointer-events-none"
        }
      >
        <div className={color + " col-span-1"}></div>
        <div className={color + " col-span-6"}>{cardName}</div>
        <div className={color + " col-span-1"}></div>
        <div className={color + " col-span-3"}>{cardAmountInZone}</div>
        <div className={color + " col-span-1"}></div>
      </div>
    </React.Fragment>
  );
};

export default ZoneCardRow;
