import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import HistorySelector from "./HistorySelector";
import ZoneViewer from "./ZoneViewer";

const SavedGameViewer = () => {
  const savedGames = useSelector(
    (state: RootState) => state.content.savedGames
  );

  return (
    <React.Fragment>
      <div>SavedGameViewer</div>

      <div>Games Played</div>
      <HistorySelector />
    </React.Fragment>
  );
};

export default SavedGameViewer;
