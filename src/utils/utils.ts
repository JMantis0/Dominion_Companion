import { AnyAction, Dispatch } from "redux";
import { Deck } from "../model/deck";
import { OpponentDeck } from "../model/opponentDeck";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { SetStateAction } from "react";
import type {
  CardCounts,
  ErrorWithMessage,
  PrimaryFrameTabType,
  SortButtonState,
  SortCategory,
  SortReducer,
  SplitMaps,
  StoreDeck,
} from ".";

/**
 * Function called by the CustomSelect useEffect hook to configure
 * the jQuery resizable handle to appear and function correctly.  The default
 * behavior of the Resizable widget places a 's' handle as a child of the wrong
 * div (option-container).  Function manually appends it to the Scrollbars  div after render.
 * The function also edits the style attribute to link it to the icon resource.
 */
const addResizableAndCustomHandleToCustomSelectScrollBars = (
  $: JQueryStatic,
  selectScrollbarsElement: JQuery<HTMLElement>,
  handleId: string
) => {
  // Create handle and attach it to the given element
  const customHandle: HTMLElement = document.createElement("div");
  selectScrollbarsElement.append(customHandle!);

  // add the classes required for the handle by jQueryUI
  customHandle.setAttribute(
    "class",
    "ui-resizable-handle ui-resizable-s ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se"
  );
  customHandle.setAttribute("id", handleId);
  // Wrap the element in a jQuery object...
  const selectScrollJQueryUIObject: JQuery<HTMLElement> = $(
    selectScrollbarsElement
  );
  //and add the Resizable widget with the custom handle created earlier
  selectScrollJQueryUIObject.resizable({
    handles: { s: $(customHandle) },
  });
  // Configure style to put icon in the proper bottom right position of the element.
  customHandle!.setAttribute(
    "style",
    "z-index: 90; left: unset; cursor: s-resize;"
  );
  // Configure the style attribute to link handle to the Resizable icon resource.
  if (chrome.runtime !== null && chrome.runtime !== undefined) {
    const customHandleStyle = customHandle!.getAttribute("style");
    customHandle!.setAttribute(
      "style",
      customHandleStyle +
        "background-image: url(chrome-extension://" +
        chrome.runtime.id +
        "/ui-icons_ffffff_256x240.png);"
    );
  }
};

/**
 * Add jQuery interactions 'Resizable' and 'Draggable' to the PrimaryFrame.
 * The fix for getting Resizable handle icons to appear in extension context is also here.
 */
const addResizableAndDraggableToPrimaryFrame = ($: JQueryStatic) => {
  $("#primaryFrame").draggable({}).resizable({
    handles: "n, e, s, w, ne, nw, se, sw",
  });
  const primaryFrameResizableHandle = document.querySelector(
    "#primaryFrame > .ui-resizable-handle.ui-resizable-se.ui-icon.ui-icon-gripsmall-diagonal-se"
  );
  // Give the PrimaryFrame resizable handle an id for disambiguation.
  primaryFrameResizableHandle?.setAttribute(
    "id",
    "primary-frame-resizable-handle"
  );
  // Configure style to pull icon inward away from the frame border.
  primaryFrameResizableHandle?.setAttribute(
    "style",
    "bottom: 8px; right: 8px; z-index:90;"
  );
  // Configure the style attribute to link handle to the Resizable icon resource.
  if (chrome.runtime !== null && chrome.runtime !== undefined) {
    const handleStyle = primaryFrameResizableHandle?.getAttribute("style");
    primaryFrameResizableHandle!.setAttribute(
      "style",
      handleStyle +
        "background-image: url(chrome-extension://" +
        chrome.runtime.id +
        "/ui-icons_ffffff_256x240.png);"
    );
  }
};

/**
 * Compares the logs that have been processed with current game log to
 * check if there are any unprocessed logs.
 * Purpose: Control flow for updating Deck state.
 * @param logsProcessed - The logs that have already been processed into the Decks.
 * @param gameLog - The current game log.
 * @returns Boolean for whether there are new logs to be processed.
 */
const areNewLogsToSend = (logsProcessed: string, gameLog: string): boolean => {
  let areNewLogs: boolean;
  const procArr = logsProcessed.split("\n").slice();
  const gLogArr = gameLog.split("\n").slice();
  // remove premoves (innerText of the game-log element places all the premoves text on one line)
  if (gLogArr[gLogArr.length - 1].match("Premoves") !== null) {
    gLogArr.pop();
  }
  const lastGameLogEntry = gLogArr.slice().pop();
  if (isLogEntryBuyWithoutGain(lastGameLogEntry!)) {
    areNewLogs = false;
  } else if (procArr.length > gLogArr.length) {
    throw new Error("Processed logs Larger than game log");
  } else if (gLogArr.length > procArr.length) {
    areNewLogs = true;
  } else if (procArr.slice().pop() !== gLogArr.slice().pop()) {
    areNewLogs = true;
  } else areNewLogs = false;
  return areNewLogs;
};

/**
 * Checks for presence of <player-info-name> elements in the DOM.
 * Purpose: Control flow of content script.
 * @returns The boolean for whether the <player-info-name> elements are present in the dome.
 */
const arePlayerInfoElementsPresent = (): boolean => {
  const playerElements = document.getElementsByTagName(
    "player-info-name"
  ) as HTMLCollectionOf<HTMLElement>;
  const playerElementsPresent = playerElements.length > 0;
  return playerElementsPresent;
};

/**
 * Function takes the current kingdom and checks it for any cards that are not in the base set.
 * @param kingdom - A kingdom from the client
 * @returns - A boolean, false if the kingdom contains cards outside of the base set, true otherwise.
 */
const baseKingdomCardCheck = (kingdom: string[]): boolean => {
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
};

/**
 * Function that handles the adding and removing of an Chrome onMessage listener.  Used by the PrimaryFrame component to listen for
 * messages from the Popup component that adds and removes the DomRoot from the client.
 * @param add - String that determines whether the listener is to be removed or added.
 * @param dispatch - Redux reducer dispatcher.
 * @param setViewerHidden - Reducer function that sets the 'hidden' redux state variable.
 * @param getViewerStatus - Function that checks the DOM to get the hidden status
 */
