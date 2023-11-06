import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setGameKeys,
  setSavedGames,
  setModalSwitch,
} from "../../redux/optionsSlice";
import { RootState } from "../../redux/store";
import SavedGameRow from "./SavedGameRow/SavedGameRow";
import HistoryModal from "./HistoryModal/HistoryModal";
import type { SavedGame, SavedGames } from "../../utils";

const HistoryViewer = () => {
  const dispatch = useDispatch();
  const gameKeys = useSelector((state: RootState) => state.options.gameKeys);
  const savedGames = useSelector(
    (state: RootState) => state.options.savedGames
  );
  const modalSwitch = useSelector(
    (state: RootState) => state.options.modalSwitch
  );

  useEffect(() => {
    const storageListenerFunc = (
      changes: {
        [key: string]: chrome.storage.StorageChange;
      },
      namespace: "sync" | "local" | "managed" | "session"
    ) => {
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
      let gameKeys = result.gameKeys;
      await chrome.storage.local.get([...gameKeys]).then((result) => {
        const savedGames = result as SavedGames;

        dispatch(setGameKeys(gameKeys));
        dispatch(setSavedGames(savedGames));
      });
    });
  };

  useEffect(() => {
    if (modalSwitch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [modalSwitch]);

  return (
    <React.Fragment>
      <div
        className={`grid grid-cols-12 text-white  ${
          modalSwitch ? "overflow-hidden bg-[#141414]" : "bg-[#232122]"
        }`}
      >
        <div
          className={`col-span-12 p-8 min-h-screen ${
            modalSwitch ? "brightness-[.3]" : ""
          }`}
        >
          <div className={`text-xs grid grid-cols-12`}>
            <div className={`col-span-12`}>
              <div className="grid grid-cols-12">
                <div className={`col-span-3 text-xs border-2 text-white`}>
                  Game #
                </div>
                <div className={`col-span-2 text-xs border-2 text-white`}>
                  Player (You)
                </div>
                <div className={`col-span-2 text-xs border-2 text-white`}>
                  Opponent
                </div>
                <div className={`col-span-1 text-xs border-2 text-white`}>
                  Result
                </div>
                <div className={`col-span-3 text-xs border-2 text-white`}>
                  Date & Time
                </div>
                <div className={`col-span-1 text-xs border-2 text-white`}>
                  Delete
                </div>
              </div>
              {gameKeys[0] !== undefined ? (
                Object.getOwnPropertyNames(savedGames)
                  // Sort by most recent first.
                  .sort((a, b) => {
                    const gameTitle1 = parseInt(a.split(" ")[1].substring(1));
                    const gameTitle2 = parseInt(b.split(" ")[1].substring(1));
                    return gameTitle2 - gameTitle1;
                  })
                  .map((savedGameTitle: string, idx: number) => {
                    const savedGame: SavedGame = savedGames[savedGameTitle];
                    return (
                      <SavedGameRow key={idx} savedGame={savedGame} idx={idx} />
                    );
                  })
              ) : (
                <div key={-1}>
                  <div>No game history.  Play games with the Dominion Companion extension to begin a history.</div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* This div sits behind the modal and blocks other elements behind the modal from being clicked while the modal is open  
        It also serves as a close button for the modal.*/}
        <div
          className={`${
            modalSwitch ? "" : "hidden"
          } w-[100vw] h-[100vh] fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4`}
          onClick={() => {
            dispatch(setModalSwitch(false));
          }}
        ></div>
        <div
          className={`${
            modalSwitch ? "" : "hidden"
          } w-[80vw] h-[80vh] fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4`}
        >
          <HistoryModal />
        </div>
      </div>
    </React.Fragment>
  );
};

export default HistoryViewer;
