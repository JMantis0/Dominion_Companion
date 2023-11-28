import React from "react";
import { useSelector } from "react-redux";
import {
  setOpponentTrashSortState,
  setTrashSortState,
} from "../../../redux/contentSlice";
import { RootState } from "../../../redux/store";
import ZoneViewer from "../ZoneViewer/ZoneViewer";

const TrashZoneViewer = () => {
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const ods = useSelector((state: RootState) => state.content.opponentDecks);
  const trashSortState = useSelector(
    (state: RootState) => state.content.trashSortState
  );
  const opponentTrashSortState = useSelector(
    (state: RootState) => state.content.opponentTrashSortState
  );

  return (
    <div className="text-xs outer-shell">
      <div className={"text-white pointer-events-none"}>
        {pd.playerName}&apos;s trash:
      </div>
      <ZoneViewer
        deck={pd}
        sortButtonState={trashSortState}
        sortDispatchFunc={setTrashSortState}
        title={"Trash"}
        zone={pd.trash}
      />
      {ods.map((od, idx) => {
        return (
          <React.Fragment key={idx}>
            <div className={"text-white pointer-events-none"}>
              {od.playerName}&apos;s trash:
            </div>
            <ZoneViewer
              deck={od}
              sortButtonState={opponentTrashSortState}
              sortDispatchFunc={setOpponentTrashSortState}
              title={"Trash"}
              zone={od.trash}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TrashZoneViewer;
