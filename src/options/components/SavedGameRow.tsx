import React, { BaseSyntheticEvent, FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { SavedGame, setLogHtml } from "../../redux/optionsSlice";

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
  return (
    <tr
      onClick={(e: BaseSyntheticEvent) => {
        handleRecordClick(e, savedGame.logHtml);
      }}
      className="grid grid-cols-12"
      key={idx}
    >
      <td className={`col-span-3 text-xs border-2 text-white`}>
        {savedGame.playerDeck.gameTitle}
      </td>
      <td className={`col-span-3 text-xs border-2 text-white`}>
        {savedGame.opponentDeck.playerName}
      </td>
      <td className={`col-span-3 text-xs border-2 text-white`}>
        {savedGame.playerDeck.gameResult}
      </td>
      <td className={`col-span-3 text-xs border-2 text-white`}>
        {savedGame.dateTime}
      </td>
    </tr>
  );
};

export default SavedGameRow;
