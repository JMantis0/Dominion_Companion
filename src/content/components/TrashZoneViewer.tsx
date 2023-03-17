import React from "react";
import { useSelector } from "react-redux";
import {
  setOpponentTrashSortState,
  setTrashSortState,
} from "../../redux/contentSlice";
import { RootState } from "../../redux/store";
import ZoneViewer from "./ZoneViewer";

const TrashZoneViewer = () => {
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const trashSortState = useSelector(
    (state: RootState) => state.content.trashSortState
  );
  const opponentTrashSortState = useSelector(
    (state: RootState) => state.content.opponentTrashSortState
  );

  return (
    <div className="text-xs outer-shell">
      <div className={`text-white`}>{pd.playerName}'s trash:</div>
      <ZoneViewer
        deck={pd}
        sortButtonState={trashSortState}
        sortDispatchFunc={setTrashSortState}
        title={`Trash`}
        zone={pd.trash}
      />
      <div className={`text-white`}>{od.playerName}'s trash:</div>
      <ZoneViewer
        deck={od}
        sortButtonState={opponentTrashSortState}
        sortDispatchFunc={setOpponentTrashSortState}
        title={`Trash`}
        zone={od.trash}
      />
    </div>
  );
};

export default TrashZoneViewer;
