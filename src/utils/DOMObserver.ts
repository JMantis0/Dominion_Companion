import {
  setBaseOnly,
  setError,
  setGameActiveStatus,
  setOpponentDecks,
  setPlayerDeck,
  setSavedGames,
} from "../redux/contentSlice";
import {
  DOMStore,
  ErrorWithMessage,
  GameResult,
  OpponentStoreDeck,
  SavedGame,
  SavedGames,
  StoreDeck,
} from ".";
import { OpponentDeck } from "../model/opponentDeck";
import { store } from "../redux/store";
import { AnyAction, Dispatch } from "redux";
import { Deck } from "../model/deck";
import { EmptyDeck } from "../model/emptyDeck";
import { EmptyOpponentDeck } from "../model/emptyOpponentDeck";
import { toErrorWithMessage } from "./utils";

export class DOMObserver {
  /**
   * The current version of the extension does not support games that include
   * cards outside of the base set.  This variable will hold the value of true if the current kingdom is base set only.
   * It will hold false if the kingdom contains non-base cards.  The variable is used to disable extension features
   * if unsupported cards are detected.
   */
  static baseOnly: boolean = true;
  /**
   * Holds the values of the Deck objects.  The playerName and opponentName are used as the
   * keys for the corresponding Deck objects
   * Use - The decks track the game state for players. The update() method is
   * invoked on these Deck objects.
   */
  static decks: Map<string, Deck | OpponentDeck> = new Map([
    ["", new Deck("", false, "", "", "", [])],
    ["", new OpponentDeck("", false, "", "", "", [])],
  ]);
  /**
   * Use - Flow control.
   * False value means the Deck objects that will be used to track the game state are not yet created.
   * True value means a Deck object has been assigned to the value of the 'playerDeck' and another Deck
   * object has been assigned to the value of the 'opponentDeck' global variable.
   */
  static decksInitialized: boolean = false;
  /**
   * Redux dispatcher.
   */
  static dispatch: Dispatch<AnyAction> = store.dispatch;
  /**
   * Game end MutationObserver.  Detects changes in the game end element, and triggers
   * the game end handler,
   */
  static gameEndObserver: MutationObserver | undefined;
  /**
   * Holds the value of the ".game-log" innerText from the client DOM.
   * Use 1 - When new content is detected in the client ".game-log" element, this variable is updated to contain the value
   * that element's innerText.
   * Use 2 - Control flow for the content script: the value of this variable is compared to the 'logsProcessed' global
   * to determine which logs to use when invoking the Deck objects' update() methods.
   */
  static gameLog: string = "";
  /**
   * Game log MutationObserver.  Detects changes in the game-log and triggers deck updates.
   */
  static gameLogObserver: MutationObserver | undefined;
  /**
   * Holds identifier for the initInterval - When no game is active, used to set an interval to periodically check if a game has become active,
   */
  static initInterval: NodeJS.Timeout | number;
  /**
   * Holds the strings that define the cards available in the current game.
   * Use - invoking Deck object constructor
   */
  static kingdom: string[] = [];
  /**
   * Use - Flow control
   * False value means the 'kingdom' global is not yet initialized.
   * True value means the 'kingdom' global holds an array of string collected from the ".kingdom-viewer" element in the client).
   */
  static kingdomInitialized: boolean = false;
  /**
   * Use - Flow control.
   * False value means the 'gameLog' global is not yet initialized.
   * True value means the 'gameLog' global holds a value collected from the ".game-log" element in the client).
   */
  static logInitialized: boolean = false;
  /**
   * Holds the value of which logs have already been sent to the Deck objects.
   * Use - Flow control.
   * Every time more logs are sent to the Deck object's update method, this variable is updated to include those
   * logs.  This variable is used to control logic by comparing possible new logs to those that have already been
   * processed by the Decks.
   */
  static logsProcessed: string = "";
  /**
   * Stores the value of the opponent name.
   * Use - invoking Deck object constructor
   */
  static opponentNames: string[] = [];
  /**
   * Stores the value of the opponent's abbreviated name used in the client ".game-log" element.
   * Use - invoking Deck object constructor
   */
  static opponentNicks: string[] = [];
  /**
   * Rating of the player of opponent deck.
   */
  static opponentRatings: string[] = [];
  /**
   * Use - Flow control.
   * False value means the 'playerName', 'playerNick', 'opponentName', and 'opponentNick' fields are not initialized.
   * True value means they each hold the appropriate string collected from the elements in the client DOM.
   */
  static playersInitialized: boolean = false;
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
   * Rating of the player of the player deck
   */
  static playerRating: string = "";
  /**
   * Holds the value of whether or not the current game is rated.
   * Use - Deck constructor invocation.
   */
  static ratedGame: boolean = true;
  /**
   * Holds identifier for the resetInterval - When a game is active, used to set an interval to periodically check if the game is still active,
   * and if the game is not active, executes a game reset.
   */
  static resetInterval: NodeJS.Timeout | number;

