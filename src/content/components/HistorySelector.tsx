import React, { BaseSyntheticEvent, useState } from "react";
import { useSelector } from "react-redux";
import { SavedGame } from "../../redux/contentSlice";
import { RootState } from "../../redux/store";

const HistorySelector = () => {
  const savedGames = useSelector(
    (state: RootState) => state.content.savedGames
  );
  const [opponentInputState, setOpponentInputState] = useState<string>("");
  const [resultInputState, setResultInputState] = useState<string>("");
  const [dateTimeInputState, setDateTimeInputState] = useState<string>("");

  const handleOpponentInputChange = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setOpponentInputState(e.target.value);
  };
  const handleResultInputChange = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setResultInputState(e.target.value);
  };
  const handleDateTimeInputChange = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setDateTimeInputState(e.target.value);
  };

  return (
    <React.Fragment>
      <div className={`text-white`}>
        <table className={`text-xs border-2 grid grid-cols-12 `}>
          <tbody className={`col-span-12`}>
            <tr className="grid grid-cols-12">
              <th className="text-black col-span-4">
                <input
                  value={opponentInputState}
                  placeholder="Filter Opponent"
                  onChange={handleOpponentInputChange}
                />
              </th>
              <th className="text-black col-span-4">
                <input
                  value={resultInputState}
                  placeholder="Filter Result"
                  onChange={handleResultInputChange}
                />
              </th>
              <th className="text-black col-span-4">
                <input
                  value={dateTimeInputState}
                  placeholder="Filter DateTime"
                  onChange={handleDateTimeInputChange}
                />
              </th>
            </tr>
            <tr className="grid grid-cols-12">
              <th className={`col-span-4 text-xs border-2 text-white`}>
                Opponent
              </th>
              <th className={`col-span-4 text-xs border-2 text-white`}>
                Result
              </th>
              <th className={`col-span-4 text-xs border-2 text-white`}>Date</th>
            </tr>
            {Object.getOwnPropertyNames(savedGames)
              .filter((savedGame: string) => {
                let game: SavedGame = savedGames[savedGame];
                return game.opponentDeck.playerName.match(
                  new RegExp(opponentInputState)
                );
              })
              .filter((savedGame: string) => {
                let game: SavedGame = savedGames[savedGame];
                return game.playerDeck.gameResult.match(
                  new RegExp(resultInputState)
                );
              })
              .filter((savedGame: string) => {
                let game: SavedGame = savedGames[savedGame];
                return game.dateTime.match(new RegExp(dateTimeInputState));
              })
              .map((savedGame: string, idx) => {
                return (
                  <tr className="grid grid-cols-12" key={idx}>
                    <td className={`col-span-4 text-xs border-2 text-white`}>
                      {savedGames[savedGame].opponentDeck.playerName}
                    </td>
                    <td className={`col-span-4 text-xs border-2 text-white`}>
                      {savedGames[savedGame].playerDeck.gameResult}
                    </td>
                    <td className={`col-span-4 text-xs border-2 text-white`}>
                      {savedGames[savedGame].dateTime}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default HistorySelector;
