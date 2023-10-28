import {
  setBaseOnly,
  setGameActiveStatus,
  setOpponentDeck,
  setPlayerDeck,
  setSavedGames,
} from "../redux/contentSlice";
import { SavedGame } from "../utils";
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
  processLogMutations,
  setDecksGameResults,
} from "../utils/utils";
import { Deck } from "./deck";
import { EmptyDeck } from "./emptyDeck";
import { EmptyOpponentDeck } from "./emptyOpponentDeck";
import { OpponentDeck } from "./opponentDeck";
import { store } from "../redux/store";
import { AnyAction, Dispatch } from "redux";

export class Observer {
  playerName: string = "";
  playerNick: string = "";
  opponentName: string = "";
  opponentNick: string = "";
  logInitialized: boolean = false;
  kingdomInitialized: boolean = false;
  playersInitialized: boolean = false;
  playerDeckInitialized: boolean = false;
  logsProcessed: string = "";
  gameLog: string = "";
  ratedGame: boolean = true;
  playerRating: string = "";
  opponentRating: string = "";
  decks: Map<string, Deck | OpponentDeck> = new Map();
  kingdom: Array<string> = [];
  baseOnly: boolean = true;
  initInterval?: NodeJS.Timeout | number;
  resetInterval?: NodeJS.Timeout | number;
  gameLogObserver?: MutationObserver;
  gameEndObserver?: MutationObserver;
  undoObserver?: MutationObserver;
  dispatch:Dispatch<AnyAction> = store.dispatch;
  constructor() {}

