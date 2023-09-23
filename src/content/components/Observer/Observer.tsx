import React, { FunctionComponent, useEffect } from "react";
import { Deck } from "../../../model/deck";
import {
  areNewLogsToSend,
  arePlayerInfoElementsPresent,
  baseKingdomCardCheck,
  createPlayerDecks,
  getGameLog,
  getKingdom,
  getPlayerAndOpponentNameByComparingElementPosition,
  getPlayerInfoElements,
  getPlayerNameAbbreviations,
  getPlayerRatings,
  getRatedGameBoolean,
  getUndispatchedLogs,
  isGameLogPresent,
  isKingdomElementPresent,
} from "./observerFunctions";
import {
  setOpponentDeck,
  setPlayerDeck,
  setGameActiveStatus,
  setSavedGames,
  SavedGame,
  setBaseOnly,
} from "../../../redux/contentSlice";
import { useDispatch } from "react-redux";
import { OpponentDeck } from "../../../model/opponentDeck";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { EmptyOpponentDeck } from "../../../model/emptyOpponentDeck";
import { EmptyDeck } from "../../../model/emptyDeck";
import { getResult } from "../PrimaryFrame/components/componentFunctions";
import $ from "jquery";

/**
 * Sets up a MutationObserver on the ".game-log" element in the Dominion Client DOM, and
 * invokes the update() method on Deck objects when new logs are collected.
 * @param param0
 * @returns
 */
/**
 * Content global variable - Stores the value of the player name.
 * Use - invoking Deck object constructor
 */
let playerName: string = "";

/**
 * Content global variable - Stores the value of the player's abbreviated name used in the client ".game-log" element.
 * Use - invoking Deck object constructor
 */
let playerNick: string = "";

/**
 * Content global variable - Stores the value of the opponent name.
 * Use - invoking Deck object constructor
 */
let opponentName: string = "";

/**
 * Content global variable - Stores the value of the opponent's abbreviated name used in the client ".game-log" element.
 * Use - invoking Deck object constructor
 */
let opponentNick: string = "";

/**
 * Content global variable -
 * Use - Control flow for the content script.
 * False value means the 'gameLog' global is not yet initialized.
 * True value means the 'gameLog' global holds a value collected from the ".game-log" element in the client).
 */
let logInitialized: boolean = false;

/**
 * Content global variable -
 * Use - Control flow for the content script.
 * False value means the 'kingdom' global is not yet initialized.
 * True value means the 'kingdom' global holds an array of string collected from the ".kingdom-viewer" element in the client).
 */
let kingdomInitialized: boolean = false;

/**
 * Content global variable -
 * Use - Control flow for the content script.
 * False value means the 'playerName', 'playerNick', 'opponentName', and 'opponentNick' globals are not initialized.
 * True value means they each hold the appropriate string collected from the elements in the client DOM.
 */
let playersInitialized: boolean = false;

/**
 * Content global variable -
 * Use - Control flow for the content script.
 * False value means the Deck objects that will be used to track the game state are not yet created.
 * True value means a Deck object has been assigned to the value of the 'playerDeck' and another Deck
 * object has been assigned to the value of the 'opponentDeck' global variable.
 */
let playerDeckInitialized: boolean = false;

/**
 * Content global variable - Holds the value of which logs have already been sent to the Deck objects.
 * Use - Control flow for the content script.
 * Every time more logs are sent to the Deck object's update method, this variable is updated to include those
 * logs.  This variable is used to control logic by comparing possible new logs to those that have already been
 * processed by the Decks.
 */
let logsProcessed: string = "";

/**
 * Content global variable - Holds the value of the ".game-log" innerText from the client DOM.
 * Use 1 - When new content is detected in the client ".game-log" element, this variable is updated to contain the value
 * that element's innerText.
 * Use 2 - Control flow for the content script: the value of this variable is compared to the 'logsProcessed' global
 * to determine which logs to use when invoke the Deck object's update() method.
 */
