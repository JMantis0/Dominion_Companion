import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const HistorySelector = () => {
  const savedGames = useSelector(
    (state: RootState) => state.content.savedGames
  );
  return (
    <React.Fragment>
      <div className={`text-white`}>
        <table className={`text-xs border-2  `}>
          <tbody>
            <tr>
              <th className={`text-xs border-2 text-white`}>Opponent</th>
              <th className={`text-xs border-2 text-white`}>Result</th>
              <th className={`text-xs border-2 text-white`}>Date</th>
            </tr>
            {Object.getOwnPropertyNames(savedGames)
              .filter(
                (savedGame) =>
                  savedGames[savedGame].opponentDeck.opponentName !==
                  "Lord Rattington"
              )
              .map((savedGame: string, idx) => {
                return (
                  <tr key={idx}>
                    <td className={`text-xs border-2 text-white`}>
                      {savedGames[savedGame].opponentDeck.playerName}
                    </td>
                    <td className={`text-xs border-2 text-white`}>
                      {savedGames[savedGame].playerDeck.gameResult}
                    </td>
                    <td className={`text-xs border-2 text-white`}>
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
