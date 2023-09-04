import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  setGameKeys,
  SavedGame,
  setSavedGames,
} from "../../redux/optionsSlice";
import { RootState } from "../../redux/store";
import LogViewer from "./LogViewer";
import SavedGameRow from "./SavedGameRow";

const HistorySelector = () => {
  const dispatch = useDispatch();
  const gameKeys = useSelector((state: RootState) => state.options.gameKeys);
  const html = useSelector((state: RootState) => state.options.logHtml);
  const savedGames = useSelector(
    (state: RootState) => state.options.savedGames
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

  useEffect(() => {
    const storageListenerFunc = (
      changes: {
        [key: string]: chrome.storage.StorageChange;
      },
      namespace: "sync" | "local" | "managed" | "session"
    ) => {
      console.log("storageListener triggering getSavedGames()");
      namespace;
      changes;
      getSavedGames();
    };
    getSavedGames();
    chrome.storage.onChanged.addListener(storageListenerFunc);
    return () => {
      chrome.storage.onChanged.removeListener(storageListenerFunc);
    };
  }, []);

  const getSavedGames = () => {
    chrome.storage.local.get(["gameKeys"]).then(async (result) => {
      console.log("result of get", result);

      let gameKeys = result.gameKeys;
      await chrome.storage.local.get([...gameKeys]).then((result) => {
        console.log("should be every game saved in storage", result);
        console.log(
          "should be every game saved in storage",
          JSON.stringify(result)
        );
        console.log("should be every game saved in storage");
        dispatch(setGameKeys(gameKeys));
        dispatch(setSavedGames(result));
      });
    });
  };

  useEffect(() => {
    console.log("savedGames updated", savedGames);
    console.log("gameKeys updated", gameKeys);
  }, [savedGames, gameKeys]);

  return (
    <React.Fragment>
      <div className={`grid grid-cols-12  text-white bg-black/[.85]`}>
        <div id="left-container" className={`col-span-6 p-8`}>
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
                <th className={`col-span-2 text-xs border-2 text-white`}>
                  Game #
                </th>
                <th className={`col-span-2 text-xs border-2 text-white`}>
                  Player (You)
                </th>
                <th className={`col-span-2 text-xs border-2 text-white`}>
                  Opponent
                </th>
                <th className={`col-span-1 text-xs border-2 text-white`}>
                  Result
                </th>
                <th className={`col-span-3 text-xs border-2 text-white`}>
                  Date
                </th>
                <th className={`col-span-1 text-xs border-2 text-white`}>
                  Delete
                </th>
              </tr>
              {gameKeys[0] !== undefined ? (
                Object.getOwnPropertyNames(savedGames)
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
                  .map((savedGameTitle: string, idx: number) => {
                    const savedGame: SavedGame = savedGames[savedGameTitle];
                    return (
                      <SavedGameRow key={idx} savedGame={savedGame} idx={idx} />
                    );
                  })
              ) : (
                <tr key={-1}>
                  <td>no saved games</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div id="right-container" className={`col-span-6 p-8`}>
          <LogViewer logHtml={html} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default HistorySelector;