let gameLog: string = "";

/**
 * Content global variable - Holds the value of whether or not the current game is rated.
 * Use - Deck constructor invocation.
 */
let ratedGame: boolean = true;

/**
 * Rating of the player of the player deck
 */
let playerRating: string = "";

/**
 * Rating of the player of opponent deck.
 */
let opponentRating: string = "";

/**
 *
 * Content global variable - Holds the values of the Deck objects.  The playerName and opponentName are used as the
 * keys for the corresponding Deck objects
 * Use - The decks track the game state for players, and in the context of the content script, the update() method is
 * invoked on these Deck objects.
 */
let decks: Map<string, Deck | OpponentDeck> = new Map();

/**
 * Content global variable - Holds the strings that define the cards available in the current game.
 * Use - invoking Deck object constructor
 */
let kingdom: Array<string> = [];

/**
 * Content global variable - The current version of the extension does not support games that include
 * cards outside of the base set.  This variable will hold the value of true if the current kingdom is base set only.
 * It will hold false if the kingdom contains non-base cards.  The variable is used to disable extension features
 * if unsupported cards are detected.
 * Use - invoking Deck object constructor
 */
let baseOnly: boolean;

/**
 * Interval used to detect
 */
let initInterval: NodeJS.Timer;

/**
 * Content global variable -
 * Use - When a game is active, used to set an interval to periodically check if the game is still active,
 * and if the game is not active, executes a game reset.
 */
let resetInterval: NodeJS.Timer;

/**
 * Mutation Observers detect changes in the DOM.
 */
let gameLogObserver: MutationObserver;
let gameEndObserver: MutationObserver;
let undoObserver: MutationObserver;


