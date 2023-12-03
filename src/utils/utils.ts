import { AnyAction, Dispatch } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  CardCounts,
  DeckZones,
  ErrorWithMessage,
  MainDeckViewerState,
  OpponentViewerState,
  OptionalHandles,
  PrimaryFrameTabType,
  SortButtonState,
  SortCategory,
  SplitMaps,
  TrashZoneViewerState,
} from ".";
import $ from "jquery";
import { RootState, store } from "../redux/store";
import { setViewerHidden } from "../redux/contentSlice";
import { Serializable } from "child_process";
import Scrollbars from "react-custom-scrollbars-2";

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
  const newMap: Map<string, CardCounts> = new Map();
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
  const aMap: Map<string, CardCounts> = new Map();
  const tMap: Map<string, CardCounts> = new Map();
  const vMap: Map<string, CardCounts> = new Map();
  const cMap: Map<string, CardCounts> = new Map();
  aMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  tMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  vMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  const emptySplitMap: SplitMaps = {
    treasures: tMap,
    actions: aMap,
    victories: vMap,
    curses: cMap,
  };
  return emptySplitMap;
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
    cumulativeProb += hyperGeometricProbability(
      populationSize,
      populationSuccesses,
      sampleSize,
      i
    );
  }
  return cumulativeProb;
};

/**
 * Creates an OptionalHandles object to be used by the CustomSelect component
 * to call the useJQueryResizable hook.
 * @returns - An OptionalHandles object with only the se handle.
 */
const customSelectResizableHandles = (): OptionalHandles => {
  const customHandle = document.createElement("div");
  customHandle.setAttribute(
    "class",
    "ui-resizable-handle ui-resizable-s ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se"
  );
  customHandle.setAttribute("id", "customSelect-resizable-handle");
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
  return {
    handles: {
      n: undefined,
      e: undefined,
      s: undefined,
      w: undefined,
      se: customHandle,
      sw: undefined,
      ne: undefined,
      nw: undefined,
    },
  };
};

/**
 * Selector function for the DiscardZoneViewer component.
 * @param state - The extension's redux RootState.
 * @returns - Object with parts of the redux state needed by the DiscardZoneViewer.
 */
