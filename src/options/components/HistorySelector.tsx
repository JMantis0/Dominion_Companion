import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { SavedGame, setSavedGames } from "../../redux/contentSlice";
import { RootState } from "../../redux/store";
import LogViewer from "./LogViewer";

const HistorySelector = () => {
  const dispatch = useDispatch();
  const [gameKeys, setGameKeys] = useState<string[]>([]);
  const [logHtmlState, setLogHtmlState] = useState<string>("");
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

  useEffect(() => {
    const storageListenerFunc = (
      changes: {
        [key: string]: chrome.storage.StorageChange;
      },
      namespace: "sync" | "local" | "managed" | "session"
    ) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`
        );
      }
      console.log("storageListener triggering getSavedGames()");

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
      if (gameKeys !== undefined && gameKeys[0] !== undefined) {
        await chrome.storage.local.get([...gameKeys]).then((result) => {
          console.log("should be every game saved in storage", result);
          console.log(
            "should be every game saved in storage",
            JSON.stringify(result)
          );
          console.log("should be every game saved in storage");
          dispatch(setSavedGames(result));
        });

        setGameKeys(gameKeys);
      } else {
        console.log("no game keys in storage");
      }
    });
  };

  const handleRecordClick = (e: BaseSyntheticEvent, html: string) => {
    console.log("handleRecordClick Event", e);
    setLogHtmlState(html);
  };

  useEffect(() => {
    console.log("savedGames updated", savedGames);
    console.log("gameKeys updated", gameKeys);
  }, [savedGames, gameKeys]);

  return (
    <React.Fragment>
      <div>Update Worked4</div>
      <div className={`text-white bg-black/[.85]`}>
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
                .map((savedGameTitle: string, idx) => {
                  const savedGame: SavedGame = savedGames[savedGameTitle];
                  return (
                    <React.Fragment>
                      <tr
                        onClick={(e: BaseSyntheticEvent) => {
                          handleRecordClick(e, savedGame.logHtml);
                          console.log(logHtmlState);
                        }}
                        className="grid grid-cols-12"
                        key={idx}
                      >
                        <td
                          className={`col-span-3 text-xs border-2 text-white`}
                        >
                          {savedGameTitle}
                        </td>
                        <td
                          className={`col-span-3 text-xs border-2 text-white`}
                        >
                          {savedGame.opponentDeck.playerName}
                        </td>
                        <td
                          className={`col-span-3 text-xs border-2 text-white`}
                        >
                          {savedGame.playerDeck.gameResult}
                        </td>
                        <td
                          className={`col-span-3 text-xs border-2 text-white`}
                        >
                          {savedGame.dateTime}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
            ) : (
              <td>no saved games</td>
            )}
          </tbody>
        </table>
        <LogViewer logHtml={logHtmlState} />
      </div>
    </React.Fragment>
  );
};

export default HistorySelector;
