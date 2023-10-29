import {
  setBaseOnly,
  setGameActiveStatus,
  setOpponentDeck,
  setPlayerDeck,
  setSavedGames,
} from "../redux/contentSlice";
import { SavedGame } from ".";
import {
  areNewLogsToSend,
  arePlayerInfoElementsPresent,
  baseKingdomCardCheck,
  createPlayerDecks,
  dispatchUpdatedDecksToRedux,
  getClientKingdom,
  getGameLog,
  getNewLogsAndUpdateDecks,
  getPlayerAndOpponentNameByComparingElementPosition,
  getPlayerInfoElements,
  getPlayerNameAbbreviations,
  getPlayerRatings,
  getRatedGameBoolean,
  getResult,
  getTimeOutElements,
  getUndispatchedLogs,
  isGameLogPresent,
  isKingdomElementPresent,
  setDecksGameResults,
} from "./utils";
import { Deck } from "../model/deck";
import { EmptyDeck } from "../model/emptyDeck";
import { EmptyOpponentDeck } from "../model/emptyOpponentDeck";
import { OpponentDeck } from "../model/opponentDeck";
import { store } from "../redux/store";
import { AnyAction, Dispatch } from "redux";

export class ClientObserver {
  static playerName: string = "";
  static playerNick: string = "";
  static opponentName: string = "";
  static opponentNick: string = "";
  static logInitialized: boolean = false;
  static kingdomInitialized: boolean = false;
  static playersInitialized: boolean = false;
  static playerDeckInitialized: boolean = false;
  static logsProcessed: string = "";
  static gameLog: string = "";
  static ratedGame: boolean = true;
  static playerRating: string = "";
  static opponentRating: string = "";
  static decks: Map<string, Deck | OpponentDeck> = new Map();
  static kingdom: Array<string> = [];
  static baseOnly: boolean = true;
  static initInterval: NodeJS.Timeout | number;
  static resetInterval: NodeJS.Timeout | number;
  static gameLogObserver: MutationObserver;
  static gameEndObserver: MutationObserver;
  static undoObserver: MutationObserver;
  static dispatch: Dispatch<AnyAction> = store.dispatch;

  /**
   * At the end of a game, determines the results of the game, and updates the
   */
  static gameEndObserverFunc() {
    const timeOutElements = getTimeOutElements();
    const gameEndMessage = timeOutElements[0].innerText;
    let gameEndReason: string = "None";
    if (timeOutElements[1] !== undefined) {
      gameEndReason = timeOutElements[1].innerText;
    }
    if (gameEndMessage === "The game has ended.") {
      let [victor, defeated] = getResult(
        ClientObserver.decks,
        ClientObserver.playerName,
        ClientObserver.opponentName,
        gameEndReason
      );
      ClientObserver.decks = setDecksGameResults(
        victor,
        defeated,
        ClientObserver.playerName,
        ClientObserver.opponentName,
        ClientObserver.decks
      );
      dispatchUpdatedDecksToRedux(
        ClientObserver.dispatch,
        setPlayerDeck,
        setOpponentDeck,
        JSON.parse(JSON.stringify(ClientObserver.decks.get(ClientObserver.playerName))),
        JSON.parse(JSON.stringify(ClientObserver.decks.get(ClientObserver.opponentName)))
      );
      ClientObserver.saveGameData(ClientObserver.gameLog, ClientObserver.decks);
    }
  }
  /**
   * Control flow function.
   * @returns boolean, true if all four of the globals within are true.
   */
  static initialized() {
    return (
      ClientObserver.logInitialized &&
      ClientObserver.playersInitialized &&
      ClientObserver.kingdomInitialized &&
      ClientObserver.playerDeckInitialized
    );
  }