const discardZoneViewerStateSelectorFunction = (
  state: RootState
): { playerName: string; graveyard: string[] } => {
  return {
    playerName: state.content.playerDeck.playerName,
    graveyard: state.content.playerDeck.graveyard,
  };
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
  deck: DeckZones,
  cardName: string,
  turn: "Current" | "Next",
  successCount: number,
  drawCount: number
): { hyperGeo: number; cumulative: number } => {
  let probability: number = 0;
  let cumProb: number = 0;
  const secondDrawPool: string[] =
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
  if (sampleSize <= deck.library.length) {
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
  } else {
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
    probability = hyperGeometricProbability(
      secondPoolPopulationSize,
      secondPoolPopulationSuccesses,
      secondPoolSampleSize,
      secondPoolSampleSuccesses
    );
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

// To Do: Move this to Deck class.
/**
 * Used by decks to eliminate ambiguity for certain Vassal activity.
 * @returns - A collection of all the div's in the log-scroll-container with the class 'log-line'
 */
const getLogScrollContainerLogLines = (): HTMLCollectionOf<HTMLElement> => {
  const scrollEl: Element = document.getElementsByClassName(
    "log-scroll-container"
  )[0];
  if (scrollEl === undefined) throw new Error("Element is undefined");
  const logLineCollection: HTMLCollectionOf<HTMLElement> =
    scrollEl.getElementsByClassName(
      "log-line"
    ) as HTMLCollectionOf<HTMLElement>;
  return logLineCollection;
};

/**
 * Returns an array of strings that are not in the base kingdom
 * @param kingdom - The given kingdom
 * @returns - Array containing strings from the given kingdom that are not in the base kingdom.
 */
const getNonBaseCardsInKingdom = (kingdom: string[]): string[] => {
  const nonBaseCards: string[] = kingdom.filter(
    (card) =>
      ![
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
      ].includes(card)
  );

  return nonBaseCards;
};

/**
 * Function gets boolean for whether the primary frame is hidden or not.
 * @returns - boolean.
 */
const getPrimaryFrameStatus = (): boolean | undefined => {
  const status: boolean | undefined = document
    .getElementById("primaryFrame")
    ?.classList.contains("hidden");
  return status;
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
 * Type guard function.  Takes an error of unknown type and uses type predicate to
 * narrow the type of the error if it indeed an ErrorWithMessage.
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
 * Redux state selector for the MainDeckViewer component.
 * @param state - The Redux Store State.
 * @returns - The portion of state needed by the MainDeckViewer.
 */
const mainDeckViewerStateSelectorFunction = (
  state: RootState
): MainDeckViewerState => {
  const deck = state.content.playerDeck;
  return {
    playerName: deck.playerName,
    deck: {
      entireDeck: deck.entireDeck,
      graveyard: deck.graveyard,
      hand: deck.hand,
      inPlay: deck.inPlay,
      library: deck.library,
      setAside: deck.setAside,
    },
    turnToggleButton: state.content.turnToggleButton,
    topCardsLookAmount: state.content.topCardsLookAmount,
  };
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
  setSortButtonState: React.Dispatch<SetStateAction<SortButtonState>>
) => {
  let sortToDispatch: "ascending" | "descending";
  if (currentSortButtonState.category !== sortCategory) {
    sortToDispatch = "ascending";
  } else {
    sortToDispatch =
      currentSortButtonState.sort === "ascending" ? "descending" : "ascending";
  }
  setSortButtonState({
    category: sortCategory,
    sort: sortToDispatch,
  });
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
 * Selector function for the OpponentViewer component.
 * @param state - The extension's redux RootState.
 * @returns - Object with parts of the redux state needed by the OpponentViewer.
 */
const opponentViewerStateSelectorFunction = (
  state: RootState
): OpponentViewerState => {
  const odData: Array<{ playerName: string; entireDeck: string[] }> = [];
  state.content.opponentDecks.forEach((od) => {
    odData.push({ playerName: od.playerName, entireDeck: od.entireDeck });
  });
  return {
    opponentDeckData: odData,
  };
};

/**
 * Message listener callback function.  Used by the content script
 *  to execute requests from the extension popup.
 * @param request - The request from the popup, to hide or show the Companion.
 * @param sender - Object with the chrome extension id and origin url.
 * @param sendResponse -
 */
const popupMessageListener = (
  request: { command: string },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: { message: string }) => void
) => {
  sender;
  const response: { message: string } = { message: "" };
  if (request.command === "appendDomRoot") {
    store.dispatch(setViewerHidden(false));
    response.message = "Successfully turned on.";
  } else if (request.command === "removeDomRoot") {
    store.dispatch(setViewerHidden(true));
    response.message = "Successfully turned off.";
  } else if (request.command === "sendHiddenState") {
    response.message = getPrimaryFrameStatus()
      ? "Hidden state is ON"
      : "Hidden state is OFF";
  } else {
    response.message = "Invalid Request";
  }
  sendResponse(response);
};

/**
 * Creates an OptionalHandles object to be used by the PrimaryFrame component
 * to call the useJQueryResizable hook.
 * @returns - An OptionalHandles object with a custom handle for 'se' (southeast).
 */
const primaryFrameResizableHandles = (): OptionalHandles => {
  const primaryFrameResizableHandle = document.createElement("div");
  primaryFrameResizableHandle.setAttribute(
    "id",
    "primary-frame-resizable-handle"
  );
  // Configure style to pull icon inward away from the frame border.
  primaryFrameResizableHandle.setAttribute(
    "style",
    "bottom: 8px; right: 8px; z-index:90;"
  );
  primaryFrameResizableHandle.setAttribute(
    "class",
    "ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se"
  );
  // Configure the style attribute to link handle to the Resizable icon resource.
  if (chrome.runtime !== null && chrome.runtime !== undefined) {
    const handleStyle = primaryFrameResizableHandle.getAttribute("style");
    primaryFrameResizableHandle!.setAttribute(
      "style",
      handleStyle +
        "background-image: url(chrome-extension://" +
        chrome.runtime.id +
        "/ui-icons_ffffff_256x240.png);"
    );
  }
  return { handles: { se: primaryFrameResizableHandle } };
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
  let prd = a,
    i = a;
  while (i++ < b) {
    prd *= i;
  }
  return prd;
};

/**
 * Attempts to send a request to the active tab and get the hidden status of the
 * extension.   If a valid response is received, executes the callback with the
 * appropriate on/off state.
 * @param cb - The given callback (a state setter for the extension popup)
 */
const sendContentViewerStatusRequest = async (
  cb: (viewerState: "ON" | "OFF") => void
) => {
  let tab: chrome.tabs.Tab | undefined = undefined;
  try {
    [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
  } catch (e) {
    console.error(getErrorMessage(e));
    console.error(e);
  }
  if (tab !== undefined) {
    const response = await chrome.tabs.sendMessage(tab.id!, {
      command: "sendHiddenState",
    });
    if (response.message === "Hidden state is ON") {
      cb("OFF");
    } else if (response.message === "Hidden state is OFF") {
      cb("ON");
    } else {
      console.error("There was an error");
    }
  }
};

/**
 * Used by the extension popup to send a request via chrome API to the content script
 * to 'turn off' the Companion (essentially unhide it), and uses the response object to
 * to set the popup state.
 * @param setToggleState - the state setter for the popup.
 */
const sendTurnOnRequest = async (
  setToggleState: React.Dispatch<SetStateAction<"ON" | "OFF">>
) => {
  let tab: chrome.tabs.Tab | undefined = undefined;
  try {
    [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
  } catch (e) {
    console.error(getErrorMessage(e));
    console.error(e);
  }
  if (tab !== undefined) {
    const response = await chrome.tabs.sendMessage(tab.id!, {
      command: "appendDomRoot",
    });
    if (response.message === "Successfully turned on.") {
      setToggleState("ON");
    } else {
      console.error("Invalid response message:", response.message);
    }
  }
};

/**
 * Used by the extension popup to send a request via chrome API to the content script
 * to 'turn off' the Companion (essentially hide it), and uses the response object to
 * to set the popup state.
 * @param setToggleState - the state setter for the popup.
 */
const sendTurnOffRequest = async (
  setToggleState: React.Dispatch<SetStateAction<"ON" | "OFF">>
) => {
  // Remove domRoot from client
  let tab: chrome.tabs.Tab | undefined = undefined;
  try {
    [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
  } catch (e) {
    console.error(getErrorMessage(e));
    console.error(e);
  }
  if (tab !== undefined) {
    const response = await chrome.tabs.sendMessage(tab.id!, {
      command: "removeDomRoot",
    });
    if (response.message === "Successfully turned off.") {
      setToggleState("OFF");
    } else {
      console.error("Invalid response message:", response.message);
    }
  }
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
            const cardA = entryA[0];
            const cardB = entryB[0];
            const result: number = sortTwoCardsByName(cardA, cardB, sortType);
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
            const cardATot = entryA[1].entireDeckCount;
            const cardBTot = entryB[1].entireDeckCount;
            const result: number = sortTwoCardsByAmount(
              cardATot,
              cardBTot,
              sortType
            );
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
            const cardALibAmount = entryA[1].zoneCount;
            const cardBLibAmount = entryB[1].zoneCount;
            const result = sortTwoCardsByAmount(
              cardALibAmount,
              cardBLibAmount,
              sortType
            );
            return result;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    // No default case needed.
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
  pd: DeckZones,
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
    //  No default case needed
  }
  return sortedMap;
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
  deck: DeckZones,
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
            const cardA = entryA[0];
            const cardB = entryB[0];
            const result: number = sortTwoCardsByName(cardA, cardB, sortType);
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
            const cardAmountA = entryA[1];
            const cardAmountB = entryB[1];
            // First try to sort by card amount...
            let result = sortTwoCardsByAmount(
              cardAmountA,
              cardAmountB,
              sortType
            );
            //... if card amounts equal sort by card name.
            if (result === 0) {
              const cardA = entryA[0];
              const cardB = entryB[0];
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
    // default case not needed
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
  const tMap: Map<string, CardCounts> = new Map();
  const aMap: Map<string, CardCounts> = new Map();
  const vMap: Map<string, CardCounts> = new Map();
  const cMap: Map<string, CardCounts> = new Map();
  const splitMaps: SplitMaps = {
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
 * Custom equality function for useSelector hooks.  Compares old
 * value and new value by their stringified values instead of
 * references.  Used to prevent unnecessary rerenders.
 * @param oldValue - The old useSelector value.
 * @param newValue - The updated useSelector value.
 * @returns - Boolean for whether the oldValue and newValue have equal stringified values.
 */
const stringifiedEqualityFunction = (
  oldValue: Serializable,
  newValue: Serializable
): boolean => {
  return JSON.stringify(oldValue) === JSON.stringify(newValue);
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

const trashZoneViewerStateSelectorFunction = (
  state: RootState
): TrashZoneViewerState => {
  const opponentTrashData: Array<{
    playerName: string;
    trashZone: string[];
  }> = [];
  state.content.opponentDecks.forEach((opponentDeck) => {
    opponentTrashData.push({
      playerName: opponentDeck.playerName,
      trashZone: opponentDeck.trash,
    });
  });
  return {
    playerName: state.content.playerDeck.playerName,
    playerTrash: state.content.playerDeck.trash,
    opponentTrashData,
  };
};

/**
 * Custom react hook used by the popup of the extension.  Sends a request to the extension
 * content script to get the viewer's display status (hidden or showing)
 * @param cb - Callback function that takes the response from the extension content as an argument.
 * used by the popup in it's toggleState.
 */
const useContentViewerStatus = (cb: (viewerState: "ON" | "OFF") => void) => {
  useEffect(() => {
    sendContentViewerStatusRequest(cb);
  }, []);
};

/**
 * Custom react hook.  Keeps track of the height difference a container element and
 * a element within the container updates the height difference whenever the container
 * height changes or when any of the given dependencies change.
 * @param containerElement - A container element.
 * @param innerElement - An element inside the container element.
 * @param setHeightDifference - useState setter to track the height difference.
 * @param containerHeight - The container height used as a dependency.
 * @param dependencies - Optional array of other  dependencies.
 */
const useHeightDifferentBetweenContainerAndContainedElement = (
  containerElement: HTMLElement | HTMLDivElement | null,
  innerElement: HTMLElement | HTMLDivElement | null,
  setHeightDifference: React.Dispatch<SetStateAction<number>>,
  containerHeight: number,
  dependencies?: Array<number | string | boolean>
) => {
  // useMemo is preferred to useEffect here, no need to wait until the render has completed.
  useMemo(() => {
    if (innerElement && containerElement)
      setHeightDifference(
        containerElement.offsetHeight - innerElement.offsetHeight
      );
  }, [containerHeight]);

  useEffect(() => {
    if (innerElement && containerElement)
      setHeightDifference(
        containerElement.offsetHeight - innerElement.offsetHeight
      );
  }, dependencies);
};

/**
 * Custom React hook.  Whenever it detect a change in the given element's attributes,
 * it dispatches the value of the element's height property with the given SetStateAction.
 * @param targetElement - The element to observe for changes in height
 * @param setHeight - the React SetStateAction dispatched with the new height value.
 */
const useElementHeight = (
  targetElement: HTMLElement | HTMLDivElement | null,
  setHeight: React.Dispatch<SetStateAction<number>>
) => {
  const [observer, setObserver] = useState<MutationObserver | null>(null);
  const onElementMutation = useCallback(
    (mutationList: MutationRecord[]) => {
      const primaryFrame = mutationList[0].target as HTMLElement;
      setHeight(primaryFrame.offsetHeight);
    },
    [setHeight]
  );
  useEffect(() => {
    const obs = new MutationObserver(onElementMutation);
    setObserver(obs);
  }, [setObserver]);
  useEffect(() => {
    if (!observer) return;
    if (targetElement)
      observer.observe(targetElement, {
        attributes: true,
        childList: false,
        subtree: false,
      });
    return () => {
      if (observer) {
        if (targetElement) observer.disconnect();
      }
    };
  }, [observer, targetElement]);
};

/**
 * Custom React Hook.  Applies the jQuery Draggable widget to the given element.
 * Removes the widget from the element on component unmount.
 * @param targetElement  - The element to make draggable.
 */
const useJQueryDraggable = (
  targetElement: HTMLElement | HTMLDivElement | null
  // dependencies?: any[]
) => {
  //TODO: instead of declaring minimized here, allow function to accept a dependency array
  const minimized = store.getState().content.minimized;
  useEffect(() => {
    if (targetElement) {
      try {
        $(targetElement).draggable({});
      } catch (e) {
        console.error(getErrorMessage(e));
        console.error(e);
      }
      return () => {
        try {
          if (
            targetElement &&
            $(targetElement).draggable("instance") !== undefined
          ) {
            $(targetElement).draggable("destroy");
          }
        } catch (e) {
          console.error(getErrorMessage(e));
          console.error(e);
        }
      };
    } else return () => {};
  }, [targetElement, minimized]);
};

/**
 * React custom hook.  Applies the jQuery resizable widget to the given element, and
 * optionally accepts a customHandles object.  The handles provided in the customHandles
 * object will be used on the targetElement instead of the default handles.  To optionally
 * exclude a handle, use undefined, ie: customHandles = {handles: {n:undefined}} will exclude
 * the north handle from being added to the target element
 * @param targetElement - a HTMLEivElement to add the jQuery resizable widget to.
 * @param customHandles - a OptionalHandles object, use to exclude handles or to include custom handles.
 */
const useJQueryResizable = (
  targetElement: HTMLElement | HTMLDivElement | null,
  customHandles?: OptionalHandles
) => {
  // Create an memoized options object that is equivalent to
  // what the resizable widget uses when provided with the option {handles:"all"}.
  // Here we are manually creating the default handles so they can be optionally
  // overridden with a custom handle as desired.
  const DEFAULT_OPTIONS: OptionalHandles = useMemo(() => {
    const northHandle = document.createElement("div");
    northHandle.setAttribute("class", "ui-resizable-handle ui-resizable-n");
    northHandle.setAttribute("style", "z-index: 90;");
    const eastHandle = document.createElement("div");
    eastHandle.setAttribute("class", "ui-resizable-handle ui-resizable-e");
    eastHandle.setAttribute("style", "z-index: 90;");
    const southHandle = document.createElement("div");
    southHandle.setAttribute("class", "ui-resizable-handle ui-resizable-s");
    southHandle.setAttribute("style", "z-index: 90;");
    const westHandle = document.createElement("div");
    westHandle.setAttribute("class", "ui-resizable-handle ui-resizable-w");
    westHandle.setAttribute("style", "z-index: 90;");
    const SEHandle = document.createElement("div");
    SEHandle.setAttribute("class", "ui-resizable-handle ui-resizable-se");
    SEHandle.setAttribute("style", "z-index: 90;");
    const SWHandle = document.createElement("div");
    SWHandle.setAttribute("class", "ui-resizable-handle ui-resizable-sw");
    SWHandle.setAttribute("style", "z-index: 90;");
    const NEHandle = document.createElement("div");
    NEHandle.setAttribute("class", "ui-resizable-handle ui-resizable-ne");
    NEHandle.setAttribute("style", "z-index: 90;");
    const NWHandle = document.createElement("div");
    NWHandle.setAttribute("class", "ui-resizable-handle ui-resizable-nw");
    NWHandle.setAttribute("style", "z-index: 90;");
    return {
      handles: {
        n: northHandle,
        e: eastHandle,
        s: southHandle,
        w: westHandle,
        se: SEHandle,
        sw: SWHandle,
        ne: NEHandle,
        nw: NWHandle,
      },
    };
  }, []);
  // Minimized Redux state for useEffect dependency.
  //TODO: instead of declaring minimized here, allow function to accept a dependency array
  const minimized = store.getState().content.minimized;
  useEffect(() => {
    let targetIsResizable: object | undefined = undefined;
    try {
      if (targetElement)
        targetIsResizable = $(targetElement).resizable("instance");
    } catch (e) {
      console.error(getErrorMessage(e));
      console.error(e);
    }
    // Only execute if...
    if (
      // ...targetElement is truthy,...
      targetElement &&
      // ...minimized is false,...
      !minimized &&
      // ... and the targetElement is not currently resizable.
      targetIsResizable === undefined
    ) {
      try {
        let options = DEFAULT_OPTIONS;
        // If function was called with the optional customHandles param,
        // assign them to the options object. Otherwise the default will be used.
        if (customHandles) {
          options = {
            handles: {
              ...options.handles,
              ...customHandles.handles,
            },
          };
        }
        // Append the handles to the target div.
        Object.values(options.handles).forEach((div) => {
          if (div) targetElement.appendChild(div);
        });
        // Add resizable widget to the target element using the provided options/
        $(targetElement).resizable(options);
      } catch (e) {
        console.error(getErrorMessage(e));
        console.error(e);
      }
      return () => {
        // Remove resizable from targetElement on unmount
        try {
          $(targetElement).resizable("destroy");
        } catch (e) {
          console.error(getErrorMessage(e));
          console.error(e);
        }
      };
    } else return () => {};
    // Trigger this effect whenever the 'minimized' redux state or targetElement changes.
  }, [targetElement, minimized]);
};

/**
 * Custom React hook.  Reconciliation to allow for jQuery resizable Widget to function
 * correctly with built in minimization feature.  jQuery resizable affects the style
 * attribute of the resizable element, therefore proper minimization is not possible
 * with tailwind classes alone. This hook modifies the style attribute
 * in a jQuery resizable friendly way, to achieve the desired effect.
 * @param targetElement
 */
const useMinimizer = (targetElement: HTMLDivElement | HTMLElement | null) => {
  // useState hook to store height of the target element just before minimization.
  // and to restore the target element to that height upon un-minimization
  const [preMinimizedPrimaryFrameHeight, setPreMinimizedPrimaryFrameHeight] =
    useState<string>("");
  // Minimized Redux state for useEffect dependency.
  //TODO: instead of declaring minimized here, allow function to accept a dependency array
  const minimized = store.getState().content.minimized;
  useEffect(() => {
    if (minimized) {
      if (targetElement !== null) {
        const style = targetElement.getAttribute("style");
        if (style !== null) {
          const currentHeight = style.match(/ height: \d+px; ?/);
          if (currentHeight !== null)
            setPreMinimizedPrimaryFrameHeight(currentHeight[0]);
          targetElement.setAttribute(
            "style",
            style.replace(/ height: \d+px; ?/, " height: 0px; ")!
          );
        }
      }
    } else {
      if (targetElement !== null) {
        const style = targetElement.getAttribute("style");
        if (style !== null) {
          const currentHeight = style.match(/ height: \d+px; ?/);
          if (currentHeight !== null) {
            targetElement.setAttribute(
              "style",
              style.replace(
                / height: \d+px; ?/,
                preMinimizedPrimaryFrameHeight
              )!
            );
          }
        }
      }
    }
  }, [minimized]);
};

/**
 * Custom react hook that handles a chrome message listener that listener.  Used by the PrimaryFrame component to listen for
 * messages from the Popup component that adds and removes the DomRoot from the client.
 */
const usePopupChromeMessageListener = (
  dependencies: Array<string | boolean | number> = []
) => {
  useEffect(() => {
    if (chrome.runtime !== undefined)
      chrome.runtime.onMessage.addListener(popupMessageListener);
    return () => {
      if (chrome.runtime !== undefined)
        chrome.runtime.onMessage.removeListener(popupMessageListener);
    };
  }, dependencies);
};

/**
 * Custom hook that hook that sorts the MainDeckViewer Component by creating
 * a sorted map that combines the deck's library and entire deck list into
 * a map of CardCounts, sorting it, and dispatching it with the given
 * SetStateAction.
 * @param mainDeckViewerState - the portion of redux state needed by the component.
 * @param setLibraryMap - A react SetStateAction.
 */
const useMainDeckViewerSorter = (
  mainDeckViewerState: MainDeckViewerState,
  sortButtonState: SortButtonState,
  setLibraryMap: (value: React.SetStateAction<Map<string, CardCounts>>) => void
) => {
  useEffect(() => {
    const unsortedCombinedMap = combineDeckListMapAndZoneListMap(
      getCountsFromArray(mainDeckViewerState.deck.entireDeck),
      getCountsFromArray(mainDeckViewerState.deck.library)
    );
    const sortedCombinedMap = sortMainViewer(
      sortButtonState.category,
      unsortedCombinedMap,
      sortButtonState.sort,
      mainDeckViewerState.deck,
      mainDeckViewerState.topCardsLookAmount,
      mainDeckViewerState.turnToggleButton
    );
    setLibraryMap(sortedCombinedMap);
  }, [mainDeckViewerState, sortButtonState]);
};

/**
 * Custom Hook used to restore the previously set scroll position on the
 * given Scrollbars element when a tab changes.
 * @param scrollElement - a Scrollbars element.
 * @param scrollPosition - the scroll positions saved in useState.
 * @param primaryFrameTab - The currently pinned PrimaryFrameTab.
 */
const useSavedScrollPositions = (
  scrollElement: Scrollbars | null,
  scrollPosition: {
    discard: number;
    deck: number;
    trash: number;
    opponent: number;
  },
  primaryFrameTab: PrimaryFrameTabType
) => {
  useEffect(() => {
    // On any render, the scroll  position is set to whatever value was previously
    // set to the redux variable selectScrollPosition.
    if (scrollElement !== undefined && scrollElement !== null) {
      let computedKey = primaryFrameTab.toLowerCase();
      if (computedKey === "opponents") computedKey = "opponent";
      switch (computedKey) {
        case "opponent":
          scrollElement.scrollTop(scrollPosition.opponent);
          break;
        case "discard":
          scrollElement.scrollTop(scrollPosition.discard);
          break;
        case "deck":
          scrollElement.scrollTop(scrollPosition.deck);
          break;
        case "trash":
          scrollElement.scrollTop(scrollPosition.trash);
          break;
        default:
          throw new Error("invalid primaryFrameTab");
      }
    }
  }, [primaryFrameTab]);
};

/**
 * Custom hook that creates a sortedMap from map from a zone and dispatches
 * it as an action to a React SetStateAction.
 * @param zone - The given array representing a deck zone.
 * @param sortButtonState - A SortButtonState with sort instructions
 * @param setMap - th React SetStateAction
 * @param dependencies - An array of dependencies for the useEffect hook.
 */
const useZoneViewerSorter = (
  zone: string[],
  sortButtonState: SortButtonState,
  setMap: (value: React.SetStateAction<Map<string, number>>) => void
) => {
  const [newZone, setNewZone] = useState(zone.slice());
  const [newSort, setNewSort] = useState(sortButtonState);
  const prevRef = useRef<{
    prevZone: string[];
    prevSortState: SortButtonState;
  }>({
    prevZone: zone.slice(),
    prevSortState: sortButtonState,
  });
  useEffect(() => {
    if (JSON.stringify(prevRef.current.prevZone) !== JSON.stringify(zone)) {
      prevRef.current.prevZone = zone.slice();
      setNewZone(zone.slice());
    }
  }, [zone]);
  useEffect(() => {
    if (
      JSON.stringify(prevRef.current.prevSortState) !==
      JSON.stringify(sortButtonState)
    ) {
      prevRef.current.prevSortState = sortButtonState;
      setNewSort(sortButtonState);
    }
  }, [sortButtonState]);
  useEffect(() => {
    const unsortedMap = getCountsFromArray(zone);
    const sortedMap = sortZoneView(
      sortButtonState.category,
      unsortedMap,
      sortButtonState.sort
    );
    setMap(sortedMap);
  }, [newSort, newZone]);
};

export {
  combinations,
  combineDeckListMapAndZoneListMap,
  createEmptySplitMapsObject,
  cumulativeHyperGeometricProbability,
  customSelectResizableHandles,
  discardZoneViewerStateSelectorFunction,
  getCountsFromArray,
  getCumulativeHyperGeometricProbabilityForCard,
  getErrorMessage,
  getLogScrollContainerLogLines,
  getNonBaseCardsInKingdom,
  getPrimaryFrameStatus,
  getRowColor,
  hyperGeometricProbability,
  isErrorWithMessage,
  mainDeckViewerStateSelectorFunction,
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
  opponentViewerStateSelectorFunction,
  popupMessageListener,
  primaryFrameResizableHandles,
  product_Range,
  sendContentViewerStatusRequest,
  sendTurnOffRequest,
  sendTurnOnRequest,
  sortHistoryDeckView,
  sortMainViewer,
  sortTwoCardsByAmount,
  sortTwoCardsByName,
  sortTwoCardsByProbability,
  sortZoneView,
  splitCombinedMapsByCardTypes,
  stringifiedEqualityFunction,
  stringifyProbability,
  trashZoneViewerStateSelectorFunction,
  toErrorWithMessage,
  useContentViewerStatus,
  useHeightDifferentBetweenContainerAndContainedElement,
  useElementHeight,
  useJQueryDraggable,
  useJQueryResizable,
  usePopupChromeMessageListener,
  useMinimizer,
  useMainDeckViewerSorter,
  useSavedScrollPositions,
  useZoneViewerSorter,
};