const chromeListenerUseEffectHandler = (
  add: "Add" | "Remove",
  dispatch: Dispatch<AnyAction>,
  setViewerHidden: ActionCreatorWithPayload<boolean, "content/setViewerHidden">,
  getViewerStatus: Function
) => {
  const chromeMessageListener = (
    request: { command: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: { message: string }) => void
  ) => {
    sender;
    let response: { message: string } = { message: "" };
    if (request.command === "appendDomRoot") {
      dispatch(setViewerHidden(false));
      response.message = "Successfully turned on.";
    } else if (request.command === "removeDomRoot") {
      dispatch(setViewerHidden(true));
      response.message = "Successfully turned off.";
    } else if (request.command === "sendHiddenState") {
      response.message = getViewerStatus()
        ? "Hidden state is ON"
        : "Hidden state is OFF";
    } else {
      response.message = "Invalid Request";
    }
    sendResponse(response);
  };
  if (add === "Add") {
    chrome.runtime.onMessage.addListener(chromeMessageListener);
  } else if (add === "Remove") {
    chrome.runtime.onMessage.removeListener(chromeMessageListener);
  }
};

/**
 * Function that calculates mathematical combinations
 * @param n the number of elements in the set.
 * @param r - the number or elements in a combination.
 * @returns - The number of possible combinations.
 */
const combinations = (n: number, r: number): number => {
  if (n < r) {
    return 0;
  } else if (n == r || r == 0) {
    return 1;
  } else {
    r = r < n - r ? n - r : r;
    if (n < r + 1 || n - r < 1) {
      throw new Error("combination impossible");
    }
    return product_Range(r + 1, n) / product_Range(1, n - r);
  }
};

/**
 * Function takes takes two Map<string, number> objects and combines them into one Map<string,cardCounts
 * object, representing the total amount of each card owned by the player and the amount of each card in
 * a given zone.
 * Purpose: Used by View Components
 * @param deckListMap - A Map<string,number> of the counts of each card owned by a player
 * @param zoneListMap - A Map<string,number> of the counts of each card in a player's specific zone
 * @returns - a Map<string,CardCounts> object
 */
const combineDeckListMapAndZoneListMap = (
  deckListMap: Map<string, number>,
  zoneListMap: Map<string, number>
): Map<string, CardCounts> => {
  let newMap: Map<string, CardCounts> = new Map();
  // first create a list of all the cards that are in both maps...
  const cardList: string[] = Array.from(deckListMap.keys()).concat(
    Array.from(zoneListMap.keys())
  );

  // For each card create a CardCounts object and add it to the new map.
  cardList.forEach((card) => {
    let deckListAmount = 0;
    let zoneListAmount = 0;
    if (zoneListMap.has(card)) {
      zoneListAmount = zoneListMap.get(card)!;
    }
    if (deckListMap.has(card)) {
      deckListAmount = deckListMap.get(card)!;
    }
    const counts: CardCounts = {
      entireDeckCount: deckListAmount,
      zoneCount: zoneListAmount,
    };
    newMap.set(card, counts);
  });

  return newMap;
};

/**
 * Creates and returns an empty SplitMaps object to be used
 * as an initial state by the CategoryViewer
 * @returns An empty split maps object
 */
const createEmptySplitMapsObject = (): SplitMaps => {
  let aMap: Map<string, CardCounts> = new Map();
  let tMap: Map<string, CardCounts> = new Map();
  let vMap: Map<string, CardCounts> = new Map();
  let cMap: Map<string, CardCounts> = new Map();
  aMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  tMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  vMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  let emptySplitMap: SplitMaps = {
    treasures: tMap,
    actions: aMap,
    victories: vMap,
    curses: cMap,
  };
  return emptySplitMap;
};

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
const createPlayerDecks = (
  gameTitle: string,
  ratedGame: boolean,
  playerName: string,
  playerNick: string,
  playerRating: string,
  opponentName: string,
  opponentNick: string,
  opponentRating: string,
  kingdom: Array<string>
): Map<string, Deck | OpponentDeck> => {
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
};

/**
 * Function returns the cumulative hypergeometric probability of a sample that contains the number
 * of given success or more than the number of given successes.
 * @param populationSize  - Size of the population
 * @param populationSuccesses - Number of successes in the population
 * @param sampleSize - The sample size to be picked at random from the population
 * @param sampleSuccesses - The number of successes in the sample.
 * @returns - The probability that there will be at least the given number of successes in a sample.
 */
const cumulativeHyperGeometricProbability = (
  populationSize: number,
  populationSuccesses: number,
  sampleSize: number,
  sampleSuccesses: number
): number => {
  let cumulativeProb: number = 0;
  for (let i = sampleSuccesses; i <= sampleSize; i++) {
    try {
      cumulativeProb += hyperGeometricProbability(
        populationSize,
        populationSuccesses,
        sampleSize,
        i
      );
    } catch (e: unknown) {
      console.error(getErrorMessage(e));
    }
  }
  return cumulativeProb;
};

/**
 * Gets the kingdom-viewer-group element from the DOM and iterates through the
 * name-layer elements within it.  Extracts the innerText of each name-layer and
 * pushes it to an array of strings.  Then adds default strings to the array, and
 * returns the array.
 * Purpose: To initialize the global variable kingdom.
 * @returns The array of strings containing the kingdom card available in the current game.
 */
const getClientKingdom = (): Array<string> => {
  let kingdom: Array<string>;
  let cards = [];
  try {
    for (let elt of document
      .getElementsByClassName("kingdom-viewer-group")[0]
      .getElementsByClassName("name-layer") as HTMLCollectionOf<HTMLElement>) {
      const card = elt.innerText.trim();
      cards.push(card);
    }
  } catch (e: unknown) {
    console.error(getErrorMessage(e));
    throw new Error(getErrorMessage(e));
  }
  ["Province", "Gold", "Duchy", "Silver", "Estate", "Copper", "Curse"].forEach(
    (card) => {
      cards.push(card);
    }
  );
  kingdom = cards;
  return kingdom;
};

/**
 * Function takes a given array of strings and creates a Map object that has a key for each unique
 * string in the array.  The values for each key are the number of instances that string occurs
 * in the array.
 * Purpose: Used by all viewer components.
 * @param deckListArray - An array of potentially non-unique strings
 * @returns - A Map<string, number> with the counts of strings occurring in the array.
 */
const getCountsFromArray = (
  deckListArray: Array<string>
): Map<string, number> => {
  const cardCountsMap = new Map<string, number>();
  deckListArray.forEach((card) => {
    if (cardCountsMap.has(card)) {
      cardCountsMap.set(card, cardCountsMap.get(card)! + 1);
    } else {
      cardCountsMap.set(card, 1);
    }
  });
  return cardCountsMap;
};

/**
 * Classic function that returns the probability of getting a certain number of successes from a set of elements.
 * @param populationSize  - Size of the population
 * @param populationSuccesses - Number of successes in the population
 * @param sampleSize - The sample size to be picked at random from the population
 * @param sampleSuccesses - The number of successes in the sample.
 * @returns - The probability that there will be  exactly the given number of successes in a sample.
 */
