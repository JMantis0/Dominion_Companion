import React, { FunctionComponent } from "react";
import HistoryDeckViewer from "./HistoryDeckViewer/HistoryDeckViewer";
import LogViewer from "../LogViewer/LogViewer";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import CloseModalButton from "./CloseModalButton/CloseModalButton";

const HistoryModal: FunctionComponent = () => {
  const pd = useSelector((state: RootState) => state.options.playerDeck);
  const od = useSelector((state: RootState) => state.options.opponentDeck);
  const gameDateTitle = useSelector(
    (state: RootState) => state.options.gameDateTitle
  );
  return (
    <React.Fragment>
      <div id="modal" className="backdrop-blur-sm bg-[#232122] grid grid-cols-12 h-[80vh]">
        <CloseModalButton />
        <div className={"col-span-8 grid grid-cols-12"}>
          <div className="col-span-12">
            <h4 className="text-center">
              {pd.playerName} vs. {od.playerName}
            </h4>
            <h6 className="text-center">{pd.gameTitle}</h6>
            <h6 className="text-center">{gameDateTitle.substring(4, 24)}</h6>
          </div>
          <div className="col-span-6 h-[80vh] m-auto">
            <HistoryDeckViewer deck={pd} />
          </div>
          {/* Spot for opponent deck */}
          <div className="col-span-6 h-[80vh] m-auto">
            <HistoryDeckViewer deck={od} />
          </div>
        </div>
        <div className="col-span-4 h-[80vh]">
          <LogViewer />
        </div>
      </div>
    </React.Fragment>
  );
};

export default HistoryModal;
