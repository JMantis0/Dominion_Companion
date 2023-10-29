import {
  setBaseOnly,
  setGameActiveStatus,
  setOpponentDeck,
  setPlayerDeck,
  setSavedGames,
} from "../redux/contentSlice";
import { OpponentStoreDeck, SavedGame, StoreDeck } from ".";
import { Deck } from "../model/deck";
import { EmptyDeck } from "../model/emptyDeck";
import { EmptyOpponentDeck } from "../model/emptyOpponentDeck";
import { OpponentDeck } from "../model/opponentDeck";
import { store } from "../redux/store";
import { AnyAction, Dispatch } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export class Observer {
  /**
   * Stores the value of the player name.
   * Use - invoking Deck object constructor
   */
  static playerName: string = "";
  /**
   * Stores the value of the player's abbreviated name used in the client ".game-log" element.
   * Use - invoking Deck object constructor
   */
  static playerNick: string = "";
  /**
   * Stores the value of the opponent name.
   * Use - invoking Deck object constructor
   */
  static opponentName: string = "";
  /**
   * Stores the value of the opponent's abbreviated name used in the client ".game-log" element.
   * Use - invoking Deck object constructor
   */
  static opponentNick: string = "";
  /**
   * Use - Flow control.
   * False value means the 'gameLog' global is not yet initialized.
   * True value means the 'gameLog' global holds a value collected from the ".game-log" element in the client).
   */
  static logInitialized: boolean = false;
  /**
   *
   * Use - Flow control
   * False value means the 'kingdom' global is not yet initialized.
   * True value means the 'kingdom' global holds an array of string collected from the ".kingdom-viewer" element in the client).
   */
  static kingdomInitialized: boolean = false;
  /**
   * Use - Flow control.
   * False value means the 'playerName', 'playerNick', 'opponentName', and 'opponentNick' fields are not initialized.
   * True value means they each hold the appropriate string collected from the elements in the client DOM.
   */
  static playersInitialized: boolean = false;
  /**
   *
   * Use - Flow control.
   * False value means the Deck objects that will be used to track the game state are not yet created.
   * True value means a Deck object has been assigned to the value of the 'playerDeck' and another Deck
   * object has been assigned to the value of the 'opponentDeck' global variable.
   */
  static playerDeckInitialized: boolean = false;
  /**
   * Holds the value of which logs have already been sent to the Deck objects.
   * Use - Flow control.
   * Every time more logs are sent to the Deck object's update method, this variable is updated to include those
   * logs.  This variable is used to control logic by comparing possible new logs to those that have already been
   * processed by the Decks.
   */
  static logsProcessed: string = "";
  /**
   * Holds the value of the ".game-log" innerText from the client DOM.
   * Use 1 - When new content is detected in the client ".game-log" element, this variable is updated to contain the value
   * that element's innerText.
   * Use 2 - Control flow for the content script: the value of this variable is compared to the 'logsProcessed' global
   * to determine which logs to use when invoking the Deck objects' update() methods.
   */
  static gameLog: string = "";
  /**
   * Holds the value of whether or not the current game is rated.
   * Use - Deck constructor invocation.
   */
  static ratedGame: boolean = true;
  /**
   * Rating of the player of the player deck
   */
  static playerRating: string = "";
  /**
   * Rating of the player of opponent deck.
   */
  static opponentRating: string = "";
  /**
   *
   * Holds the values of the Deck objects.  The playerName and opponentName are used as the
   * keys for the corresponding Deck objects
   * Use - The decks track the game state for players. The update() method is
   * invoked on these Deck objects.
   */
  static decks: Map<string, Deck | OpponentDeck> = new Map();
  /**
   * Holds the strings that define the cards available in the current game.
   * Use - invoking Deck object constructor
   */
  static kingdom: Array<string> = [];
  /**
   * The current version of the extension does not support games that include
   * cards outside of the base set.  This variable will hold the value of true if the current kingdom is base set only.
   * It will hold false if the kingdom contains non-base cards.  The variable is used to disable extension features
   * if unsupported cards are detected.
   */
  static baseOnly: boolean = true;
  /**
   * Holds identifier for the initInterval - When no game is active, used to set an interval to periodically check if a game has become active,
   */
  static initInterval: NodeJS.Timeout | number;
  /**
   * Holds identifier for the resetInterval - When a game is active, used to set an interval to periodically check if the game is still active,
   * and if the game is not active, executes a game reset.
   */
  static resetInterval: NodeJS.Timeout | number;
  /**
   * Mutation Observers identifiers - Used to detect changes in the DOM.
   */
  static gameLogObserver: MutationObserver;
  static gameEndObserver: MutationObserver;
  static undoObserver: MutationObserver;
  // Redux dispatcher.
  static dispatch: Dispatch<AnyAction> = store.dispatch;

  /**
   * Compares the logs that have been processed with current game log to
   * check if there are any unprocessed logs.
   * Purpose: Control flow for updating Deck state.
   * @param logsProcessed - The logs that have already been processed into the Decks.
   * @param gameLog - The current game log.
   * @returns Boolean for whether there are new logs to be processed.
   */
  static areNewLogsToSend(logsProcessed: string, gameLog: string): boolean {
    let areNewLogs: boolean;
    const procArr = logsProcessed.split("\n").slice();
    const gLogArr = gameLog.split("\n").slice();
    const lastGameLogEntry = gLogArr.slice().pop();
    if (
      Observer.isLogEntryBuyWithoutGain(lastGameLogEntry!) ||
      Observer.isMerchantBonusLine(lastGameLogEntry!)
    ) {
      areNewLogs = false;
    } else if (procArr.length > gLogArr.length) {
      throw new Error("Processed logs Larger than game log");
    } else if (gLogArr.length > procArr.length) {
      areNewLogs = true;
    } else if (procArr.slice().pop() !== gLogArr.slice().pop()) {
      areNewLogs = true;
    } else areNewLogs = false;
    return areNewLogs;
  }

  /**
   * Checks for presence of <player-info-name> elements in the DOM.
   * Purpose: Control flow of content script.
   * @returns The boolean for whether the <player-info-name> elements are present in the dome.
   */
  static arePlayerInfoElementsPresent(): boolean {
    const playerElements = document.getElementsByTagName(
      "player-info-name"
    ) as HTMLCollectionOf<HTMLElement>;
    const playerElementsPresent = playerElements.length > 0;
    return playerElementsPresent;
  }

  /**
   * Function takes the current kingdom and checks it for any cards that are not in the base set.
   * @param kingdom - A kingdom from the client
   * @returns - A boolean, false if the kingdom contains cards outside of the base set, true otherwise.
   */
  static baseKingdomCardCheck(kingdom: string[]): boolean {
    let baseOnly: boolean = true;
    const baseCards = [
      "Cellar",
      "Chapel",
      "Moat",
      "Harbinger",
      "Merchant",
      "Vassal",
      "Village",
      "Workshop",
      "Bureaucrat",
      "Gardens",
      "Militia",
      "Moneylender",
      "Poacher",
      "Remodel",
      "Smithy",
      "Throne Room",
      "Bandit",
      "Council Room",
      "Festival",
      "Laboratory",
      "Library",
      "Market",
      "Mine",
      "Sentry",
      "Witch",
      "Artisan",
      "Copper",
      "Silver",
      "Gold",
      "Province",
      "Duchy",
      "Estate",
      "Curse",
    ];
    for (let i = 0; i < kingdom.length; i++) {
      if (!baseCards.includes(kingdom[i])) {
        baseOnly = false;
      }
    }
    return baseOnly;
  }

  /**
   * Creates a Deck map object, and creates a Deck instance for the player and
   * a deck for the opponent, and adds the decks to the map using the
   * playerNames as a key.  The params are required to call Deck's constructor.
   * Purpose: To initialize the global decks variable.
   * @param playerName - The player name.
   * @param playerNick - The player abbreviation used in logs.
   * @param opponentName - The opponent name.
   * @param opponentNick - The opponent abbreviation used in logs.
   * @param kingdom - The array of kingdom cards.
   * @returns Map object that contains both the player deck and opponent deck.
   */
  static createPlayerDecks(
    gameTitle: string,
    ratedGame: boolean,
    playerName: string,
    playerNick: string,
    playerRating: string,
    opponentName: string,
    opponentNick: string,
    opponentRating: string,
    kingdom: Array<string>
  ): Map<string, Deck | OpponentDeck> {
    let deckMap: Map<string, Deck | OpponentDeck> = new Map();
    deckMap.set(
      playerName,
      new Deck(
        gameTitle,
        ratedGame,
        playerRating,
        playerName,
        playerNick,
        kingdom
      )
    );
    deckMap.set(
      opponentName,
      new OpponentDeck(
        gameTitle,
        ratedGame,
        opponentRating,
        opponentName,
        opponentNick,
        kingdom
      )
    );
    return deckMap;
  }

  /**
   * Dispatches the setPlayerDeck and setOpponentDeck actions with the given StoreDeck and OpponentStoreDeck
   * as payloads.
   * @param dispatch - Redux dispatcher.
   * @param setPlayerDeck - Reducer from contentSlice that sets player deck state.
   * @param setOpponentDeck - Reducer from contentSlice that sets opponent deck state.
   * @param playerStoreDeck - The JSON version of playerDeck.
   * @param opponentStoreDeck - The JSON version of opponentDeck.
   */
  static dispatchUpdatedDecksToRedux(
    dispatch: Dispatch<AnyAction>,
    setPlayerDeck: ActionCreatorWithPayload<StoreDeck, "content/setPlayerDeck">,
    setOpponentDeck: ActionCreatorWithPayload<
      OpponentStoreDeck,
      "content/setOpponentDeck"
    >,
    playerStoreDeck: StoreDeck,
    opponentStoreDeck: OpponentStoreDeck
  ): void {
    dispatch(setPlayerDeck(playerStoreDeck));
    dispatch(setOpponentDeck(opponentStoreDeck));
  }

  /**
   * At the end of a game, determines the results of the game, and updates the decks with the results.
   */
  static gameEndObserverFunc() {
    const timeOutElements = Observer.getTimeOutElements();
    const gameEndMessage = timeOutElements[0].innerText;
    let gameEndReason: string = "None";
    if (timeOutElements[1] !== undefined) {
      gameEndReason = timeOutElements[1].innerText;
    }
    if (gameEndMessage === "The game has ended.") {
      let [victor, defeated] = Observer.getResult(
        Observer.decks,
        Observer.playerName,
        Observer.opponentName,
        gameEndReason
      );
      Observer.decks = Observer.setDecksGameResults(
        victor,
        defeated,
        Observer.playerName,
        Observer.opponentName,
        Observer.decks
      );
      Observer.dispatchUpdatedDecksToRedux(
        Observer.dispatch,
        setPlayerDeck,
        setOpponentDeck,
        JSON.parse(JSON.stringify(Observer.decks.get(Observer.playerName))),
        JSON.parse(JSON.stringify(Observer.decks.get(Observer.opponentName)))
      );
      Observer.saveGameData(Observer.gameLog, Observer.decks);
    }
  }

  /**
   * Gets the kingdom-viewer-group element from the DOM and iterates through the
   * name-layer elements within it.  Extracts the innerText of each name-layer and
   * pushes it to an array of strings.  Then adds default strings to the array, and
   * returns the array.
   * Purpose: To initialize the global variable kingdom.
   * @returns The array of strings containing the kingdom card available in the current game.
   */
  static getClientKingdom(): Array<string> {
    let kingdom: Array<string>;
    let cards = [];
    const kingdomViewerGroupElement = document.getElementsByClassName(
      "kingdom-viewer-group"
    )[0];
    if (kingdomViewerGroupElement !== undefined) {
      for (let elt of document
        .getElementsByClassName("kingdom-viewer-group")[0]
        .getElementsByClassName(
          "name-layer"
        ) as HTMLCollectionOf<HTMLElement>) {
        const card = elt.innerText.trim();
        cards.push(card);
      }
    } else {
      throw Error("The kingdom-viewer-group element is not present in the DOM");
    }
    [
      "Province",
      "Gold",
      "Duchy",
      "Silver",
      "Estate",
      "Copper",
      "Curse",
    ].forEach((card) => {
      cards.push(card);
    });
    kingdom = cards;
    return kingdom;
  }

  /**
   * Gets and returns the game log element's innerText, removing the
   * last line if it matches 'Premoves'.
   * Purpose: Update the global gameLog variable.
   * @returns The string of innerText of the game-log element.
   */
  static getGameLog(): string {
    const gameLogElement = document.getElementsByClassName(
      "game-log"
    )[0] as HTMLElement;
    let gameLog = gameLogElement.innerText;
    if (
      gameLog.split("\n")[gameLog.split("\n").length - 1].match("Premoves") !==
      null
    ) {
      gameLog = gameLog.split("\n").slice(0, -1).join("\n");
    }
    return gameLog;
  }

  static getNewLogsAndUpdateDecks(
    logsProcessed: string,
    gameLog: string,
    getUndispatchedLogs: Function,
    deckMap: Map<string, Deck | OpponentDeck>,
    playerName: string,
    opponentName: string
  ): { playerStoreDeck: StoreDeck; opponentStoreDeck: OpponentStoreDeck } {
    const newLogsToDispatch = getUndispatchedLogs(logsProcessed, gameLog)
      .split("\n")
      .slice();
    deckMap.get(playerName)?.update(newLogsToDispatch);
    deckMap.get(opponentName)?.update(newLogsToDispatch);
    return {
      playerStoreDeck: JSON.parse(JSON.stringify(deckMap.get(playerName))),
      opponentStoreDeck: JSON.parse(JSON.stringify(deckMap.get(opponentName))),
    };
  }

  /**
   * Gets the <player-info-name> elements from the DOM, and compares their
   * css properties to determine which contains the player name and which
   * Contains the opponentName, then returns those names.
   * Purpose: Initializing the global variable playerName and opponentName.
   * @param playerInfoElements - Collection of <player-info> elements.
   * @returns An array containing the playerName and opponentName as strings.
   */
  static getPlayerAndOpponentNameByComparingElementPosition(
    playerInfoElements: HTMLCollectionOf<HTMLElement>
  ): Array<string> {
    let playerName: string;
    let opponentName: string;
    const nameTransformMap: Map<string, number> = new Map();
    for (let element of playerInfoElements) {
      const nameElement = element.getElementsByTagName(
        "player-info-name"
      )[0] as HTMLElement;
      const nomen: string = nameElement.innerText;
      const transform: string = element.style.transform;
      const yTransForm: number = parseFloat(
        transform.split(" ")[1].replace("translateY(", "").replace("px)", "")
      );
      nameTransformMap.set(nomen, yTransForm);
    }
    //  Compare the yTransform values.  The greatest one gets assigned to player.
    playerName = [...nameTransformMap.entries()].reduce((prev, current) => {
      return prev[1] > current[1] ? prev : current;
    })[0];
    opponentName = [...nameTransformMap.entries()].reduce((prev, current) => {
      return prev[1] < current[1] ? prev : current;
    })[0];
    // similarly, we can assign the elements to reference variables...
    return [playerName, opponentName];
  }

  /**
   * Gets the <player-info elements> from the DOM and returns them.
   * Purpose: Part of initializing the global variables playerName and opponentName.
   * Used by viewer
   * @returns HTMLCollection<HTMLElement> of <player-info-elements>:
   */
  static getPlayerInfoElements(): HTMLCollectionOf<HTMLElement> {
    const playerInfoElements: HTMLCollectionOf<HTMLElement> =
      document.getElementsByTagName(
        "player-info"
      ) as HTMLCollectionOf<HTMLElement>;
    return playerInfoElements;
  }

  /**
   * Uses the gameLog and player name to determine the player
   * and opponent abbreviations used in the game log, and returns
   * them.
   * Purpose: Initialize the global variables playerNick and opponentNick.
   * @param gameLog - The gameLog global variable.
   * @param playerName - The playerName global variable.
   * @returns Array of two strings, the player nickname and opponent nickname.
   */
  static getPlayerNameAbbreviations(
    gameLog: string,
    playerName: string
  ): Array<string> {
    let playerNick: string = "";
    let opponentNick: string = "";
    const gameLogArr = gameLog.split("\n");
    let n1: string;
    let n2: string;
    let i: number = 0;
    for (i; i < gameLogArr.length; i++) {
      if (gameLogArr[i].match(" starts with ") !== null) {
        break;
      }
    }
    if (i !== gameLogArr.length) {
      n1 = gameLogArr[i]; // n1 player is the player going first.
      n2 = gameLogArr[i + 2];
      for (i = 0; i <= Math.min(n1.length, n2.length); i++) {
        if (n1[i].toLowerCase() !== n2[i].toLowerCase()) {
          n1 = n1.substring(0, i + 1).trim();
          n2 = n2.substring(0, i + 1).trim();
          break;
        }
      }
      if (playerName.substring(0, n1.length) == n1) {
        playerNick = n1;
        opponentNick = n2;
      } else {
        playerNick = n2;
        opponentNick = n1;
      }
    }
    return [playerNick, opponentNick];
  }

  /**
   * Gets the player ratings for rated games and returns them.
   * @param playerName
   * @param opponentName
   * @param gameLog
   * @returns - An array of the player ratings.
   * To do - make it work for multiple opponents.
   */
  static getPlayerRatings(
    playerName: string,
    opponentName: string,
    gameLog: string
  ): string[] {
    let playerRating: string = "Rating Not Found";
    let opponentRating: string = "Rating Not Found";
    let logArray = gameLog.split("\n");
    for (let i = 0; i < logArray.length; i++) {
      const entry = logArray[i];
      if (entry.match(playerName + ": ") !== null) {
        playerRating = entry.substring(entry.lastIndexOf(" ") + 1);
      } else if (entry.match(opponentName + ": ") !== null) {
        opponentRating = entry.substring(entry.lastIndexOf(" ") + 1);
      }
    }
    return [playerRating, opponentRating];
  }

  /**
   * Checks to see if the game is rated or unrated.
   * @param firstGameLogLine - First log entry of the game log.
   * @returns - Boolean for whether the game is rated or unrated.
   */
  static getRatedGameBoolean(firstGameLogLine: string): boolean {
    let ratedGame: boolean;
    if (firstGameLogLine.match(/ rated\./) !== null) {
      ratedGame = true;
    } else if (firstGameLogLine.match(/ unrated\./) !== null) {
      ratedGame = false;
    } else {
      throw new Error("Invalid firstGameLogLine " + firstGameLogLine);
    }
    return ratedGame;
  }

  /**
   * Gets the winner and loser of the game.
   * @param decks - the Map of participating decks.
   * @param playerName
   * @param opponentName
   * @param gameEndReason
   * @returns String array [victor, defeated]
   */
  static getResult(
    decks: Map<string, Deck | OpponentDeck>,
    playerName: string,
    opponentName: string,
    gameEndReason: string
  ): string[] {
    let victor: string;
    let defeated: string;
    if (gameEndReason === `${playerName} has resigned.`) {
      victor = opponentName;
      defeated = playerName;
    } else if (gameEndReason === `${opponentName} has resigned.`) {
      victor = playerName;
      defeated = opponentName;
    } else if (
      decks.get(opponentName)!.currentVP < decks.get(playerName)!.currentVP
    ) {
      victor = playerName;
      defeated = opponentName;
    } else if (
      decks.get(opponentName)!.currentVP > decks.get(playerName)!.currentVP
    ) {
      victor = opponentName;
      defeated = playerName;
    } else if (
      decks.get(opponentName)!.gameTurn > decks.get(playerName)!.gameTurn
    ) {
      victor = playerName;
      defeated = opponentName;
    } else if (
      decks.get(opponentName)!.gameTurn < decks.get(playerName)!.gameTurn
    ) {
      victor = opponentName;
      defeated = playerName;
    } else {
      victor = "None: tie";
      defeated = "None: tie";
    }

    return [victor, defeated];
  }

  /**
   * Returns the descendants of the <game-ended-notification> element with class 'timeout' as a
   * collection of HTMLelements, to be used to collect the results of a completed game.
   * @returns - HTMLCollection of the timeout elements.
   */
  static getTimeOutElements(): HTMLCollectionOf<HTMLElement> {
    let timeOutElements: HTMLCollectionOf<HTMLElement>;
    timeOutElements = document
      .getElementsByTagName("game-ended-notification")[0]
      .getElementsByClassName("timeout") as HTMLCollectionOf<HTMLElement>;
    return timeOutElements;
  }

  /**
   * Compares the logs that have been processed with the current
   * game log.  Gets the logs that have not been processed and
   * returns them.
   * Purpose: To get the new logs that are needed to update Deck state.
   * @param logsDispatched - Logs that have been processed into the Decks
   * @param gameLog - The entire game log.
   * @returns The logs that are present in the game log that have not yet been
   * processed into the Deck states.
   */
  static getUndispatchedLogs(logsDispatched: string, gameLog: string): string {
    let undispatchedLogs: string;
    let dispatchedArr: string[];
    if (logsDispatched !== "" && logsDispatched !== undefined) {
      dispatchedArr = logsDispatched.split("\n").slice();
    } else {
      dispatchedArr = [];
    }
    const gameLogArr = gameLog.split("\n").slice();
    if (dispatchedArr.length > gameLogArr.length) {
      throw new Error("More dispatched logs than game logs");
    } else if (dispatchedArr.length < gameLogArr.length) {
      const numberOfUndispatchedLines =
        gameLogArr.length - dispatchedArr.length;
      undispatchedLogs = gameLogArr
        .slice(-numberOfUndispatchedLines)
        .join("\n");
    } else {
      const lastGameLogLine = gameLogArr[gameLogArr.length - 1];
      const lastLogsDispatchedLine = dispatchedArr[dispatchedArr.length - 1];
      if (lastGameLogLine === lastLogsDispatchedLine) {
        undispatchedLogs = "No new logs";
        throw new Error("Equal # lines and last line also equal");
      } else {
        undispatchedLogs = lastGameLogLine;
      }
    }
    return undispatchedLogs!;
  }
  /**
   * Control flow function.
   * @returns boolean, true if all four of the globals within are true.
   */
  static initialized() {
    return (
      Observer.logInitialized &&
      Observer.playersInitialized &&
      Observer.kingdomInitialized &&
      Observer.playerDeckInitialized
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
    Observer.resetGame();
    if (!Observer.logInitialized) {
      console.log("Checking for log presence...");
      if (Observer.isGameLogPresent()) {
        console.log("Game log present, initializing...");
        Observer.gameLog = Observer.getGameLog();
        Observer.ratedGame = Observer.getRatedGameBoolean(
          Observer.gameLog.split("\n")[0]
        );
        Observer.logInitialized = true;
      }
    }
    if (!Observer.playersInitialized) {
      console.log("Checking for player elements presence...");
      if (Observer.arePlayerInfoElementsPresent()) {
        console.log("playerElements present, initializing...");
        [Observer.playerName, Observer.opponentName] =
          Observer.getPlayerAndOpponentNameByComparingElementPosition(
            Observer.getPlayerInfoElements()
          );
        [Observer.playerNick, Observer.opponentNick] =
          Observer.getPlayerNameAbbreviations(
            Observer.gameLog,
            Observer.playerName
          );
        Observer.playersInitialized = true;
        if (Observer.ratedGame) {
          [Observer.playerRating, Observer.opponentRating] =
            Observer.getPlayerRatings(
              Observer.playerName,
              Observer.opponentName,
              Observer.gameLog
            );
        }
      }
    }
    if (!Observer.kingdomInitialized) {
      console.log("Checking for kingdom presence...");
      if (Observer.isKingdomElementPresent()) {
        console.log("Kingdom present, initializing...");
        Observer.kingdom = Observer.getClientKingdom();
        Observer.baseOnly = Observer.baseKingdomCardCheck(Observer.kingdom);
        Observer.dispatch(setBaseOnly(Observer.baseOnly));
        if (!Observer.baseOnly) {
          console.error(
            "Game is not intended for cards outside of the Base Set"
          );
        }
        Observer.kingdomInitialized = true;
      }
    }
    if (!Observer.playerDeckInitialized) {
      console.log("Checking decks presence");
      if (Observer.playersInitialized && Observer.kingdomInitialized) {
        console.log("Decks not created... initializing decks.");
        Observer.decks = Observer.createPlayerDecks(
          Observer.gameLog
            .split("\n")[0]
            .substring(0, Observer.gameLog.split("\n")[0].lastIndexOf(" ") - 1),
          Observer.ratedGame,
          Observer.playerName,
          Observer.playerNick,
          Observer.playerRating,
          Observer.opponentName,
          Observer.opponentNick,
          Observer.opponentRating,
          Observer.kingdom
        );
        Observer.playerDeckInitialized = true;
      }
    }

    const resetCheckIntervalFunction = () => {
      if (!Observer.isGameLogPresent()) {
        clearInterval(Observer.resetInterval);
        Observer.initInterval = setInterval(
          Observer.initIntervalFunction,
          1000
        );
      }
    };

    if (Observer.initialized()) {
      console.log("Fields initialized...");
      Observer.resetDeckState();
      if (Observer.baseOnly) {
        Observer.dispatch(setGameActiveStatus(true));
        Observer.gameLogObserver = new MutationObserver(
          Observer.logObserverFunc
        );
        Observer.gameEndObserver = new MutationObserver(
          Observer.gameEndObserverFunc
        );
        Observer.undoObserver = new MutationObserver(Observer.undoObserverFunc);
        const gameLogElement = document.getElementsByClassName("game-log")[0];
        const gameEndElement = document.getElementsByTagName(
          "game-ended-notification"
        )[0];
        const logContainerElement =
          document.getElementsByClassName("log-container")[0];
        Observer.undoObserver.observe(logContainerElement, {
          childList: true,
        });
        Observer.gameLogObserver.observe(gameLogElement, {
          childList: true,
          characterData: true,
          characterDataOldValue: true,
          subtree: true,
        });
        Observer.gameEndObserver.observe(gameEndElement, {
          childList: true,
          subtree: true,
        });
        const newLogsToDispatch = Observer.getUndispatchedLogs(
          Observer.logsProcessed,
          Observer.gameLog
        ) // Initial dispatch
          .split("\n")
          .slice();
        Observer.decks.get(Observer.playerName)?.update(newLogsToDispatch);
        Observer.dispatch(
          setPlayerDeck(
            JSON.parse(JSON.stringify(Observer.decks.get(Observer.playerName)))
          )
        );
        Observer.decks.get(Observer.opponentName)?.update(newLogsToDispatch);
        Observer.dispatch(
          setOpponentDeck(
            JSON.parse(
              JSON.stringify(Observer.decks.get(Observer.opponentName))
            )
          )
        );
        Observer.logsProcessed = Observer.gameLog;
        Observer.saveGameData(Observer.gameLog, Observer.decks);
      }
      clearInterval(Observer.initInterval);
      Observer.resetInterval = setInterval(resetCheckIntervalFunction, 1000);
    }
  }

  /**
   * Checks for presence of game-log element in the DOM.
   * Purpose: Control flow of content script.
   * @returns  The boolean for whether the game-log is present.
   */
  static isGameLogPresent(): boolean {
    const gameLogElementCollection =
      document.getElementsByClassName("game-log");
    const gameLogElementCount = gameLogElementCollection.length;
    const gameLogPresent = gameLogElementCount > 0;
    return gameLogPresent;
  }

  /**
   * Checks for presence of kingdom-viewer-group element in the dom.
   * Purpose: Control flow for content script.
   * @returns The boolean for presence of the kingdom-viewer-group element.
   */
  static isKingdomElementPresent(): boolean {
    let kingdomPresent: boolean;
    kingdomPresent =
      document.getElementsByClassName("kingdom-viewer-group").length > 0;
    return kingdomPresent;
  }

  /**
   * Used in control flow for whether new logs should be collected.
   * The client will create buy-lines and then quickly remove them.
   * This function is used to ensure these do not trigger log collections.
   * @param logLine - The most recent line in the game-log;
   * @returns - Boolean for whether the most recent line is a
   */
  static isLogEntryBuyWithoutGain(logLine: string): boolean {
    let isBuyWithoutGain: boolean;
    if (logLine.match(" buys ") !== null && logLine.match(" gains ") === null) {
      isBuyWithoutGain = true;
    } else {
      isBuyWithoutGain = false;
    }
    return isBuyWithoutGain;
  }
  /**
   * Checks to see if the line is a Merchant bonus line.  Used to control ignore certain logs
   * from triggering areNewLogsToSend().
   * @param logLine - the given line.
   * @returns - boolean for whether the given line is a 'Merchant Bonus' line.
   */
  static isMerchantBonusLine(logLine: string): boolean {
    return logLine.match(/ gets \+\$\d+\. \(Merchant\)/) !== null;
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
    if (
      Observer.areNewLogsToSend(Observer.logsProcessed, Observer.getGameLog())
    ) {
      const gameLog = Observer.getGameLog();
      const { playerStoreDeck, opponentStoreDeck } =
        Observer.getNewLogsAndUpdateDecks(
          Observer.logsProcessed,
          gameLog,
          Observer.getUndispatchedLogs,
          Observer.decks,
          Observer.playerName,
          Observer.opponentName
        );
      Observer.dispatchUpdatedDecksToRedux(
        Observer.dispatch,
        setPlayerDeck,
        setOpponentDeck,
        playerStoreDeck,
        opponentStoreDeck
      );
      Observer.logsProcessed = gameLog;
    }
  }

  /**
   * Reset function.
   * 1) Sets all content globals to their initial state, and
   * 2) Disconnects the mutation observer
   */
  static resetGame() {
    Observer.playersInitialized = false;
    Observer.logInitialized = false;
    Observer.kingdomInitialized = false;
    Observer.playerDeckInitialized = false;
    Observer.logsProcessed;
    Observer.logsProcessed = "";
    Observer.gameLog = "";
    Observer.playerName = "";
    Observer.opponentName = "";
    Observer.decks = new Map();
    Observer.kingdom = [];
    Observer.baseOnly = true;
    Observer.dispatch(setBaseOnly(true));
    if (Observer.gameLogObserver !== undefined)
      Observer.gameLogObserver.disconnect();
    if (Observer.gameEndObserver !== undefined)
      Observer.gameEndObserver.disconnect();
    if (Observer.undoObserver !== undefined) Observer.undoObserver.disconnect();
  }

  static resetDeckState() {
    Observer.dispatch(
      setOpponentDeck(JSON.parse(JSON.stringify(new EmptyOpponentDeck())))
    );
    Observer.dispatch(
      setPlayerDeck(JSON.parse(JSON.stringify(new EmptyDeck())))
    );
  }

  /**
   * Callback function used for the 'beforeunload' event listener.
   * Added on render, removed on unmount.
   * @param event - The BeforeUnloadEvent
   */
  static saveBeforeUnload() {
    Observer.saveGameData(Observer.gameLog, Observer.decks);
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
      clearInterval(Observer.resetInterval);
      Observer.initInterval = setInterval(Observer.initIntervalFunction, 1000);
    }
  }

  static async saveGameData(
    gameLog: string,
    decks: Map<string, Deck | OpponentDeck>
  ) {
    const savedGame: SavedGame = {
      logArchive: gameLog,
      playerDeck: JSON.parse(JSON.stringify(decks.get(Observer.playerName))),
      opponentDeck: JSON.parse(
        JSON.stringify(decks.get(Observer.opponentName))
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
        Observer.dispatch(setSavedGames(result));
      });
    });
  }

  /**
   * Sets the given results to the given decks and returns the updated decks.
   * @param victor - The name of the winner of the game.
   * @param defeated - The name of the loser of the game.
   * @param playerName - The player's name.
   * @param opponentName - The opponent's name
   * @param decks - The map containing the decks.
   * @returns - The updated decks.
   */
  static setDecksGameResults(
    victor: string,
    defeated: string,
    playerName: string,
    opponentName: string,
    decks: Map<string, Deck | OpponentDeck>
  ): Map<string, Deck | OpponentDeck> {
    let updatedDecks = new Map(decks);
    if (victor === playerName) {
      updatedDecks.get(playerName)!.setGameResult("Victory");
      updatedDecks.get(opponentName)!.setGameResult("Defeat");
    } else if (defeated === playerName) {
      updatedDecks.get(opponentName)!.setGameResult("Victory");
      updatedDecks.get(playerName)!.setGameResult("Defeat");
    } else {
      updatedDecks.get(playerName)!.setGameResult("Tie");
      updatedDecks.get(opponentName)!.setGameResult("Tie");
    }
    return updatedDecks;
  }
}