const hyperGeometricProbability = (
  populationSize: number,
  populationSuccesses: number,
  sampleSize: number,
  sampleSuccesses: number
): number => {
  let hyperGeometricProbability: number;
  /**
   * Hypergeometric formula has the following restrictions:
   * 0 <= x <= n
   * x <= k
   * n - x <= N - k
   * Probability for any set of parameter values outside these restrictions have a probability of 0
   * The first 4 if/else below code in these restrictions.
   */
  if (!(0 <= sampleSuccesses)) {
    hyperGeometricProbability = 0;
  } else if (!(sampleSuccesses <= sampleSize)) {
    hyperGeometricProbability = 0;
  } else if (!(sampleSuccesses <= populationSuccesses)) {
    hyperGeometricProbability = 0;
  } else if (
    !(sampleSize - sampleSuccesses <= populationSize - populationSuccesses)
  ) {
    hyperGeometricProbability = 0;
  } else {
    hyperGeometricProbability =
      (combinations(populationSuccesses, sampleSuccesses) *
        combinations(
          populationSize - populationSuccesses,
          sampleSize - sampleSuccesses
        )) /
      combinations(populationSize, sampleSize);
  }
  return hyperGeometricProbability;
};

/**
 * Function returns the hypergeometric and cumulative hypergeometric probabilities that the given card will be drawn in the next
 * given number of draws.
 * @param deck - The player's StoreDeck.
 * @param cardName - The card to get probabilities for.
 * @param turn - The turn to calculate probabilities for (can be either this turn or next turn).
 * @param successCount - The number of the given card to be in the drawn cards.
 * @param drawCount - The given number of draws.
 * @returns - An object literal with both the hypergeometric and the cumulative hypergeometric probabilities described above.
 */
const getCumulativeHyperGeometricProbabilityForCard = (
  deck: StoreDeck,
  cardName: string,
  turn: "Current" | "Next",
  successCount: number,
  drawCount: number
): { hyperGeo: number; cumulative: number } => {
  let probability: number = 0;
  let cumProb: number = 0;
  let secondDrawPool: string[] =
    turn === "Current"
      ? deck.graveyard
      : deck.graveyard.concat(deck.hand, deck.inPlay, deck.setAside);
  const populationSize: number = deck.library.length;
  const populationSuccesses: number = getCountsFromArray(deck.library).has(
    cardName
  )
    ? getCountsFromArray(deck.library).get(cardName)!
    : 0;
  const sampleSize: number = drawCount;
  const sampleSuccesses = successCount;
  if (deck.library.length === 0 && secondDrawPool.length === 0) {
  } else if (sampleSize <= deck.library.length) {
    try {
      probability = hyperGeometricProbability(
        populationSize,
        populationSuccesses,
        sampleSize,
        sampleSuccesses
      );
      cumProb = cumulativeHyperGeometricProbability(
        populationSize,
        populationSuccesses,
        sampleSize,
        sampleSuccesses
      );
    } catch (e: unknown) {
      console.error(getErrorMessage(e));
    }
  } else if (sampleSize > deck.library.length) {
    const libraryCumProb = cumulativeHyperGeometricProbability(
      populationSize,
      populationSuccesses,
      deck.library.length,
      sampleSuccesses
    );
    const secondPoolPopulationSize: number = secondDrawPool.length;
    const secondPoolPopulationSuccesses: number = getCountsFromArray(
      secondDrawPool
    ).has(cardName)
      ? getCountsFromArray(secondDrawPool)!.get(cardName)!
      : 0;
    const secondPoolSampleSize =
      sampleSize - populationSize > secondPoolPopulationSize
        ? secondPoolPopulationSize
        : sampleSize - populationSize;
    const secondPoolSampleSuccesses =
      sampleSuccesses - populationSuccesses < 0
        ? 0
        : sampleSuccesses - populationSuccesses;
    if (libraryCumProb < 1) {
      cumProb =
        cumulativeHyperGeometricProbability(
          secondPoolPopulationSize,
          secondPoolPopulationSuccesses,
          secondPoolSampleSize,
          secondPoolSampleSuccesses
        ) + libraryCumProb;
    } else if (libraryCumProb === 1) {
      cumProb = 1;
    }
    try {
      probability = hyperGeometricProbability(
        secondPoolPopulationSize,
        secondPoolPopulationSuccesses,
        secondPoolSampleSize,
        secondPoolSampleSuccesses
      );
    } catch (e: unknown) {
      console.error(getErrorMessage(e));
    }
  } else {
    console.error("drawCount", drawCount);
    console.error("library length", deck.library.length);
    throw new Error("invalid hypergeometric.");
  }
  return {
    hyperGeo: Math.round(probability * 10000) / 10000,
    cumulative: Math.round(cumProb * 10000) / 10000,
  };
};

/**
 * A helper function that gets an error message from an error, and if it doesn't have an error message,
 * assigns one based on the error itself.
 */
const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};

/**
 * Gets and returns the game log element's innerText.
 * Purpose: Update the global gameLog variable.
 * @returns The string of innerText of the game-log element.
 */
const getGameLog = (): string => {
  const gameLogElement = document.getElementsByClassName(
    "game-log"
  )[0] as HTMLElement;
  const gameLog = gameLogElement.innerText;
  return gameLog;
};

/**
 * Used by decks to eliminate ambiguity for certain Vassal activity.
 * @returns - A collection of all the div's in the log-scroll-container with the class 'log-line'
 */
const getLogScrollContainerLogLines = (): HTMLCollectionOf<HTMLElement> => {
  let scrollEl: Element;
  let logLineCollection: HTMLCollectionOf<HTMLElement>;
  scrollEl = document.getElementsByClassName("log-scroll-container")[0];
  if (scrollEl == undefined) throw new Error("Element is undefined");
  logLineCollection = scrollEl.getElementsByClassName(
    "log-line"
  ) as HTMLCollectionOf<HTMLElement>;
  return logLineCollection;
};

/**
 * Gets the <player-info-name> elements from the DOM, and compares their
 * css properties to determine which contains the player name and which
 * Contains the opponentName, then returns those names.
 * Purpose: Initializing the global variable playerName and opponentName.
 * @param playerInfoElements - Collection of <player-info> elements.
 * @returns An array containing the playerName and opponentName as strings.
 */
const getPlayerAndOpponentNameByComparingElementPosition = (
  playerInfoElements: HTMLCollectionOf<HTMLElement>
): Array<string> => {
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
};

/**
 * Gets the <player-info elements> from the DOM and returns them.
 * Purpose: Part of initializing the global variables playerName and opponentName.
 * Used by viewer
 * @returns HTMLCollection<HTMLElement> of <player-info-elements>:
 */
