import React, { BaseSyntheticEvent, FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setGameDateTitle,
  setGameKeys,
  setLogHtml,
  setModalSwitch,
  setOpponentDecks,
  setPlayerDeck,
  setSelectedRecord,
} from "../../../redux/optionsSlice";
import { RootState } from "../../../redux/store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SavedGame } from "../../../utils";
library.add(faPlay);

type SavedGameRowProps = {
  savedGame: SavedGame;
  idx: number;
};

const selectedClass = "bg-[#1b1b1b] border-[#272727] text-[#dfdfdf]";
const unselectedClass =
  "hover:bg-[#1b1b1b] hover:border-[#272727] text-[#aaa] hover:text-[#dfdfdf]";

const SavedGameRow: FunctionComponent<SavedGameRowProps> = ({
  savedGame,
  idx,
}) => {
  const dispatch = useDispatch();
  const selectedRecord = useSelector(
    (state: RootState) => state.options.selectedRecord
  );

  const handleRecordClick = (e: BaseSyntheticEvent, html: string) => {
    e;
    dispatch(setSelectedRecord(idx));
    dispatch(setLogHtml(html));
    dispatch(setPlayerDeck(savedGame.playerDeck));
    dispatch(setOpponentDecks(savedGame.opponentDecks));
    dispatch(setGameDateTitle(savedGame.dateTime));
    dispatch(setModalSwitch(true));
  };

  const deleteRecord = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    const title = savedGame.playerDeck.gameTitle;
    chrome.storage.local.get(["gameKeys"]).then((result) => {
      const keys = result.gameKeys;
      const indexToRemove = keys.indexOf(title);
      keys.splice(indexToRemove, 1);
      chrome.storage.local.set({ gameKeys: keys });
      dispatch(setGameKeys(keys));
      dispatch(setLogHtml(""));
      chrome.storage.local.remove(title);
    });
  };

  return (
    <React.Fragment>
      <div
        onClick={(e: BaseSyntheticEvent) => {
          handleRecordClick(e, savedGame.logHtml);
        }}
        className={`grid group grid-cols-12 border-b border-[#202020] bg-[#141414] ${
          idx === selectedRecord ? selectedClass : unselectedClass
        } last:border-0`}
        key={idx}
      >
        <div className={"col-span-1 text-xs text-inherit"}>
          <FontAwesomeIcon icon={"play"} />
        </div>
        <div className={"col-span-2 text-xs text-inherit"}>
          {savedGame.playerDeck.gameTitle}
        </div>
        <div className={"col-span-2 text-xs text-inherit"}>
          {savedGame.playerDeck.playerName} <br></br>Rating:{" "}
          {savedGame.playerDeck.rating} <br></br> Final VP:{" "}
          {savedGame.playerDeck.currentVP}
        </div>
        {savedGame.opponentDecks.map((opponentDeck, idx) => {
          return (
            <React.Fragment key={idx}>
              <div className={"col-span-2 text-xs text-inherit"}>
                {opponentDeck.playerName} <br></br>Rating: {opponentDeck.rating}
                <br></br>Final VP: {opponentDeck.currentVP}
              </div>
            </React.Fragment>
          );
        })}
        <div className={"col-span-1 text-xs text-inherit"}>
          {savedGame.playerDeck.gameResult}
        </div>
        <div className={"col-span-3 text-xs text-inherit"}>
          {savedGame.dateTime.substring(4, 24)}
        </div>
        <div className={"col-span-1 text-xs text-inherit"}>
          <button onClick={deleteRecord}>Delete</button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SavedGameRow;
