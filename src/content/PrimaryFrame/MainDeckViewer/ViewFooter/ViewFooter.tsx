import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const ViewFooter = () => {
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  return (
    <main
      className={`text-xs grid grid-cols-10 border-2 col-span-10 pointer-events-none`}
    >
      <div className={`text-white col-span-3 pl-1 whitespace-nowrap`}>
        Totals
      </div>
      <div className={`text-white align-center  col-span-4 text-center whitespace-nowrap`}>
        {pd.library.length} / {pd.entireDeck.length}
      </div>
    
    </main>
  );
};

export default ViewFooter;