  /**
   * Primary method of the Observer
   * Use - Periodically checks the client DOM for the presence of the elements that
   * are required to initialize the Observer global variables, one at a time.
   * Once they are initialized, the initInterval is cleared, the resetInterval is set,
   * and finally the React root is
   * appended to the client DOM.
   */
  static initIntervalFunction() {
    console.log("Init interval function.");
    ClientObserver.resetGame();
    if (!ClientObserver.logInitialized) {
      console.log("Checking for log presence...");
      if (isGameLogPresent()) {
        console.log("Gamelog present, initializing...");
        ClientObserver.gameLog = getGameLog();
        ClientObserver.ratedGame = getRatedGameBoolean(
          ClientObserver.gameLog.split("\n")[0]
        );
        ClientObserver.logInitialized = true;
      }
    }
    if (!ClientObserver.playersInitialized) {
      console.log("Checking for player elements presence...");
      if (arePlayerInfoElementsPresent()) {
        console.log("playerElements present, initializing...");
        [ClientObserver.playerName, ClientObserver.opponentName] =
          getPlayerAndOpponentNameByComparingElementPosition(
            getPlayerInfoElements()
          );
        [ClientObserver.playerNick, ClientObserver.opponentNick] =
          getPlayerNameAbbreviations(ClientObserver.gameLog, ClientObserver.playerName);
        ClientObserver.playersInitialized = true;
        if (ClientObserver.ratedGame) {
          [ClientObserver.playerRating, ClientObserver.opponentRating] = getPlayerRatings(
            ClientObserver.playerName,
            ClientObserver.opponentName,
            ClientObserver.gameLog
          );
        }
      }
    }
    if (!ClientObserver.kingdomInitialized) {
      console.log("Checking for kingdom presence...");
      if (isKingdomElementPresent()) {
        console.log("Kingdom present, initializing...");
        ClientObserver.kingdom = getClientKingdom();
        ClientObserver.baseOnly = baseKingdomCardCheck(ClientObserver.kingdom);
        ClientObserver.dispatch(setBaseOnly(ClientObserver.baseOnly));
        if (!ClientObserver.baseOnly) {
          console.error(
            "Game is not intended for cards outside of the Base Set"
          );
        }
        ClientObserver.kingdomInitialized = true;
      }
    }
    if (!ClientObserver.playerDeckInitialized) {
      console.log("Checking decks presence");
      if (ClientObserver.playersInitialized && ClientObserver.kingdomInitialized) {
        console.log("Decks not created... initializing decks.");
        ClientObserver.decks = createPlayerDecks(
          ClientObserver.gameLog
            .split("\n")[0]
            .substring(0, ClientObserver.gameLog.split("\n")[0].lastIndexOf(" ") - 1),
          ClientObserver.ratedGame,
          ClientObserver.playerName,
          ClientObserver.playerNick,
          ClientObserver.playerRating,
          ClientObserver.opponentName,
          ClientObserver.opponentNick,
          ClientObserver.opponentRating,
          ClientObserver.kingdom
        );
        ClientObserver.playerDeckInitialized = true;
      }
    }

    const resetCheckIntervalFunction = () => {
      if (!isGameLogPresent()) {
        clearInterval(ClientObserver.resetInterval);
        ClientObserver.initInterval = setInterval(
          ClientObserver.initIntervalFunction,
          1000
        );
      }
    };

    if (ClientObserver.initialized()) {
      console.log("Fields initialized...");
      ClientObserver.resetDeckState();
      if (ClientObserver.baseOnly) {
        ClientObserver.dispatch(setGameActiveStatus(true));
        ClientObserver.gameLogObserver = new MutationObserver(
          ClientObserver.logObserverFunc
        );
        ClientObserver.gameEndObserver = new MutationObserver(
          ClientObserver.gameEndObserverFunc
        );
        ClientObserver.undoObserver = new MutationObserver(ClientObserver.undoObserverFunc);
        const gameLogElement = document.getElementsByClassName("game-log")[0];
        const gameEndElement = document.getElementsByTagName(
          "game-ended-notification"
        )[0];
        const logContainerElement =
          document.getElementsByClassName("log-container")[0];
        ClientObserver.undoObserver.observe(logContainerElement, {
          childList: true,
        });
        ClientObserver.gameLogObserver.observe(gameLogElement, {
          childList: true,
          characterData: true,
          characterDataOldValue: true,
          subtree: true,
        });
        ClientObserver.gameEndObserver.observe(gameEndElement, {
          childList: true,
          subtree: true,
        });
        const newLogsToDispatch = getUndispatchedLogs(
          ClientObserver.logsProcessed,
          ClientObserver.gameLog
        ) // Initial dispatch
          .split("\n")
          .slice();
        ClientObserver.decks.get(ClientObserver.playerName)?.update(newLogsToDispatch);
        ClientObserver.dispatch(
          setPlayerDeck(
            JSON.parse(JSON.stringify(ClientObserver.decks.get(ClientObserver.playerName)))
          )
        );
        ClientObserver.decks.get(ClientObserver.opponentName)?.update(newLogsToDispatch);
        ClientObserver.dispatch(
          setOpponentDeck(
            JSON.parse(
              JSON.stringify(ClientObserver.decks.get(ClientObserver.opponentName))
            )
          )
        );
        ClientObserver.logsProcessed = ClientObserver.gameLog;
        ClientObserver.saveGameData(ClientObserver.gameLog, ClientObserver.decks);
      }
      clearInterval(ClientObserver.initInterval);
      ClientObserver.resetInterval = setInterval(resetCheckIntervalFunction, 1000);
    }
  }

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
  static logObserverFunc() {
    if (areNewLogsToSend(ClientObserver.logsProcessed, getGameLog())) {
      const gameLog = getGameLog();
      const { playerStoreDeck, opponentStoreDeck } = getNewLogsAndUpdateDecks(
        ClientObserver.logsProcessed,
        gameLog,
        getUndispatchedLogs,
        ClientObserver.decks,
        ClientObserver.playerName,
        ClientObserver.opponentName
      );
      dispatchUpdatedDecksToRedux(
        ClientObserver.dispatch,
        setPlayerDeck,
        setOpponentDeck,
        playerStoreDeck,
        opponentStoreDeck
      );
      ClientObserver.logsProcessed = gameLog;
    }
  }