const getPlayerInfoElements = (): HTMLCollectionOf<HTMLElement> => {
  const playerInfoElements: HTMLCollectionOf<HTMLElement> =
    document.getElementsByTagName(
      "player-info"
    ) as HTMLCollectionOf<HTMLElement>;
  return playerInfoElements;
};

/**
 * Uses the gameLog and player name to determine the player
 * and opponent abbreviations used in the game log, and returns
 * them.
 * Purpose: Initialize the global variables playerNick and opponentNick.
 * @param gameLog - The gameLog global variable.
 * @param playerName - The playerName global variable.
 * @returns Array of two strings, the player nickname and opponent nickname.
 */
const getPlayerNameAbbreviations = (
  gameLog: string,
  playerName: string
): Array<string> => {
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
};

/**
 * Gets the player ratings for rated games and returns them.
 * @param playerName
 * @param opponentName
 * @param gameLog
 * @returns - An array of the player ratings.
 * To do - make it work for multiple opponents.
 */
const getPlayerRatings = (
  playerName: string,
  opponentName: string,
  gameLog: string
): string[] => {
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
};


/**
 * Function gets boolean for whether the primary frame is hidden or not.
 * @returns - boolean.
 */
const getPrimaryFrameStatus = (): boolean | undefined => {
  let status: boolean | undefined;
  status = document
    .getElementById("primaryFrame")
    ?.classList.contains("hidden");
  return status;
};

/**
 * Checks to see if the game is rated or unrated.
 * @param firstGameLogLine - First log entry of the game log.
 * @returns - Boolean for whether the game is rated or unrated.
 */
const getRatedGameBoolean = (firstGameLogLine: string): boolean => {
  let ratedGame: boolean;
  if (firstGameLogLine.match(/ rated\./) !== null) {
    ratedGame = true;
  } else if (firstGameLogLine.match(/ unrated\./) !== null) {
    ratedGame = false;
  } else {
    throw new Error("Invalid firstGameLogLine " + firstGameLogLine);
  }
  return ratedGame;
};

/**
 * Gets the winner and loser of the game.
 * @param decks - the Map of participating decks.
 * @param playerName
 * @param opponentName
 * @param gameEndReason
 * @returns String array [victor, defeated]
 */
const getResult = (
  decks: Map<string, Deck | OpponentDeck>,
  playerName: string,
  opponentName: string,
  gameEndReason: string
): string[] => {
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
};

/**
 * Function that returns a tailwind utility class for text-color based on the card type.
 * @param cardName - The card name
 * @returns - Utility class for the color of the row.
 */