const Observer: FunctionComponent = () => {
  const dispatch = useDispatch();
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const od = useSelector((state: RootState) => state.content.opponentDeck);

  /**
   * Reset function.
   * 1) Sets all content globals to their initial state, and
   * 2) Disconnects the mutation observer
   */
  const resetGame = () => {
    playersInitialized = false;
    logInitialized = false;
    kingdomInitialized = false;
    playerDeckInitialized = false;
    logsProcessed;
    logsProcessed = "";
    gameLog = "";
    playerName = "";
    opponentName = "";
    decks = new Map();
    kingdom = [];
    baseOnly = true;
    dispatch(setBaseOnly(true));
    if (gameLogObserver !== undefined) gameLogObserver.disconnect();
    if (gameEndObserver !== undefined) gameEndObserver.disconnect();
    if (undoObserver !== undefined) undoObserver.disconnect();
  };

  /**
   * Control flow function.
   * @returns boolean, true if all four of the globals within are true.
   */
  const initialized = () => {
    return (
      logInitialized &&
      playersInitialized &&
      kingdomInitialized &&
      playerDeckInitialized
    );
  };

  /**
   * Mutation observer function for the Mutation Observer to use
   * when observing the ".game-log element" in the Client.
   * Use - When a mutation of time "childList" occurs in the ".game-log" element
   * of the client DOM, this function triggers.
   * Logic ensures that action is only taken if the mutation created added nodes,
   * and only if the last of the added nodes has an innerText value.
   * If the last added node has an innerText value, then another logic checks
   * if there are any new logs using the areNewLogsToSend() function.  If there
   * are new logs, they are obtained with the getUndispatchedLogs() function and
   * the Deck objects' update() methods are invoked using the new logs as an argument,
   * and finally, the global variable 'logsProcessed' is updated.
   * @param mutationList
   */
  const logObserverFunc: MutationCallback = (
    mutationList: MutationRecord[]
  ) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        const addedNodes = mutation.addedNodes;
        if (addedNodes.length > 0) {
          const lastAddedNode: HTMLElement = addedNodes[
            addedNodes.length - 1
          ] as HTMLElement;
          const lastAddedNodeText = lastAddedNode.innerText;
          if (lastAddedNodeText.length > 0) {
            if (areNewLogsToSend(logsProcessed, getGameLog())) {
              gameLog = getGameLog();
              const newLogsToDispatch = getUndispatchedLogs(
                logsProcessed,
                gameLog
              )
                .split("\n")
                .slice();
              decks.get(playerName)?.update(newLogsToDispatch);
              dispatch(
                setPlayerDeck(JSON.parse(JSON.stringify(decks.get(playerName))))
              );
              decks.get(opponentName)?.update(newLogsToDispatch);
              dispatch(
                setOpponentDeck(
                  JSON.parse(JSON.stringify(decks.get(opponentName)))
                )
              );
              // remove premoves
              if (
                gameLog
                  .split("\n")
                  [gameLog.split("\n").length - 1].match("Premoves") !== null
              ) {
                gameLog = gameLog.split("\n").slice(0, -1).join("\n");
              }
              logsProcessed = gameLog;
            }
          }
        }
      }
    }
  };

  /**
   * At the end of a game, determines the results of the game, and updates the
   */
  const gameEndObserverFunc: MutationCallback = () => {
    const timeOutElements = document
      .getElementsByTagName("game-ended-notification")[0]
      .getElementsByClassName("timeout");
    const gameEndMessage = (timeOutElements[0] as HTMLElement).innerText;
    let gameEndReason: string = "None";
    if (timeOutElements[1] !== undefined) {
      gameEndReason = (timeOutElements[1] as HTMLElement).innerText;
    }
    if (gameEndMessage === "The game has ended.") {
      let [victor, defeated] = getResult(
        decks,
        playerName,
        opponentName,
        gameEndReason
      );
      if (victor === playerName) {
        decks.get(playerName)!.setGameResult("Victory");
        decks.get(opponentName)!.setGameResult("Defeat");
      } else if (defeated === playerName) {
        decks.get(opponentName)!.setGameResult("Victory");
        decks.get(playerName)!.setGameResult("Defeat");
      } else {
        decks.get(playerName)!.setGameResult("Tie");
        decks.get(opponentName)!.setGameResult("Tie");
      }
      dispatch(
        setPlayerDeck(JSON.parse(JSON.stringify(decks.get(playerName))))
      );
      dispatch(
        setOpponentDeck(JSON.parse(JSON.stringify(decks.get(opponentName))))
      );
      saveGameData(gameLog, decks);
    }
  };

  /**
   * Observes the log container element.  It is the parent element of game-log.  The function
   * watches to see if it's child element game-log is removed and added in a single mutation list.
   * If so, it means an undo or rewind has taken place, and the function clears the reset interval
   * resets the init interval, effectively rewinding the extension.
   *
   * @param mutationList
   */

  const undoObserverFunc = (mutationList: MutationRecord[]) => {
    let gameLogRemoved: boolean = false;
    let gameLogAdded: boolean = false;
    for (let j = 0; j < mutationList.length; j++) {
      const mutation = mutationList[j];
      if (mutation.removedNodes.length > 0) {
        for (let i = 0; i < mutation.removedNodes.length; i++) {
          let htmlNode = mutation.removedNodes[i].cloneNode() as HTMLElement;
          if (htmlNode.className === "game-log") {
            gameLogRemoved = true;
            break;
          }
        }
      }
      if (mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          let htmlNode = mutation.addedNodes[i].cloneNode() as HTMLElement;
          if (htmlNode.className === "game-log") {
            gameLogAdded = true;
            break;
          }
        }
      }
      if (gameLogRemoved && gameLogAdded) break;
    }
    if (gameLogRemoved && gameLogAdded) {
      clearInterval(resetInterval);
      initInterval = setInterval(initIntervalFunction, 1000);
    }
  };

  const resetDeckState = () => {
    dispatch(
      setOpponentDeck(JSON.parse(JSON.stringify(new EmptyOpponentDeck())))
    );
    dispatch(setPlayerDeck(JSON.parse(JSON.stringify(new EmptyDeck()))));
  };

  /**
   * Primary function of the content script
   * Use - Periodically checks the client DOM for the presence of the elements that
   * are required to initialize the content script global variables, one at a time.
   * Once they are initialized, the initInterval is cleared, the resetInterval is set,
   * and finally the React root is
   * appended to the client DOM.
   */

  const initIntervalFunction = () => {
    resetGame();
    if (!logInitialized) {
      if (isGameLogPresent()) {
        gameLog = getGameLog();
        ratedGame = getRatedGameBoolean(gameLog.split("\n")[0]);
        logInitialized = true;
      }
    }
    if (!playersInitialized) {
      if (arePlayerInfoElementsPresent()) {
        [playerName, opponentName] =
          getPlayerAndOpponentNameByComparingElementPosition(
            getPlayerInfoElements()
          );
        [playerNick, opponentNick] = getPlayerNameAbbreviations(
          gameLog,
          playerName
        );
        playersInitialized = true;
        if (ratedGame) {
          [playerRating, opponentRating] = getPlayerRatings(
            playerName,
            opponentName,
            gameLog
          );
        }
      }
    }
    if (!kingdomInitialized) {
      if (isKingdomElementPresent()) {
        kingdom = getKingdom();
        baseOnly = baseKingdomCardCheck(kingdom);
        dispatch(setBaseOnly(baseOnly));
        if (!baseOnly) {
          console.error(
            "Game is not intended for cards outside of the Base Set"
          );
        }
        kingdomInitialized = true;
      }
    }
    if (!playerDeckInitialized) {
      if (playersInitialized && kingdomInitialized) {
        decks = createPlayerDecks(
          gameLog
            .split("\n")[0]
            .substring(0, gameLog.split("\n")[0].lastIndexOf(" ") - 1),
          ratedGame,
          playerName,
          playerNick,
          playerRating,
          opponentName,
          opponentNick,
          opponentRating,
          kingdom
        );
        playerDeckInitialized = true;
      }
    }

    const resetCheckIntervalFunction = () => {
      if (!isGameLogPresent()) {
        clearInterval(resetInterval);
        initInterval = setInterval(initIntervalFunction, 1000);
      }
    };

    if (initialized()) {
      resetDeckState();
      if (baseOnly) {
        dispatch(setGameActiveStatus(true));
        gameLogObserver = new MutationObserver(logObserverFunc);
        gameEndObserver = new MutationObserver(gameEndObserverFunc);
        undoObserver = new MutationObserver(undoObserverFunc);
        const gameLogElement = document.getElementsByClassName("game-log")[0];
        const gameEndElement = document.getElementsByTagName(
          "game-ended-notification"
        )[0];
        const logContainerElement =
          document.getElementsByClassName("log-container")[0];
        undoObserver.observe(logContainerElement, {
          childList: true,
        });
        gameLogObserver.observe(gameLogElement, {
          childList: true,
          subtree: true,
        });
        gameEndObserver.observe(gameEndElement, {
          childList: true,
          subtree: true,
        });
        const newLogsToDispatch = getUndispatchedLogs(logsProcessed, gameLog) // Initial dispatch
          .split("\n")
          .slice();
        decks.get(playerName)?.update(newLogsToDispatch);
        dispatch(
          setPlayerDeck(JSON.parse(JSON.stringify(decks.get(playerName))))
        );
        decks.get(opponentName)?.update(newLogsToDispatch);
        dispatch(
          setOpponentDeck(JSON.parse(JSON.stringify(decks.get(opponentName))))
        );
        logsProcessed = gameLog;
        saveGameData(gameLog, decks);
      }
      clearInterval(initInterval);
      resetInterval = setInterval(resetCheckIntervalFunction, 1000);
    }
  };

  const saveGameData = async (
    gameLog: string,
    decks: Map<string, Deck | OpponentDeck>
  ) => {
    const savedGame: SavedGame = {
      logArchive: gameLog,
      playerDeck: JSON.parse(JSON.stringify(decks.get(playerName))),
      opponentDeck: JSON.parse(JSON.stringify(decks.get(opponentName))),
      dateTime: new Date().toString(),
      logHtml: document.getElementsByClassName("game-log")[0].innerHTML,
    };
    const title: string = savedGame.playerDeck.gameTitle;
    chrome.storage.local.get(["gameKeys"]).then(async (result) => {
      let gameKeys = result.gameKeys;
      if (gameKeys === undefined) {
        gameKeys = [];
        gameKeys.push(title);
      } else if (!gameKeys.includes(title)) {
        gameKeys.push(title);
      }
      await chrome.storage.local.set({ gameKeys: gameKeys });
      await chrome.storage.local.set({
        [title]: savedGame,
      });
      chrome.storage.local.get([...gameKeys]).then((result) => {
        dispatch(setSavedGames(result));
      });
    });
  };

  const showSavedData = () => {
    chrome.storage.local.get(["gameKeys"]).then(async (result) => {
      console.log("gameKeys: ", result);

      let gameKeys = result.gameKeys;
      await chrome.storage.local.get([...gameKeys]).then((result) => {
        console.log("History Records: ", result);
      });
    });
  };

  /**
   * ToDo - create function that automatically sets the deck to the rewound/undone state
   */

  /**
   * Callback function used for the 'beforeunload' event listener.
   * Added on render, removed on unmount.
   * @param event - The BeforeUnloadEvent
   */
  const saveBeforeUnload = () => {
    saveGameData(gameLog, decks);
  };

  useEffect(() => {
    addEventListener("beforeunload", saveBeforeUnload);
    initInterval = setInterval(initIntervalFunction, 1000);
    return () => {
      clearInterval(initInterval);
      clearInterval(resetInterval);
      removeEventListener("beforeunload", saveBeforeUnload);
    };
  }, []);

  return (
    <div className="top-[50%] hidden">
      <button
        className="top-[50%] whitespace-nowrap ml-[200px]"
        onClick={() => {
          console.log("gameLog", gameLog);
          console.log("logsProcessed", logsProcessed);
          console.log(decks);
        }}
      >
        show gameLog /logsProcessed
      </button>
      <button
        className="top-[50%] whitespace-nowrap relative ml-[200px]"
        onClick={() => saveGameData(gameLog, decks)}
      >
        Save Data
      </button>
      <button
        className="top-[50%] whitespace-nowrap relative ml-[200px]"
        onClick={() => showSavedData()}
      >
        show saved Data
      </button>

      <button
        className="top-[50%] whitespace-nowrap relative ml-[200px]"
        onClick={() => console.log(pd, od)}
      >
        Show pd od
      </button>
      <button
        className="top-[50%] whitespace-nowrap relative ml-[200px]"
        onClick={() => {
          resetGame();
          const newLogsToDispatch = getUndispatchedLogs(logsProcessed, gameLog) // Initial dispatch
            .split("\n")
            .slice();
          decks.get(playerName)?.update(newLogsToDispatch);
          dispatch(
            setPlayerDeck(JSON.parse(JSON.stringify(decks.get(playerName))))
          );
          decks.get(opponentName)?.update(newLogsToDispatch);
          dispatch(
            setOpponentDeck(JSON.parse(JSON.stringify(decks.get(opponentName))))
          );
          logsProcessed = gameLog;
          saveGameData(gameLog, decks);
        }}
      >
        Reset Game
      </button>
      <button
        className="top-[50%] whitespace-nowrap relative ml-[200px]"
        onClick={() => {
          console.log(document.getElementsByClassName("game-log")[0].innerHTML);
          console.log(
            typeof document.getElementsByClassName("game-log")[0].innerHTML
          );

          $("#domRoot").append(
            $(document.getElementsByClassName("game-log")[0].innerHTML)
          );
        }}
      >
        Show innerHTML
      </button>
    </div>
  );
};
export default Observer;
