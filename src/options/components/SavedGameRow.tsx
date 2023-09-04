import React, { BaseSyntheticEvent, FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { SavedGame, setGameKeys, setLogHtml } from "../../redux/optionsSlice";

type SavedGameRowProps = {
  savedGame: SavedGame;
  idx: number;
};

const SavedGameRow: FunctionComponent<SavedGameRowProps> = ({
  savedGame,
  idx,
}) => {
  const dispatch = useDispatch();

  const handleRecordClick = (e: BaseSyntheticEvent, html: string) => {
    console.log("handleRecordClick Event", e);
    dispatch(setLogHtml(html));
  };

  const deleteRecord = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    const title = savedGame.playerDeck.gameTitle;
    chrome.storage.local.get(["gameKeys"]).then((result) => {
      console.log("result.gameKeys", result.gameKeys);
      const keys = result.gameKeys;
      const indexToRemove = keys.indexOf(title);
      console.log("Index to remove is", indexToRemove);
      console.log("title is:", title);
      console.log(`keys[${indexToRemove}] is: `, keys[indexToRemove]);
      keys.splice(indexToRemove, 1);
      chrome.storage.local.set({ gameKeys: keys });
      dispatch(setGameKeys(keys));
      dispatch(setLogHtml(""));
      chrome.storage.local.remove(title);
    });
  };

  return (
    <React.Fragment>
      <tr
        onClick={(e: BaseSyntheticEvent) => {
          handleRecordClick(e, savedGame.logHtml);
        }}
        className="grid grid-cols-12"
        key={idx}
      >
        <td className={`col-span-2 text-xs border-2 text-white`}>
          <div>{savedGame.playerDeck.gameTitle}</div>
        </td>
        <td className={`col-span-2 text-xs border-2 text-white`}>
          <div>{savedGame.playerDeck.playerName}</div>
          <div>Rating: {savedGame.playerDeck.rating}</div>
        </td>
        <td className={`col-span-2 text-xs border-2 text-white`}>
          <div>{savedGame.opponentDeck.playerName}</div>
          <div>Rating: {savedGame.opponentDeck.rating}</div>
        </td>
        <td className={`col-span-1 text-xs border-2 text-white`}>
          {savedGame.playerDeck.gameResult}
        </td>
        <td className={`col-span-3 text-xs border-2 text-white`}>
          {savedGame.dateTime}
        </td>
        <td className={`col-span-1 text-xs border-2 text-white`}>
          <button onClick={deleteRecord}>Delete</button>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default SavedGameRow;