  /**
   * Reset function.
   * 1) Sets all content globals to their initial state, and
   * 2) Disconnects the mutation observer
   */
  static resetGame() {
    ClientObserver.playersInitialized = false;
    ClientObserver.logInitialized = false;
    ClientObserver.kingdomInitialized = false;
    ClientObserver.playerDeckInitialized = false;
    ClientObserver.logsProcessed;
    ClientObserver.logsProcessed = "";
    ClientObserver.gameLog = "";
    ClientObserver.playerName = "";
    ClientObserver.opponentName = "";
    ClientObserver.decks = new Map();
    ClientObserver.kingdom = [];
    ClientObserver.baseOnly = true;
    ClientObserver.dispatch(setBaseOnly(true));
    if (ClientObserver.gameLogObserver !== undefined)
      ClientObserver.gameLogObserver.disconnect();
    if (ClientObserver.gameEndObserver !== undefined)
      ClientObserver.gameEndObserver.disconnect();
    if (ClientObserver.undoObserver !== undefined) ClientObserver.undoObserver.disconnect();
  }

  static resetDeckState() {
    ClientObserver.dispatch(
      setOpponentDeck(JSON.parse(JSON.stringify(new EmptyOpponentDeck())))
    );
    ClientObserver.dispatch(
      setPlayerDeck(JSON.parse(JSON.stringify(new EmptyDeck())))
    );
  }

  /**
   * Callback function used for the 'beforeunload' event listener.
   * Added on render, removed on unmount.
   * @param event - The BeforeUnloadEvent
   */
  static saveBeforeUnload() {
    ClientObserver.saveGameData(ClientObserver.gameLog, ClientObserver.decks);
  }

  static showSavedData() {
    chrome.storage.local.get(["gameKeys"]).then(async (result) => {
      console.log("gameKeys: ", result);

      let gameKeys = result.gameKeys;
      await chrome.storage.local.get([...gameKeys]).then((result) => {
        console.log("History Records: ", result);
      });
    });
  }

  /**
   * Observes the log container element.  It is the parent element of game-log.  The function
   * watches to see if it's child element game-log is removed and added in a single mutation list.
   * If so, it means an undo or rewind has taken place, and the function clears the reset interval
   * resets the init interval, effectively rewinding the extension.
   *
   * @param mutationList
   */
  static undoObserverFunc(mutationList: MutationRecord[]) {
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
      clearInterval(ClientObserver.resetInterval);
      ClientObserver.initInterval = setInterval(ClientObserver.initIntervalFunction, 1000);
    }
  }

  static async saveGameData(
    gameLog: string,
    decks: Map<string, Deck | OpponentDeck>
  ) {
    const savedGame: SavedGame = {
      logArchive: gameLog,
      playerDeck: JSON.parse(JSON.stringify(decks.get(ClientObserver.playerName))),
      opponentDeck: JSON.parse(
        JSON.stringify(decks.get(ClientObserver.opponentName))
      ),
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
        ClientObserver.dispatch(setSavedGames(result));
      });
    });
  }
}