const getRowColor = (cardName: string): string => {
  let color;
  const actionClass: string = "text-[#fff5c7]";
  const victoryClass: string = "text-green-300";
  const treasureClass: string = "text-[#F4FF00]";
  const curseClass: string = "text-purple-400";
  const reactionClass: string = "text-[#6eccff]";
  const victories: string[] = ["Estate", "Duchy", "Province", "Gardens"];
  const treasures: string[] = ["Copper", "Silver", "Gold"];
  if (treasures.indexOf(cardName) > -1) {
    color = treasureClass;
  } else if (victories.indexOf(cardName) > -1) {
    color = victoryClass;
  } else if (cardName === "Curse") {
    color = curseClass;
  } else if (cardName === "Moat") {
    color = reactionClass;
  } else color = actionClass;
  return color;
};

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
const getUndispatchedLogs = (
  logsDispatched: string,
  gameLog: string
): string => {
  let undispatchedLogs: string;
  let dispatchedArr: string[];
  if (logsDispatched !== "" && logsDispatched !== undefined) {
    dispatchedArr = logsDispatched.split("\n").slice();
  } else {
    dispatchedArr = [];
  }
  const gameLogArr = gameLog.split("\n").slice();
  if (gameLogArr[gameLogArr.length - 1].match("Premoves") !== null) {
    gameLogArr.pop();
  }
  if (dispatchedArr.length > gameLogArr.length) {
    throw new Error("More dispatched logs than game logs");
  } else if (dispatchedArr.length < gameLogArr.length) {
    const numberOfUndispatchedLines = gameLogArr.length - dispatchedArr.length;
    undispatchedLogs = gameLogArr.slice(-numberOfUndispatchedLines).join("\n");
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
};

/**
 * A helper function that determines if the given error has a message property.
 * @param error  An error
 * @returns
 */
const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

/**
 * Checks for presence of game-log element in the DOM.
 * Purpose: Control flow of content script.
 * @returns  The boolean for whether the game-log is present.
 */
const isGameLogPresent = (): boolean => {
  const gameLogElementCollection = document.getElementsByClassName("game-log");
  const gameLogElementCount = gameLogElementCollection.length;
  const gameLogPresent = gameLogElementCount > 0;
  return gameLogPresent;
};

/**
 * Checks for presence of kingdom-viewer-group element in the dom.
 * Purpose: Control flow for content script.
 * @returns The boolean for presence of the kingdom-viewer-group element.
 */
const isKingdomElementPresent = (): boolean => {
  let kingdomPresent: boolean;
  kingdomPresent =
    document.getElementsByClassName("kingdom-viewer-group").length > 0;
  return kingdomPresent;
};

/**
 * Used in control flow for whether new logs should be collected.
 * The client will create buy-lines and then quickly remove them.
 * This function is used to ensure these do not trigger log collections.
 * @param logLine - The most recent line in the game-log;
 * @returns - Boolean for whether the most recent line is a
 */
const isLogEntryBuyWithoutGain = (logLine: string): boolean => {
  let isBuyWithoutGain: boolean;
  if (logLine.match(" buys ") !== null && logLine.match(" gains ") === null) {
    isBuyWithoutGain = true;
  } else {
    isBuyWithoutGain = false;
  }
  return isBuyWithoutGain;
};

/**
 * Function that is called by mouseEnter events on an option (it's actually a div) in the CustomSelect.
 * Sets the topCardsLookAmount to the value of the 'option' that the mouse is entering.
 * @param cardAmount - Value of the option that the mouse is entering.
 * @param dispatch - Redux dispatcher.
 * @param setTopCardsLookAmount - The contentSlice reduce that sets the topCardsLookAmount.
 */
const onMouseEnterOption = (
  cardAmount: number,
  dispatch: Dispatch<AnyAction>,
  setTopCardsLookAmount: ActionCreatorWithPayload<
    number,
    "content/setTopCardsLookAmount"
  >
) => {
  dispatch(setTopCardsLookAmount(cardAmount));
};

/**
 * Function that is called by mouseEnter events on a TurnButton.  Dispatches the setTurnToggleButton action with the provided buttonName.
 * @param buttonName
 * @param dispatch
 * @param setTurnToggleButton
 */
const onMouseEnterTurnButton = (
  buttonName: "Current" | "Next",
  dispatch: Dispatch<AnyAction>,
  setTurnToggleButton: ActionCreatorWithPayload<
    "Current" | "Next",
    "content/setTurnToggleButton"
  >
) => {
  dispatch(setTurnToggleButton(buttonName));
};

/**
 * Function that is called by mouseLeave events on an 'option' (it's actually a div) in the CustomSelect.
 * Sets the topCardsLookAmount back to the pinnedTopCardsLookAmount.
 * @param pinnedCardAmount - The current pinnedTopCardsLookAmount.
 * @param dispatch - Redux Dispatcher
 * @param setTopCardsLookAmount - The contentSlice reducer that sets the topCardsLookAmount.
 */
const onMouseLeaveOption = (
  pinnedCardAmount: number,
  dispatch: Dispatch<AnyAction>,
  setTopCardsLookAmount: ActionCreatorWithPayload<number, string>
) => {
  dispatch(setTopCardsLookAmount(pinnedCardAmount));
};

/**
 * Function that is called by mouseLeave events on a TurnButton.  Sets the turnToggleButton back to the pinnedTurnToggleButton value.
 * @param pinnedTurnButton - The pinnedTurnToggleButton state.
 * @param dispatch - Redux dispatcher.
 * @param setTurn - The contentSlice reducer that sets the turnToggleButton state.
 */
const onMouseLeaveTurnButton = (
  pinnedButtonName: "Current" | "Next",
  dispatch: Dispatch<AnyAction>,
  setTurn: ActionCreatorWithPayload<
    "Current" | "Next",
    "content/setTurnToggleButton"
  >
) => {
  dispatch(setTurn(pinnedButtonName));
};

/**
 * Function that is called by click events on an 'option' (it's actually a div) in the CustomSelect.
 * Sets the topCardsLookAmount and the pinnedTopCardsLookAmount to the value of the option that is clicked.
 * @param cardAmount - Value of the option being clicked.
 * @param dispatch - Redux Dispatcher.
 * @param setTopCardsLookAmount - The contentSlice reducer that sets the topCardsLookAmount.
 * @param setPinnedTopCardsLookAmount - The contentSlice reducer that sets the pinnedTopCardsLookAmount
 */
const onOptionClick = (
  cardAmount: number,
  dispatch: Dispatch<AnyAction>,
  setTopCardsLookAmount: ActionCreatorWithPayload<
    number,
    "content/setTopCardsLookAmount"
  >,
  setPinnedTopCardsLookAmount: ActionCreatorWithPayload<
    number,
    "content/setPinnedTopCardsLookAmount"
  >
) => {
  dispatch(setTopCardsLookAmount(cardAmount));
  dispatch(setPinnedTopCardsLookAmount(cardAmount));
};

/**
 * Function that is called on click events for a PrimaryFrameTab.  Sets the pinnedPrimaryFrameTab and primaryFrameTab to the
 * name of the clicked tab.
 * @param tabName - The 'name' attribute of the tab that was clicked.
 * @param dispatch - Redux dispatcher.
 * @param setPrimaryFrameTab - The contentSlice reducer that sets the primaryFrameTab.
 * @param setPinnedPrimaryFrameTab - The contentSlice reducer that sets the pinnedPrimaryFrameTab.
 */
const onPrimaryFrameTabClick = (
  tabName: PrimaryFrameTabType,
  dispatch: Dispatch<AnyAction>,
  setPrimaryFrameTab: ActionCreatorWithPayload<
    PrimaryFrameTabType,
    "content/setPrimaryFrameTab"
  >,
  setPinnedPrimaryFrameTab: ActionCreatorWithPayload<
    PrimaryFrameTabType,
    "content/setPinnedPrimaryFrameTab"
  >
) => {
  dispatch(setPrimaryFrameTab(tabName));
  dispatch(setPinnedPrimaryFrameTab(tabName));
};

/**
 * Function that is called by on mouseEnter events for a PrimaryFrameTab. Sets the primaryFrameTab to the name
 * of the tab that the mouse is entering.
 * @param tabName - The 'name' attribute of the tab that was clicked.
 * @param dispatch - Redux dispatcher.
 * @param setPrimaryFrameTab - The contentSlice reducer that sets the primaryFrameTab.
 */
const onPrimaryFrameTabMouseEnter = (
  tabName: PrimaryFrameTabType,
  dispatch: Dispatch<AnyAction>,
  setPrimaryFrameTab: ActionCreatorWithPayload<
    PrimaryFrameTabType,
    "content/setPrimaryFrameTab"
  >
) => {
  dispatch(setPrimaryFrameTab(tabName));
};

/**
 *  Function that is called by on mouseLeave events for a PrimaryFrameTab.  Sets the primaryFrameTab to the name
 * of the pinnedPrimaryFrameTab when the mouse leaves.
 * @param pinnedPrimaryFrameTab - The current pinnedPrimaryFrameTab value.
 * @param dispatch - Redux dispatcher.
 * @param setPrimaryFrameTab -- The contentSlice reducer that sets the primaryFrameTab.
 */
const onPrimaryFrameTabMouseLeave = (
  pinnedPrimaryFrameTab: PrimaryFrameTabType,
  dispatch: Dispatch<AnyAction>,
  setPrimaryFrameTab: ActionCreatorWithPayload<
    PrimaryFrameTabType,
    "content/setPrimaryFrameTab"
  >
) => {
  dispatch(setPrimaryFrameTab(pinnedPrimaryFrameTab));
};

/**
 * Function that is called by scroll events in the ScrollBars Component.  Used by the CustomSelect to save the
 * scroll position.
 * @param scrollPosition - The scroll position.
 * @param dispatch - Redux dispatcher.
 * @param setSelectScrollPosition - The contentSlice reducer that sets the selectScrollPosition.
 */
const onSelectScroll = (
  scrollPosition: number,
  dispatch: Dispatch<AnyAction>,
  setSelectScrollPosition: ActionCreatorWithPayload<
    number,
    "content/setSelectScrollPosition"
  >
) => {
  dispatch(setSelectScrollPosition(scrollPosition));
};

/**
 * Function that is called by click events on a SortButton.  Uses the given reducer to set the sortButtonState
 * for that reducer according to the given sortCategory value.
 * @param sortCategory - The category to sort by.
 * @param currentSortButtonState - The current sortButtonState
 * @param dispatch - Redux Dispatcher.
 * @param sortReducer - A sort reducer from the contentSlice.
 */
const onSortButtonClick = (
  sortCategory: SortCategory,
  currentSortButtonState: SortButtonState,
  dispatch: Dispatch<AnyAction>,
  sortReducer: SortReducer
) => {
  let sortToDispatch: "ascending" | "descending";
  if (currentSortButtonState.category !== sortCategory) {
    sortToDispatch = "ascending";
  } else {
    sortToDispatch =
      currentSortButtonState.sort === "ascending" ? "descending" : "ascending";
  }
  dispatch(
    sortReducer({
      category: sortCategory,
      sort: sortToDispatch,
    })
  );
};

/**
 * Function that is called by click events on a CustomSelect component.
 * @param selectState - The current select state.
 * @param dispatch - Redux dispatcher.
 * @param setSelectOpen - The contentSlice reducer that sets the selectOpen state.
 */
const onToggleSelect = (
  selectState: boolean,
  setSelectOpen: React.Dispatch<SetStateAction<boolean>>
) => {
  setSelectOpen(!selectState);
};

/**
 * Function that is called by click events on a TurnButton.  Sets the pinnedTurnToggleButton value and the turnToggleButton
 * value to the name of the button that is being clicked.
 * @param buttonName - Name of the button being clicked.
 * @param dispatch - Redux dispatcher
 * @param setPinnedTurnToggleButton - The contentSlice reducer that sets the pinnedTurnToggleButton state.
 * @param setTurnToggleButton - the contentSlice reducer that sets the turnToggleButton state.
 */
const onTurnToggleButtonClick = (
  buttonName: "Current" | "Next",
  dispatch: Dispatch<AnyAction>,
  setPinnedTurnToggleButton: ActionCreatorWithPayload<
    "Current" | "Next",
    "content/setPinnedTurnToggleButton"
  >,
  setTurnToggleButton: ActionCreatorWithPayload<
    "Current" | "Next",
    "content/setTurnToggleButton"
  >
) => {
  dispatch(setPinnedTurnToggleButton(buttonName));
  dispatch(setTurnToggleButton(buttonName));
};

/**
 * Helper function for combining combination operations.
 * returns the product of all the integers from a to b
 * ie: product_Range(2,5) will return 2*3*4*5 = 120
 * @param a - Starting number, should be less than b.
 * @param b - Ending number, should bt greater than or equal to a.
 * @returns - the product of all the integers from a to b (inclusive).
 */
const product_Range = (a: number, b: number): number => {
  if (a > b) {
    throw Error("product_Range invalid parameters (a>b)");
  }
  var prd = a,
    i = a;
  while (i++ < b) {
    prd *= i;
  }
  return prd;
};

/**
 * Compare function.  Sorts two cards by their amounts and a sort parameter.
 * @param cardAAmount - amount of cardA.
 * @param cardBAmount - amount of cardB.
 * @param sortType - ascending or descending.
 * @returns 
 */
const sortTwoCardsByAmount = (
  cardAAmount: number,
  cardBAmount: number,
  sortType: "ascending" | "descending"
): number => {
  let result = 0;
  if (cardAAmount > cardBAmount) {
    result = sortType === "ascending" ? -1 : 1;
  } else if (cardAAmount < cardBAmount) {
    result = sortType === "ascending" ? 1 : -1;
  }
  return result;
};

/**
 * Compare function.  Sort two cards by their names and a sortType parameter.  If ascending, A sorts in potion before Z
 * @param cardA
 * @param cardB
 * @param sortType
 * @returns
 */
const sortTwoCardsByName = (
  cardA: string,
  cardB: string,
  sortType: "ascending" | "descending"
): number => {
  let result: number = 0;
  if (cardA > cardB) {
    // cardA > cardB means that cardA comes alphabetically after cardB
    result = sortType === "ascending" ? 1 : -1;
  } else if (cardA < cardB) {
    // cardA < cardB means that cardA comes alphabetically before cardB
    result = sortType === "ascending" ? -1 : 1;
  }
  return result;
};


/**
 * Compare function.  Sort two cards based on the hypergeometric probability of drawing the card with the given parameters.
 */
const sortTwoCardsByProbability = (
  cardA: string,
  cardB: string,
  sortType: "ascending" | "descending",
  deck: StoreDeck,
  topCardsLookAmount: number,
  turn: "Current" | "Next"
): number => {
  let result = 0;
  const cardAProb = getCumulativeHyperGeometricProbabilityForCard(
    deck,
    cardA,
    turn,
    1,
    topCardsLookAmount
  ).cumulative;
  const cardBProb = getCumulativeHyperGeometricProbabilityForCard(
    deck,
    cardB,
    turn,
    1,
    topCardsLookAmount
  ).cumulative;

  if (cardAProb > cardBProb) {
    result = sortType === "ascending" ? -1 : 1;
  } else if (cardAProb < cardBProb) {
    result = sortType === "ascending" ? 1 : -1;
  }

  return result;
};

/**
 * Returns a sorted map.  Sorts by the sortParam and sortType.
 * @param sortParam - The category to sort on.
 * @param unsortedMap - The unsorted map.
 * @param sortType - Ascending or Descending.
 * @param pd - the player deck
 * @returns - A sorted Map that is used by the HistoryDeckViewer component to render the view in a sorted order.
 */
const sortHistoryDeckView = (
  sortParam: SortCategory,
  unsortedMap: Map<string, CardCounts>,
  sortType: "ascending" | "descending"
): Map<string, CardCounts> => {
  const mapCopy = new Map(unsortedMap);
  const sortedMap: Map<string, CardCounts> = new Map();
  switch (sortParam) {
    case "card":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            let result: number;
            const card1 = entryA[0];
            const card2 = entryB[0];
            if (sortType === "ascending") {
              if (card1 > card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            } else {
              if (card1 < card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            }
            return result;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "owned":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            if (sortType === "ascending") {
              return entryB[1].entireDeckCount - entryA[1].entireDeckCount;
            } else {
              return entryA[1].entireDeckCount - entryB[1].entireDeckCount;
            }
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "zone":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            if (sortType === "ascending") {
              return entryB[1].zoneCount - entryA[1].zoneCount;
            } else {
              return entryA[1].zoneCount - entryB[1].zoneCount;
            }
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    default: {
      throw new Error("Invalid sort category " + sortParam);
    }
  }
  return sortedMap;
};

/**
 * Returns a sorted map.  Sorts by the sortParam and sortType.  If there are 2 rows with an equal
 * amount, a secondary sort will be applied.  If the secondary values are equal, a tertiary sort 
 * will be applied.
 * Primary - "probability" -> Secondary - "owned" -> tertiary "zone" -> quaternary - "card"
 * Primary - "owned" -> Secondary - "zone" -> tertiary "probability" -> quaternary - "card"
 * Primary - "zone" -> Secondary - "owned" -> tertiary "probability" -> quaternary - "card"
 * Primary - "card" (no equal value possible, secondary not needed)
 * @param sortParam - The category to sort on.
 * @param unsortedMap - The unsorted map.
 * @param sortType - Ascending or Descending.
 * @param pd - The player deck.
 * @returns A sorted Map that is used by the MainDeckViewer component to render the view in sorted order.
 */
const sortMainViewer = (
  sortParam: SortCategory,
  unsortedMap: Map<string, CardCounts>,
  sortType: "ascending" | "descending",
  pd: StoreDeck,
  topCardsLookAmount: number,
  turn: "Current" | "Next"
): Map<string, CardCounts> => {
  const mapCopy = new Map(unsortedMap);
  const sortedMap: Map<string, CardCounts> = new Map();
  switch (sortParam) {
    case "probability":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            const cardA = entryA[0];
            const cardALibCount = entryA[1].zoneCount;
            const cardATotCount = entryA[1].entireDeckCount;
            const cardB = entryB[0];
            const cardBLibCount = entryB[1].zoneCount;
            const cardBTotCount = entryB[1].entireDeckCount;
            // First try to sort the two entries by their libraryCount (simpler probability)...
            let result = sortTwoCardsByAmount(
              cardALibCount,
              cardBLibCount,
              sortType
            );

            // ...if those are equal then try to sort by the hypergeometric probability...
            if (result === 0) {
              result = sortTwoCardsByProbability(
                cardA,
                cardB,
                sortType,
                pd,
                topCardsLookAmount,
                turn
              );
            }
            // ...and if those are equal try to sort sort by total card count...
            if (result === 0) {
              result = result = sortTwoCardsByAmount(
                cardATotCount,
                cardBTotCount,
                sortType
              );
            }
            // ...and finally, if those are equal, sort by card name.
            if (result === 0) {
              result = sortTwoCardsByName(cardA, cardB, sortType);
            }
            return result;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "card":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            const cardA = entryA[0];
            const cardB = entryB[0];
            return sortTwoCardsByName(cardA, cardB, sortType);
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "owned":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            const cardA = entryA[0];
            const cardALibCount = entryA[1].zoneCount;
            const cardATotCount = entryA[1].entireDeckCount;
            const cardB = entryB[0];
            const cardBLibCount = entryB[1].zoneCount;
            const cardBTotCount = entryB[1].entireDeckCount;
            // First try to sort by total owned count...
            let result = sortTwoCardsByAmount(
              cardATotCount,
              cardBTotCount,
              sortType
            );
            // ... if those are equal try to sort by amount in the library...
            if (result === 0) {
              result = sortTwoCardsByAmount(
                cardALibCount,
                cardBLibCount,
                sortType
              );
            }
            // ...if those are equal try to sort by the hypergeometric probability...
            if (result === 0) {
              result = sortTwoCardsByProbability(
                cardA,
                cardB,
                sortType,
                pd,
                topCardsLookAmount,
                turn
              );
            }
            // ... and if the hypergeometrics are equal, sort by cardName.
            if (result === 0) {
              result = sortTwoCardsByName(cardA, cardB, sortType);
            }
            return result;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "zone": // In this case, the zone is the library.
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            const cardA = entryA[0];
            const cardALibCount = entryA[1].zoneCount;
            const cardATotCount = entryA[1].entireDeckCount;
            const cardB = entryB[0];
            const cardBLibCount = entryB[1].zoneCount;
            const cardBTotCount = entryB[1].entireDeckCount;
            // First try to sort by library count...
            let result = sortTwoCardsByAmount(
              cardALibCount,
              cardBLibCount,
              sortType
            );
            // ... if libraryCount is equal try sorting by total owned count...
            if (result === 0) {
              result = sortTwoCardsByAmount(
                cardATotCount,
                cardBTotCount,
                sortType
              );
            }
            // ... if total owned is equal sort by the draw probability ...
            if (result === 0) {
              result = sortTwoCardsByProbability(
                cardA,
                cardB,
                sortType,
                pd,
                topCardsLookAmount,
                turn
              );
            }
            // ... and finally if draw probability is equal sort by cardName.
            if (result === 0) {
              result = sortTwoCardsByName(cardA, cardB, sortType);
            }
            return result;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    default: {
      throw new Error("Invalid sort category " + sortParam);
    }
  }
  return sortedMap;
};

/**
 * Sort function for ZoneViewer components.  Returns a sorted map object
 * @param sortParam - Category to sort by.
 * @param unsortedMap - An unsorted map object.
 * @param sortType - Ascending or Descending.
 * @returns - A sorted Map object, sorted according to the parameters.  Used to Render
 * the Zone VIew in a sorted order.
 */
const sortZoneView = (
  sortParam: SortCategory,
  unsortedMap: Map<string, number>,
  sortType: "ascending" | "descending"
): Map<string, number> => {
  const mapCopy = new Map(unsortedMap);
  const sortedMap: Map<string, number> = new Map();
  switch (sortParam) {
    case "card":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            let result: number;
            const card1 = entryA[0];
            const card2 = entryB[0];
            if (sortType === "ascending") {
              if (card1 > card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            } else {
              if (card1 < card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            }
            return result;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "zone":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            const cardAmount1 = entryA[1];
            const cardAmount2 = entryB[1];
            if (sortType === "ascending") {
              return cardAmount2 - cardAmount1;
            } else {
              return cardAmount1 - cardAmount2;
            }
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    default: {
      throw new Error("Invalid sort category " + sortParam);
    }
  }
  return sortedMap;
};

/**
 * Function takes a Map<string,CardCounts> and splits it into 3 maps, separated by the 4 card types.
 * @param combinedMap - A Map<string,CardCounts>
 * @returns - And object literal with 4 properties, the values of which are Map<string,CardCounts> for each card type.
 */
const splitCombinedMapsByCardTypes = (
  combinedMap: Map<string, CardCounts>
): SplitMaps => {
  let tMap: Map<string, CardCounts> = new Map();
  let aMap: Map<string, CardCounts> = new Map();
  let vMap: Map<string, CardCounts> = new Map();
  let cMap: Map<string, CardCounts> = new Map();
  let splitMaps: SplitMaps = {
    treasures: tMap,
    actions: aMap,
    victories: vMap,
    curses: cMap,
  };
  Array.from(combinedMap.entries()).forEach((entry) => {
    const [card, CardCounts] = entry;
    if (["Copper", "Silver", "Gold"].indexOf(card) >= 0) {
      tMap.set(card, CardCounts);
    } else if (["Estate", "Duchy", "Gardens", "Province"].indexOf(card) >= 0) {
      vMap.set(card, CardCounts);
    } else if (card == "Curse") {
      cMap.set(card, CardCounts);
    } else {
      aMap.set(card, CardCounts);
    }
  });
  return splitMaps;
};

/**
 * Function that stringifies a numeric probability.
 * @param probabilityFloat - Numeric probability
 * @returns - Stringified probability rounded to 1 decimal place and with a %
 */
const stringifyProbability = (probabilityFloat: number): string => {
  return (probabilityFloat * 100).toFixed(1) + "%";
};

/**
 * A helper function.  Takes an object that might be an error and if it doesn't have a message property creates
 * a new error with a message property based on the given object.
 * @param maybeError - The object that may be an error and may or may not have an error message.
 * @returns - An error with an error message property and value.
 */
const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
};

// Deprecated
// /**
//  * Returns a string expressing the probability of the next draw being a certain card.  If
//  * there are no cards in the library, it will calculate the probability from the cards in
//  * the discard pile.
//  * Purpose: Used by SortableViewer as a prop value for FullListCardRow.tsx
//  * @param libAmount - The amount of that card in the deck.
//  * @param libLength - The total amount of cards in the deck.
//  * @param discAmount - The amount of that card in the discard pile.
//  * @param discLength - The total amount of cards in the discard pile.
//  * @returns A string expressing the probability as a percentage.
//  */
// const calculateDrawProbability = (
//   libAmount: number,
//   libLength: number,
//   discAmount: number,
//   discLength: number
// ): string => {
//   let probability: string;
//   if (libLength === 0) {
//     if (discAmount === undefined) {
//       probability = "0.0%";
//     } else {
//       probability =
//         ((discAmount / discLength) * 100).toFixed(1).toString() + "%";
//     }
//   } else {
//     probability = ((libAmount / libLength) * 100).toFixed(1).toString() + "%";
//   }
//   return probability;
// };

// DEPRECATED
// /**
//  * Returns the <player-info> element for the player.
//  * @param playerInfoElements - the collection of all <player-info> elements
//  * @returns - The <player-info> element for the non-opponent player.
//  */
// const getHeroPlayerInfoElement = (
//   playerInfoElements: HTMLCollectionOf<HTMLElement>
// ): HTMLElement | undefined => {
//   let heroPlayerInfoEl: HTMLElement;
//   const transformElementMap: Map<number, HTMLElement> = new Map();
//   for (let element of playerInfoElements) {
//     const transform: string = element.style.transform;
//     const yTransForm: number = parseFloat(
//       transform.split(" ")[1].replace("translateY(", "").replace("px)", "")
//     );
//     transformElementMap.set(yTransForm, element);
//   }
//   heroPlayerInfoEl = [...transformElementMap.entries()].reduce((prev, curr) => {
//     return prev[0] > curr[0] ? prev : curr;
//   })[1];

//   return heroPlayerInfoEl;
// };

// DEPRECATED
// /**
//  * Checks to see if the line is special type of log that
//  * requires extra processing.
//  * Purpose: Control flow for content script.
//  * @param line - The line being processed.
//  * @returns Boolean for if the line is a treasure line.
//  */
// const isATreasurePlayLogEntry = (line: string): boolean => {
//   let isATreasurePlay: boolean;
//   isATreasurePlay =
//     line.match(/Coppers?|Silvers?|Golds?/) !== null &&
//     line.match("plays") !== null;
//   return isATreasurePlay;
// };

// DEPRECATED
// /**
//  * Function that closes the CustomSelect when added to a click event listener for the document itself.  Deprecated after
//  * it was decided to let the select stay open.
//  * @param event
//  * @param setSelectOpen
//  */
// const nonOptionClick = (
//   event: MouseEvent,
//   dispatch: Dispatch<AnyAction>,
//   setSelectOpen: ActionCreatorWithPayload<boolean, "content/setSelectOpen">
// ) => {
//   const element = event.target as HTMLElement;
//   const parent = element.parentElement;
//   const parentId = parent === null ? "null" : parent.id;
//   if (
//     parentId !== "option-container" &&
//     element.id !== "select-button" &&
//     element.id !== "thumb-track"
//   ) {
//     dispatch(setSelectOpen(false));
//   }
// };

//  DEPRECATED
// /**
//  * Deprecated, not currently being used
//  * @param sortParam
//  * @param unsortedMap
//  * @returns
//  */
// const sortByAmountInZone = (
//   sortParam: string,
//   unsortedMap: Map<string, CardCounts>
// ): Map<string, CardCounts> => {
//   const mapCopy = new Map(unsortedMap);
//   const sortedMap: Map<string, CardCounts> = new Map();
//   switch (sortParam) {
//     case "probability":
//       {
//         [...mapCopy.entries()]
//           .sort((entryA, entryB) => {
//             return entryB[1].zoneCount - entryA[1].zoneCount;
//           })
//           .forEach((entry) => {
//             const [card, cardCounts] = entry;
//             sortedMap.set(card, cardCounts);
//           });
//       }
//       break;
//     default:
//   }
//   return sortedMap;
// };

export {
  addResizableAndCustomHandleToCustomSelectScrollBars,
  addResizableAndDraggableToPrimaryFrame,
  areNewLogsToSend,
  arePlayerInfoElementsPresent,
  baseKingdomCardCheck,
  chromeListenerUseEffectHandler,
  combinations,
  combineDeckListMapAndZoneListMap,
  createEmptySplitMapsObject,
  createPlayerDecks,
  cumulativeHyperGeometricProbability,
  getClientKingdom,
  getCountsFromArray,
  getCumulativeHyperGeometricProbabilityForCard,
  getErrorMessage,
  getGameLog,
  getLogScrollContainerLogLines,
  getPlayerAndOpponentNameByComparingElementPosition,
  getPlayerInfoElements,
  getPlayerNameAbbreviations,
  getPlayerRatings,
  getPrimaryFrameStatus,
  getRatedGameBoolean,
  getResult,
  getRowColor,
  getUndispatchedLogs,
  hyperGeometricProbability,
  isErrorWithMessage,
  isGameLogPresent,
  isKingdomElementPresent,
  isLogEntryBuyWithoutGain,
  onMouseEnterOption,
  onMouseEnterTurnButton,
  onMouseLeaveOption,
  onMouseLeaveTurnButton,
  onOptionClick,
  onPrimaryFrameTabClick,
  onPrimaryFrameTabMouseEnter,
  onPrimaryFrameTabMouseLeave,
  onSelectScroll,
  onSortButtonClick,
  onToggleSelect,
  onTurnToggleButtonClick,
  product_Range,
  sortTwoCardsByAmount,
  sortTwoCardsByName,
  sortTwoCardsByProbability,
  sortHistoryDeckView,
  sortMainViewer,
  sortZoneView,
  splitCombinedMapsByCardTypes,
  stringifyProbability,
  toErrorWithMessage,
};
