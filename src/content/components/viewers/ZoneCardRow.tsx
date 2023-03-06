import React, { FunctionComponent, useEffect, useState } from "react";
import { getRowColor } from "../../utils/utilityFunctions";

type ZoneCardRowProps = {
  cardName: string;
  cardAmountInZone: number;
};
const ZoneCardRow: FunctionComponent<ZoneCardRowProps> = ({
  cardName,
  cardAmountInZone,
}) => {
  const [color, setColor] = useState<string>("text-white");
  useEffect(() => {
    setColor(getRowColor(cardName));
  }, []);
  return (
    <React.Fragment>
      <div
        className={
          "text-xs grid grid-cols-12 last:border border-x even:border-y"
        }
      >
        <div className={`${color} col-span-1`}></div>
        <div className={`${color} col-span-6`}>{cardName}</div>
        <div className={`${color} col-span-1`}></div>
        <div className={`${color} col-span-3`}>{cardAmountInZone}</div>
        <div className={`${color} col-span-1`}></div>
      </div>
    </React.Fragment>
  );
};

export default ZoneCardRow;