  /**
   * At the end of a game, determines the results of the game, and updates the
   */
  gameEndObserverFunc() {
    const timeOutElements = getTimeOutElements();
    const gameEndMessage = timeOutElements[0].innerText;
    let gameEndReason: string = "None";
    if (timeOutElements[1] !== undefined) {
      gameEndReason = timeOutElements[1].innerText;
    }
    if (gameEndMessage === "The game has ended.") {
      let [victor, defeated] = getResult(
        this.decks,
        this.playerName,
        this.opponentName,
        gameEndReason
      );
      this.decks = setDecksGameResults(
        victor,
        defeated,
        this.playerName,
        this.opponentName,
        this.decks
      );
      dispatchUpdatedDecksToRedux(
        this.dispatch,
        setPlayerDeck,
        setOpponentDeck,
        JSON.parse(JSON.stringify(this.decks.get(this.playerName))),
        JSON.parse(JSON.stringify(this.decks.get(this.opponentName)))
      );
      this.saveGameData(this.gameLog, this.decks);
    }
  }
  /**
   * Control flow function.
   * @returns boolean, true if all four of the globals within are true.
   */
  initialized() {
    return (
      this.logInitialized &&
      this.playersInitialized &&
      this.kingdomInitialized &&
      this.playerDeckInitialized
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
  initIntervalFunction() {
    this.resetGame();
    if (!this.logInitialized) {
      if (isGameLogPresent()) {
        this.gameLog = getGameLog();
        this.ratedGame = getRatedGameBoolean(this.gameLog.split("\n")[0]);
        this.logInitialized = true;
      }
    }
    if (!this.playersInitialized) {
      if (arePlayerInfoElementsPresent()) {
        [this.playerName, this.opponentName] =
          getPlayerAndOpponentNameByComparingElementPosition(
            getPlayerInfoElements()
          );
        [this.playerNick, this.opponentNick] = getPlayerNameAbbreviations(
          this.gameLog,
          this.playerName
        );
        this.playersInitialized = true;
        if (this.ratedGame) {
          [this.playerRating, this.opponentRating] = getPlayerRatings(
            this.playerName,
            this.opponentName,
            this.gameLog
          );
        }
      }
    }
    if (!this.kingdomInitialized) {
      if (isKingdomElementPresent()) {
        this.kingdom = getClientKingdom();
        this.baseOnly = baseKingdomCardCheck(this.kingdom);
        this.dispatch(setBaseOnly(this.baseOnly));
        if (!this.baseOnly) {
          console.error(
            "Game is not intended for cards outside of the Base Set"
          );
        }
        this.kingdomInitialized = true;
      }
    }
    if (!this.playerDeckInitialized) {
      if (this.playersInitialized && this.kingdomInitialized) {
        this.decks = createPlayerDecks(
          this.gameLog
            .split("\n")[0]
            .substring(0, this.gameLog.split("\n")[0].lastIndexOf(" ") - 1),
          this.ratedGame,
          this.playerName,
          this.playerNick,
          this.playerRating,
          this.opponentName,
          this.opponentNick,
          this.opponentRating,
          this.kingdom
        );
        this.playerDeckInitialized = true;
      }
    }

    const resetCheckIntervalFunction = () => {
      if (!isGameLogPresent()) {
        clearInterval(this.resetInterval);
        this.initInterval = setInterval(this.initIntervalFunction, 1000);
      }
    };

    if (this.initialized()) {
      this.resetDeckState();
      if (this.baseOnly) {
        this.dispatch(setGameActiveStatus(true));
        this.gameLogObserver = new MutationObserver(this.logObserverFunc);
        this.gameEndObserver = new MutationObserver(this.gameEndObserverFunc);
        this.undoObserver = new MutationObserver(this.undoObserverFunc);
        const gameLogElement = document.getElementsByClassName("game-log")[0];
        const gameEndElement = document.getElementsByTagName(
          "game-ended-notification"
        )[0];
        const logContainerElement =
          document.getElementsByClassName("log-container")[0];
        this.undoObserver.observe(logContainerElement, {
          childList: true,
        });
        this.gameLogObserver.observe(gameLogElement, {
          childList: true,
          subtree: true,
        });
        this.gameEndObserver.observe(gameEndElement, {
          childList: true,
          subtree: true,
        });
        const newLogsToDispatch = getUndispatchedLogs(
          this.logsProcessed,
          this.gameLog
        ) // Initial dispatch
          .split("\n")
          .slice();
        this.decks.get(this.playerName)?.update(newLogsToDispatch);
        this.dispatch(
          setPlayerDeck(
            JSON.parse(JSON.stringify(this.decks.get(this.playerName)))
          )
        );
        this.decks.get(this.opponentName)?.update(newLogsToDispatch);
        this.dispatch(
          setOpponentDeck(
            JSON.parse(JSON.stringify(this.decks.get(this.opponentName)))
          )
        );
        this.logsProcessed = this.gameLog;
        this.saveGameData(this.gameLog, this.decks);
      }
      clearInterval(this.initInterval);
      this.resetInterval = setInterval(resetCheckIntervalFunction, 1000);
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
  logObserverFunc(mutationList: MutationRecord[]) {
    const newLogsProcessed = processLogMutations(
      mutationList,
      areNewLogsToSend,
      this.logsProcessed,
      getGameLog,
      getNewLogsAndUpdateDecks,
      getUndispatchedLogs,
      this.decks,
      this.playerName,
      this.opponentName,
      dispatchUpdatedDecksToRedux,
      this.dispatch,
      setPlayerDeck,
      setOpponentDeck
    );
    if (newLogsProcessed) {
      this.logsProcessed = newLogsProcessed;
    }
  }

  /**
   * Reset function.
   * 1) Sets all content globals to their initial state, and
   * 2) Disconnects the mutation observer
   */
  resetGame() {
    this.playersInitialized = false;
    this.logInitialized = false;
    this.kingdomInitialized = false;
    this.playerDeckInitialized = false;
    this.logsProcessed;
    this.logsProcessed = "";
    this.gameLog = "";
    this.playerName = "";
    this.opponentName = "";
    this.decks = new Map();
    this.kingdom = [];
    this.baseOnly = true;
    this.dispatch(setBaseOnly(true));
    if (this.gameLogObserver !== undefined) this.gameLogObserver.disconnect();
    if (this.gameEndObserver !== undefined) this.gameEndObserver.disconnect();
    if (this.undoObserver !== undefined) this.undoObserver.disconnect();
  }

  resetDeckState() {
    this.dispatch(
      setOpponentDeck(JSON.parse(JSON.stringify(new EmptyOpponentDeck())))
    );
    this.dispatch(setPlayerDeck(JSON.parse(JSON.stringify(new EmptyDeck()))));
  }

  /**
   * Callback function used for the 'beforeunload' event listener.
   * Added on render, removed on unmount.
   * @param event - The BeforeUnloadEvent
   */
  saveBeforeUnload() {
    this.saveGameData(this.gameLog, this.decks);
  }

  showSavedData() {
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
  undoObserverFunc(mutationList: MutationRecord[]) {
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
      clearInterval(this.resetInterval);
      this.initInterval = setInterval(this.initIntervalFunction, 1000);
    }
  }

  async saveGameData(gameLog: string, decks: Map<string, Deck | OpponentDeck>) {
    const savedGame: SavedGame = {
      logArchive: gameLog,
      playerDeck: JSON.parse(JSON.stringify(decks.get(this.playerName))),
      opponentDeck: JSON.parse(JSON.stringify(decks.get(this.opponentName))),
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
        this.dispatch(setSavedGames(result));
      });
    });
  }
}