  /**
   * The redux store to be used by the DOMObserver.
   */
  static store: DOMStore = store;

  /**
   * Undo / rewind mutation observer.  Detects changes in the game log container and triggers
   * the undo / rewind handler.
   */
  static undoObserver: MutationObserver | undefined;

  static getBaseOnly() {
    return DOMObserver.baseOnly;
  }
  static setBaseOnly(baseOnly: boolean): void {
    DOMObserver.baseOnly = baseOnly;
  }
  static getDecks(): Map<string, Deck | OpponentDeck> {
    return DOMObserver.decks;
  }
  static setDecks(decks: Map<string, Deck | OpponentDeck>): void {
    DOMObserver.decks = decks;
  }
  static getDecksInitialized(): boolean {
    return DOMObserver.decksInitialized;
  }
  static setDecksInitialized(decksInitialized: boolean): void {
    DOMObserver.decksInitialized = decksInitialized;
  }
  static getDispatch(): Dispatch<AnyAction> {
    return DOMObserver.dispatch;
  }
  static setDispatch(dispatch: Dispatch<AnyAction>): void {
    DOMObserver.dispatch = dispatch;
  }
  static getGameEndObserver(): MutationObserver | undefined {
    return DOMObserver.gameEndObserver;
  }
  static setGameEndObserver(
    gameEndObserver: MutationObserver | undefined
  ): void {
    DOMObserver.gameEndObserver = gameEndObserver;
  }
  static getGameLog(): string {
    return DOMObserver.gameLog;
  }
  static setGameLog(gameLog: string): void {
    DOMObserver.gameLog = gameLog;
  }
  static getGameLogObserver(): MutationObserver | undefined {
    return DOMObserver.gameLogObserver;
  }
  static setGameLogObserver(gameLogObserver: MutationObserver | undefined) {
    DOMObserver.gameLogObserver = gameLogObserver;
  }
  static getInitInterval(): NodeJS.Timeout | number {
    return DOMObserver.initInterval;
  }
  static setInitInterval(initInterval: NodeJS.Timeout | number) {
    DOMObserver.initInterval = initInterval;
  }
  static getKingdom(): string[] {
    return DOMObserver.kingdom;
  }
  static setKingdom(kingdom: string[]) {
    DOMObserver.kingdom = kingdom;
  }
  static getKingdomInitialized(): boolean {
    return DOMObserver.kingdomInitialized;
  }
  static setKingdomInitialized(kingdomInitialized: boolean): void {
    DOMObserver.kingdomInitialized = kingdomInitialized;
  }
  static getLogInitialized(): boolean {
    return DOMObserver.logInitialized;
  }
  static setLogInitialized(logInitialized: boolean): void {
    DOMObserver.logInitialized = logInitialized;
  }
  static getLogsProcessed(): string {
    return DOMObserver.logsProcessed;
  }
  static setLogsProcessed(logsProcessed: string): void {
    DOMObserver.logsProcessed = logsProcessed;
  }
  static getOpponentNames(): string[] {
    return DOMObserver.opponentNames;
  }
  static setOpponentNames(opponentNames: string[]): void {
    DOMObserver.opponentNames = opponentNames;
  }
  static getOpponentNicks(): string[] {
    return DOMObserver.opponentNicks;
  }
  static setOpponentNicks(opponentNicks: string[]): void {
    DOMObserver.opponentNicks = opponentNicks;
  }
  static getOpponentRatings(): string[] {
    return DOMObserver.opponentRatings;
  }
  static setOpponentRatings(opponentRatings: string[]): void {
    DOMObserver.opponentRatings = opponentRatings;
  }
  static getPlayersInitialized(): boolean {
    return DOMObserver.playersInitialized;
  }
  static setPlayersInitialized(playersInitialized: boolean): void {
    DOMObserver.playersInitialized = playersInitialized;
  }
  static getPlayerName(): string {
    return DOMObserver.playerName;
  }
  static setPlayerName(playerName: string): void {
    DOMObserver.playerName = playerName;
  }
  static getPlayerNick(): string {
    return DOMObserver.playerNick;
  }
  static setPlayerNick(playerNick: string): void {
    DOMObserver.playerNick = playerNick;
  }
  static getPlayerRating(): string {
    return DOMObserver.playerRating;
  }
  static setPlayerRating(playerRating: string): void {
    DOMObserver.playerRating = playerRating;
  }
  static getRatedGame(): boolean {
    return DOMObserver.ratedGame;
  }
  static setRatedGame(ratedGame: boolean): void {
    DOMObserver.ratedGame = ratedGame;
  }
  static getResetInterval(): NodeJS.Timeout | number {
    return DOMObserver.resetInterval;
  }
  static setResetInterval(resetInterval: NodeJS.Timeout | number): void {
    DOMObserver.resetInterval = resetInterval;
  }
  static getStore(): DOMStore {
    return DOMObserver.store;
  }
  static setStore(store: DOMStore) {
    DOMObserver.store = store;
  }
  static getUndoObserver(): MutationObserver | undefined {
    return DOMObserver.undoObserver;
  }
  static setUndoObserver(undoObserver: MutationObserver | undefined): void {
    DOMObserver.undoObserver = undoObserver;
  }

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
      DOMObserver.isLogEntryBuyWithoutGain(lastGameLogEntry!)
      // || DOMObserver.isMerchantBonusLine(lastGameLogEntry!)
    ) {
      areNewLogs = false;
    } else if (
      procArr.length === gLogArr.length + 1 &&
      DOMObserver.isMerchantBonusLine(lastGameLogEntry!)
    ) {
      return true;
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
      "Colony",
      "Platinum",
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
  static createPlayerDecks(): Map<string, Deck | OpponentDeck> {
    const deckMap: Map<string, Deck | OpponentDeck> = new Map();
    const gameTitle = DOMObserver.gameLog
      .split("\n")[0]
      .substring(0, DOMObserver.gameLog.split("\n")[0].lastIndexOf(" ") - 1);
    deckMap.set(
      DOMObserver.playerName,
      new Deck(
        gameTitle,
        DOMObserver.ratedGame,
        DOMObserver.playerRating,
        DOMObserver.playerName,
        DOMObserver.playerNick,
        DOMObserver.kingdom
      )
    );
    DOMObserver.opponentNames.forEach((opponentName: string, idx) => {
      deckMap.set(
        opponentName,
        new OpponentDeck(
          gameTitle,
          DOMObserver.ratedGame,
          DOMObserver.opponentRatings[idx],
          opponentName,
          DOMObserver.opponentNicks[idx],
          DOMObserver.kingdom
        )
      );
    });
    return deckMap;
  }

  /**
   * Initialization method. Creates the player deck and opponent deck using
   * the information stored in the class fields.
   */
  static deckMapInitializer(): void {
    if (DOMObserver.playersInitialized && DOMObserver.kingdomInitialized) {
      DOMObserver.setDecks(DOMObserver.createPlayerDecks());
      DOMObserver.decksInitialized = true;
    }
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
    playerStoreDeck: StoreDeck,
    opponentStoreDecks: OpponentStoreDeck[]
  ): void {
    DOMObserver.dispatch(setPlayerDeck(playerStoreDeck));
    DOMObserver.dispatch(setOpponentDecks(opponentStoreDecks));
  }

  /**
   * At the end of a game, determines the results of the game, and updates the decks with the results.
   */
  static gameEndObserverFunc() {
    const timeOutElements = DOMObserver.getTimeOutElements();
    const gameEndMessage = timeOutElements[0].innerText;
    let gameEndReason: string = "None";
    if (timeOutElements[1] !== undefined) {
      gameEndReason = timeOutElements[1].innerText;
    }
    if (gameEndMessage === "The game has ended.") {
      let results: Map<number, string[]>;
      if (DOMObserver.opponentNames.length === 1) {
        results = DOMObserver.getResult(
          DOMObserver.decks,
          DOMObserver.playerName,
          DOMObserver.opponentNames,
          gameEndReason
        );
      } else {
        results = DOMObserver.getResultMultiPlayer(
          DOMObserver.decks,
          DOMObserver.playerName,
          DOMObserver.opponentNames,
          gameEndReason
        );
      }
      DOMObserver.decks = DOMObserver.setDecksGameResults(
        results,
        DOMObserver.decks
      );
      const opponentStoreDecks: OpponentStoreDeck[] = [];
      DOMObserver.opponentNames.forEach((opponentName: string) => {
        opponentStoreDecks.push(
          JSON.parse(JSON.stringify(DOMObserver.decks.get(opponentName)))
        );
      });
      DOMObserver.dispatchUpdatedDecksToRedux(
        JSON.parse(
          JSON.stringify(DOMObserver.decks.get(DOMObserver.playerName))
        ),
        opponentStoreDecks
      );
      DOMObserver.saveGameData(DOMObserver.gameLog, DOMObserver.decks);
    }
  }

  /**
   * Gets and returns the game log element's innerText, removing the
   * last line if it matches 'Premoves'.
   * Purpose: Update the global gameLog variable.
   * @returns The string of innerText of the game-log element.
   */
  static getClientGameLog(): string {
    const gameLogElement = document.getElementsByClassName(
      "game-log"
    )[0] as HTMLElement;
    if (gameLogElement === undefined) {
      throw new Error("No game-log element present in the DOM.");
    }
    let gameLog = gameLogElement.innerText;
    if (
      gameLog.split("\n")[gameLog.split("\n").length - 1].match("Premoves") !==
      null
    ) {
      gameLog = gameLog.split("\n").slice(0, -1).join("\n");
    }
    return gameLog;
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
    const kingdomSet = new Set<string>();
    const kingdomViewerGroupElement = document.getElementsByClassName(
      "kingdom-viewer-group"
    )[0];
    if (kingdomViewerGroupElement !== undefined) {
      for (const elt of document
        .getElementsByClassName("card-stacks")[0]
        .getElementsByClassName(
          "name-layer"
        ) as HTMLCollectionOf<HTMLElement>) {
        const card = elt.innerText.trim();
        if (card !== "") kingdomSet.add(card);
      }
    } else {
      throw Error("The kingdom-viewer-group element is not present in the DOM");
    }
    return Array.from(kingdomSet);
  }

  /**
   * Method gets new logs from the DOM, invokes the update method on the current decks with the new logs,
   * then returns the updated decks.
   * @param gameLog - value of gameLog field
   * @returns StoreDeck and OpponentStoreDeck for the updated decks.
   */
  static getNewLogsAndUpdateDecks(gameLog: string): {
    playerStoreDeck: StoreDeck;
    opponentStoreDecks: OpponentStoreDeck[];
  } {
    const newLogsToDispatch = DOMObserver.getUndispatchedLogs(
      DOMObserver.logsProcessed,
      gameLog
    )
      .split("\n")
      .slice();
    try {
      DOMObserver.decks.get(DOMObserver.playerName)!.update(newLogsToDispatch);
      DOMObserver.opponentNames.forEach((opponentName: string) => {
        DOMObserver.decks.get(opponentName)!.update(newLogsToDispatch);
      });
    } catch (error: unknown) {
      const errorWithMessage = toErrorWithMessage(error);
      DOMObserver.handleDeckError(errorWithMessage);
    }
    const opponentStoreDecks: OpponentStoreDeck[] = [];
    DOMObserver.opponentNames.forEach((opponentName: string) => {
      opponentStoreDecks.push(
        JSON.parse(JSON.stringify(DOMObserver.decks.get(opponentName)))
      );
    });
    return {
      playerStoreDeck: JSON.parse(
        JSON.stringify(DOMObserver.decks.get(DOMObserver.playerName))
      ),
      opponentStoreDecks,
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
  ): { playerName: string; opponentNames: string[] } {
    const nameTransformMap: Map<string, number> = new Map();
    for (const element of playerInfoElements) {
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
    const playerName: string = [...nameTransformMap.entries()].reduce(
      (prev, current) => {
        return prev[1] > current[1] ? prev : current;
      }
    )[0];
    const allNames = Array.from(nameTransformMap.keys());
    const playerNameIndex = allNames.indexOf(playerName);
    allNames.splice(playerNameIndex, 1);
    const opponentNames = allNames;
    // similarly, we can assign the elements to reference variables...
    return { playerName, opponentNames };
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
    if (playerInfoElements.length === 0) {
      throw new Error("No <player-info> elements found in the DOM.");
    }
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
    playerName: string,
    opponentNames: string[]
  ): { playerNick: string; opponentNicks: string[] } {
    const gameLogArr = gameLog.split("\n");

    let i: number = 0;
    for (i; i < gameLogArr.length; i++) {
      if (gameLogArr[i].match(" starts with ") !== null) {
        break;
      }
    }

    let j: number = i;
    for (j; j < gameLogArr.length; j++) {
      if (gameLogArr[j].match(" starts with ") === null) break;
    }

    const opponentNicks: string[] = [];
    for (let f = 0; f < opponentNames.length; f++) {
      for (let x = i; x < j; x++) {
        const nick = gameLogArr[x].substring(
          0,
          gameLogArr[x].indexOf(" starts with ")
        );
        if (nick === opponentNames[f].substring(0, nick.length)) {
          opponentNicks.push(nick);
          break;
        }
      }
    }

    let playerNick: string = "";
    for (let x = i; x < j; x++) {
      const nick = gameLogArr[x].substring(
        0,
        gameLogArr[x].indexOf(" starts with ")
      );
      if (nick === playerName.substring(0, nick.length)) {
        playerNick = nick;
        break;
      }
    }

    return { playerNick, opponentNicks };
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
    opponentNames: string[],
    gameLog: string
  ): { playerRating: string; opponentRatings: string[] } {
    let playerRating: string = "Rating Not Found";
    const opponentRatings: string[] = [];
    const logArray = gameLog.split("\n");
    for (let i = 0; i < logArray.length; i++) {
      const entry = logArray[i];
      if (entry.match(playerName + ": ") !== null) {
        playerRating = entry.substring(entry.lastIndexOf(" ") + 1);
      } else {
        for (let j = 0; j < opponentNames.length; j++) {
          if (entry.match(opponentNames[j] + ": ") !== null) {
            opponentRatings.push(entry.substring(entry.lastIndexOf(" ") + 1));
          }
        }
      }
    }
    return { playerRating, opponentRatings };
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
      throw new Error("Unable to determine if game is rated.");
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
    opponentNames: string[],
    gameEndReason: string
  ): Map<number, string[]> {
    const opponentName = opponentNames[0];
    const resultMap = new Map<number, string[]>();
    if (gameEndReason === `${playerName} has resigned.`) {
      resultMap.set(1, [opponentName]);
      resultMap.set(2, [playerName]);
    } else if (gameEndReason === `${opponentName} has resigned.`) {
      resultMap.set(1, [playerName]);
      resultMap.set(2, [opponentName]);
    } else if (
      decks.get(opponentName)!.currentVP < decks.get(playerName)!.currentVP
    ) {
      resultMap.set(1, [playerName]);
      resultMap.set(2, [opponentName]);
    } else if (
      decks.get(opponentName)!.currentVP > decks.get(playerName)!.currentVP
    ) {
      resultMap.set(1, [opponentName]);
      resultMap.set(2, [playerName]);
    } else if (
      decks.get(opponentName)!.gameTurn > decks.get(playerName)!.gameTurn
    ) {
      resultMap.set(1, [playerName]);
      resultMap.set(2, [opponentName]);
    } else if (
      decks.get(opponentName)!.gameTurn < decks.get(playerName)!.gameTurn
    ) {
      resultMap.set(1, [opponentName]);
      resultMap.set(2, [playerName]);
    } else {
      resultMap.set(1, [playerName, opponentName]);
    }
    return resultMap;
  }

  /**
   * Gets the result for games that have more than one opponent.
   * @param playerName - The name of the player.
   * @param opponentNames - The names of all the opponents.
   * @param gameEndReason - The game end reason.
   * @param decks - Map of the decks
   * @returns - an object with a victor string and a defeated array, sorted by place.
   */
  static getResultMultiPlayer(
    decks: Map<string, Deck | OpponentDeck>,
    playerName: string,
    opponentNames: string[],
    gameEndReason: string
  ): Map<number, string[]> {
    const allNames = opponentNames.concat(playerName);
    // If a player resigned, gets that playerName.
    const resigned: string[] = [];
    if (gameEndReason.match(" has resigned.") !== null) {
      for (let i = 0; i < allNames.length; i++) {
        const name = allNames[i];
        if (gameEndReason === `${name} has resigned.`) {
          resigned.push(name);
          allNames.splice(allNames.indexOf(resigned[0]), 1);
          break;
        }
      }
    }
    // Sorts the playerNames by their VP/Turns and
    // collects details for any tied players.Cl
    const tiedPlayers: Map<string, string[]> = new Map();
    allNames.sort((a, b) => {
      const deckA = decks.get(a)!;
      const deckB = decks.get(b)!;
      let result = deckB.currentVP - deckA.currentVP;
      if (result === 0) {
        result = deckA.gameTurn - deckB.gameTurn;
      }
      if (result === 0) {
        const tiedKey = deckA.currentVP + " VP " + deckA.gameTurn + " Turns";
        const alreadyTied = tiedPlayers.has(tiedKey)
          ? tiedPlayers.get(tiedKey)!
          : [];
        const playersToAdd = [];
        if (!alreadyTied.includes(a)) playersToAdd.push(a);
        if (!alreadyTied.includes(b)) playersToAdd.push(b);
        tiedPlayers.set(tiedKey, alreadyTied.concat(playersToAdd).sort());
      }
      return result;
    });
    // Creates the result map to return.
    const resultMap = new Map<number, string[]>();
    const tiedPlayerNames = Array.from(tiedPlayers.values());
    for (let i = 0; i < allNames.length; i++) {
      const place = i + 1;
      const player = allNames[i];
      let tiedPlayer: boolean = false;
      let tiedIndex: number = -1;
      tiedPlayerNames.forEach((nameSet, idx) => {
        if (nameSet.includes(player)) {
          tiedPlayer = true;
          tiedIndex = idx;
        }
      });
      if (tiedPlayer) {
        resultMap.set(place, tiedPlayerNames[tiedIndex]);
        i += tiedPlayerNames[tiedIndex].length - 1;
        tiedPlayerNames.splice(tiedIndex, 1);
      } else {
        resultMap.set(place, [player]);
      }
    }
    // If any player resigned adds that player to last place.
    if (resigned.length === 1) {
      resultMap.set(allNames.length + 1, [resigned[0]]);
    }
    return resultMap;
  }

  /**
   * Returns the descendants of the <game-ended-notification> element with class 'timeout' as a
   * collection of HTMLelements, to be used to collect the results of a completed game.
   * @returns - HTMLCollection of the timeout elements.
   */
  static getTimeOutElements(): HTMLCollectionOf<HTMLElement> {
    const timeOutElements: HTMLCollectionOf<HTMLElement> = document
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
    if (
      dispatchedArr.length === gameLogArr.length + 1 &&
      DOMObserver.isMerchantBonusLine(gameLogArr[gameLogArr.length - 1])
    ) {
      undispatchedLogs = gameLogArr[gameLogArr.length - 1];
    } else if (dispatchedArr.length > gameLogArr.length) {
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
        throw new Error("No new logs.");
      } else {
        undispatchedLogs = lastGameLogLine;
      }
    }
    return undispatchedLogs!;
  }

  /**
   * Dispatches ActionCreator setError with the given error's message as payload.
   * PrimaryFrame component uses this redux value to render error details in the viewer.
   * @param error - an error from a deck's update method.
   */
  static handleDeckError(error: ErrorWithMessage) {
    console.error("error:", error);
    DOMObserver.dispatch(setError(error.message));
  }

  /**
   * Control flow method.
   * @returns boolean, true if all four of the globals within are true.
   */
  static initialized() {
    return (
      DOMObserver.logInitialized &&
      DOMObserver.playersInitialized &&
      DOMObserver.kingdomInitialized &&
      DOMObserver.decksInitialized
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
  static initIntervalCallback() {
    DOMObserver.resetGame();
    DOMObserver.logInitializer();
    DOMObserver.playersInitializer();
    DOMObserver.kingdomInitializer();
    DOMObserver.deckMapInitializer();
    if (DOMObserver.initialized()) {
      DOMObserver.resetReduxDeckState();
      if (DOMObserver.baseOnly) {
        // Set redux active game status
        DOMObserver.dispatch(setGameActiveStatus(true));
        // Initialize Mutation Observers
        DOMObserver.mutationObserverInitializer();
        // Execute the logObserverFunc to initialize the very first
        // decks update.
        DOMObserver.logObserverFunc();
        // Save the initial game data.
        DOMObserver.saveGameData(DOMObserver.gameLog, DOMObserver.decks);
      }
      clearInterval(DOMObserver.initInterval);
      DOMObserver.resetInterval = setInterval(
        DOMObserver.resetCheckIntervalCallback,
        1000
      );
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
    const kingdomPresent: boolean =
      document.getElementsByClassName("kingdom-viewer-group").length > 0;
    return kingdomPresent;
  }

  /**
   * Used in control flow for whether new logs should be collected.
   * The client will create buy-lines and then quickly remove them.
   * This method is used to ensure these do not trigger log collections.
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
   * Initializer method.  If the kingdom element is present in the DOM,
   * sets the kingdom, baseOnly, and kingdomInitialized fields, and dispatches the
   * setBaseOnly redux action.
   */
  static kingdomInitializer(): void {
    if (DOMObserver.isKingdomElementPresent()) {
      DOMObserver.setKingdom(DOMObserver.getClientKingdom());
      DOMObserver.setBaseOnly(
        DOMObserver.baseKingdomCardCheck(DOMObserver.kingdom)
      );
      DOMObserver.dispatch(setBaseOnly(DOMObserver.baseOnly));
      if (!DOMObserver.baseOnly) {
        console.log("Game is not intended for cards outside of the Base Set");
      }
      DOMObserver.setKingdomInitialized(true);
    }
  }

  /**
   * Initializer method. If the game log element is present in the DOM,
   * sets the gameLog, ratedGame, and logInitialized fields.
   */
  static logInitializer(): void {
    if (DOMObserver.isGameLogPresent()) {
      DOMObserver.setGameLog(DOMObserver.getClientGameLog());
      DOMObserver.setRatedGame(
        DOMObserver.getRatedGameBoolean(DOMObserver.gameLog.split("\n")[0])
      );
      DOMObserver.setLogInitialized(true);
    }
  }

  /**
   * Mutation observer method for the Mutation Observer to use
   * when observing the ".game-log element" in the Client.
   * Use - When a mutation of time "childList" occurs in the ".game-log" element
   * of the client DOM, this method triggers.
   * Logic ensures that action is only taken if the mutation created added nodes,
   * and only if the last of the added nodes has an innerText value.
   * If the last added node has an innerText value, then another logic checks
   * if there are any new logs using the areNewLogsToSend() method.  If there
   * are new logs, they are obtained with the getUndispatchedLogs() method and
   * the Deck objects' update() methods are invoked using the new logs as an argument,
   * and finally, the global variable 'logsProcessed' is updated.
   */
  static logObserverFunc() {
    const gameLog = DOMObserver.getClientGameLog();
    if (DOMObserver.areNewLogsToSend(DOMObserver.logsProcessed, gameLog)) {
      const storeDecks = DOMObserver.getNewLogsAndUpdateDecks(gameLog);
      const playerStoreDeck: StoreDeck = storeDecks.playerStoreDeck;
      const opponentStoreDecks: OpponentStoreDeck[] =
        storeDecks.opponentStoreDecks;
      DOMObserver.dispatchUpdatedDecksToRedux(
        playerStoreDeck,
        opponentStoreDecks
      );
      DOMObserver.logsProcessed = gameLog;
    }
  }

  /**
   * Initializes the MutationObservers with the appropriate callbacks and begins observing the
   * game-log, game-ended, and log-container elements.
   */
  static mutationObserverInitializer(): void {
    DOMObserver.setGameLogObserver(
      new MutationObserver(DOMObserver.logObserverFunc)
    );
    DOMObserver.setGameEndObserver(
      new MutationObserver(DOMObserver.gameEndObserverFunc)
    );
    DOMObserver.setUndoObserver(
      new MutationObserver(DOMObserver.undoObserverFunc)
    );
    const gameLogElement = document.getElementsByClassName("game-log")[0];
    const gameEndElement = document.getElementsByTagName(
      "game-ended-notification"
    )[0];
    const logContainerElement =
      document.getElementsByClassName("log-container")[0];
    DOMObserver.undoObserver!.observe(logContainerElement, {
      childList: true,
      subtree: true,
    });
    DOMObserver.gameLogObserver!.observe(gameLogElement, {
      childList: true,
      subtree: true,
    });
    DOMObserver.gameEndObserver!.observe(gameEndElement, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Initialization method.  Checks the DOM for the presence of a player-info elements and
   * if present initializes the player and opponent related fields
   */
  static playersInitializer(): void {
    if (DOMObserver.arePlayerInfoElementsPresent()) {
      const { playerName, opponentNames } =
        DOMObserver.getPlayerAndOpponentNameByComparingElementPosition(
          DOMObserver.getPlayerInfoElements()
        );
      DOMObserver.setPlayerName(playerName);
      DOMObserver.setOpponentNames(opponentNames);
      const { playerNick, opponentNicks } =
        DOMObserver.getPlayerNameAbbreviations(
          DOMObserver.gameLog,
          DOMObserver.playerName,
          DOMObserver.opponentNames
        );
      DOMObserver.setPlayerNick(playerNick);
      DOMObserver.setOpponentNicks(opponentNicks);
      if (DOMObserver.ratedGame) {
        const { playerRating, opponentRatings } = DOMObserver.getPlayerRatings(
          DOMObserver.playerName,
          DOMObserver.opponentNames,
          DOMObserver.gameLog
        );
        DOMObserver.setPlayerRating(playerRating);
        DOMObserver.setOpponentRatings(opponentRatings);
      }
      DOMObserver.setPlayersInitialized(true);
    }
  }

  /**
   * Reset method.
   * 1) Sets all content globals to their initial state, and
   * 2) Disconnects the mutation observer
   */
  static resetGame() {
    DOMObserver.setPlayersInitialized(false);
    DOMObserver.setLogInitialized(false);
    DOMObserver.setKingdomInitialized(false);
    DOMObserver.setDecksInitialized(false);
    DOMObserver.setLogsProcessed("");
    DOMObserver.setGameLog("");
    DOMObserver.setPlayerName("");
    DOMObserver.setPlayerNick("");
    DOMObserver.setPlayerRating("");
    DOMObserver.setOpponentNames([]);
    DOMObserver.setOpponentNicks([]);
    DOMObserver.setOpponentRatings([]);
    DOMObserver.setDecks(
      new Map([
        ["", new Deck("", false, "", "", "", [])],
        ["", new OpponentDeck("", false, "", "", "", [])],
      ])
    );
    DOMObserver.setKingdom([]);
    DOMObserver.setBaseOnly(true);
    DOMObserver.dispatch(setError(null));
    DOMObserver.dispatch(setBaseOnly(true));
    if (DOMObserver.gameLogObserver !== undefined) {
      DOMObserver.gameLogObserver.disconnect();
      DOMObserver.setGameLogObserver(undefined);
    }
    if (DOMObserver.gameEndObserver !== undefined) {
      DOMObserver.gameEndObserver.disconnect();
      DOMObserver.setGameEndObserver(undefined);
    }
    if (DOMObserver.undoObserver !== undefined) {
      DOMObserver.undoObserver.disconnect();
      DOMObserver.setUndoObserver(undefined);
    }
  }

  /**
   * Callback for the resetInterval.  If it detects the game log is present, it clears itself
   * starts the initInterval.
   */
  static resetCheckIntervalCallback() {
    if (!DOMObserver.isGameLogPresent()) {
      clearInterval(DOMObserver.resetInterval);
      DOMObserver.initInterval = setInterval(
        DOMObserver.initIntervalCallback,
        1000
      );
    }
  }

  /**
   * Dispatches the setOpponentDecks action with an array of an empty OpponentStoreDeck
   * and setPlayerDeck action with an empty StoreDeck, effectively resetting the
   * redux Deck State.
   */
  static resetReduxDeckState() {
    const emptyStoreDeck: StoreDeck = JSON.parse(
      JSON.stringify(new EmptyDeck())
    );
    const emptyOpponentDecks: OpponentStoreDeck[] = [
      JSON.parse(JSON.stringify(new EmptyOpponentDeck())),
    ];
    DOMObserver.dispatch(setPlayerDeck(emptyStoreDeck));
    DOMObserver.dispatch(setOpponentDecks(emptyOpponentDecks));
  }

  /**
   * Clears the resetInterval an and begins the initInterval.  Invoked
   * by clicking the Fix/Reset button in the PrimaryFrame component.
   */
  static restartDOMObserver() {
    clearInterval(DOMObserver.resetInterval);
    DOMObserver.initInterval = setInterval(
      DOMObserver.initIntervalCallback,
      1000
    );
  }

  /**
   * Callback method used for the 'beforeunload' event listener.
   * Added on render, removed on unmount.
   * @param event - The BeforeUnloadEvent
   */
  static saveBeforeUnload() {
    if (store.getState().content.gameActiveStatus && DOMObserver.initialized())
      DOMObserver.saveGameData(DOMObserver.gameLog, DOMObserver.decks);
  }

  /**
   * Saves the game to chrome local storage to be used by the History features.
   * @param gameLog - value of the ameLog field.
   * @param decks - value of decks field.
   */
  static async saveGameData(
    gameLog: string,
    decks: Map<string, Deck | OpponentDeck>
  ) {
    const opponentDecks: OpponentStoreDeck[] = [];
    DOMObserver.opponentNames.forEach((opponentName) => {
      opponentDecks.push(JSON.parse(JSON.stringify(decks.get(opponentName))));
    });
    const savedGame: SavedGame = {
      logArchive: gameLog,
      playerDeck: JSON.parse(JSON.stringify(decks.get(DOMObserver.playerName))),
      opponentDecks: opponentDecks,
      dateTime: new Date().toString(),
      logHtml: document.getElementsByClassName("game-log")[0].innerHTML,
    };
    const title: string = savedGame.playerDeck.gameTitle;

    // Get the current gameKeys in storage.
    const gameKeysResult = await chrome.storage.local.get(["gameKeys"]);
    let gameKeys = gameKeysResult.gameKeys;
    // Add the gameKey for the game being saved
    if (gameKeys === undefined) {
      gameKeys = [];
      gameKeys.push(title);
    } else if (!gameKeys.includes(title)) {
      gameKeys.push(title);
    }
    // Save the new gameKeys to chrome local storage.
    await chrome.storage.local.set({ gameKeys: gameKeys });
    // Save the new game to chrome local storage.
    await chrome.storage.local.set({
      [title]: savedGame,
    });
    const allSavedGames: SavedGames = await chrome.storage.local.get([
      ...gameKeys,
    ]);
    DOMObserver.dispatch(setSavedGames(allSavedGames));
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
    resultMap: Map<number, string[]>,
    decks: Map<string, Deck | OpponentDeck>
  ): Map<string, Deck | OpponentDeck> {
    const updatedDecks = new Map(decks);

    const placements: {
      [index: number]: GameResult;
    } = {
      1: "1st Place",
      2: "2nd Place",
      3: "3rd Place",
      4: "4th Place",
      5: "5th Place",
      6: "6th Place",
    };
    const entries = Array.from(resultMap.entries());
    entries.forEach((entry) => {
      const [place, playerNames] = entry;
      playerNames.forEach((playerName) => {
        updatedDecks.get(playerName)?.setGameResult(placements[place]);
      });
    });

    return updatedDecks;
  }

  /**
   * Observes the log container element.  It is the parent element of game-log.  The method
   * watches to see if it's child element game-log is removed and added in a single mutation list.
   * If so, it means an undo or rewind has taken place, and the method clears the reset interval
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
          const htmlNode = mutation.removedNodes[i].cloneNode() as HTMLElement;
          if (htmlNode.className === "game-log") {
            gameLogRemoved = true;
            break;
          }
        }
      }
      if (mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const htmlNode = mutation.addedNodes[i].cloneNode() as HTMLElement;
          if (htmlNode.className === "game-log") {
            gameLogAdded = true;
            break;
          }
        }
      }
      if (gameLogRemoved && gameLogAdded) break;
    }
    if (gameLogRemoved && gameLogAdded) {
      clearInterval(DOMObserver.resetInterval);
      DOMObserver.initInterval = setInterval(
        DOMObserver.initIntervalCallback,
        1000
      );
    }
  }
}
