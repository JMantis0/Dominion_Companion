import React from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
import HistorySelector from "./HistorySelector";
// import ZoneViewer from "../../content/components/ZoneViewer"; 

const SavedGameViewer = () => {
  // const savedGames = useSelector(
    // (state: RootState) => state.content.savedGames
  // );

  return (
    <React.Fragment>
      <HistorySelector />
    </React.Fragment>
  );
};

export default SavedGameViewer;
