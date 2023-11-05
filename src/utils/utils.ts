import { AnyAction, Dispatch } from "redux";
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
  try {
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
  } catch (e) {
    console.log(
      "There was an error.  If you're seeing this message you probably tried to execute this function in a testing environment"
    );
    console.log(getErrorMessage(e));
  }
};

/**
 * Add jQuery interactions 'Resizable' and 'Draggable' to the PrimaryFrame.
 * The fix for getting Resizable handle icons to appear in extension context is also here.
 */
const addResizableAndDraggableToPrimaryFrame = ($: JQueryStatic) => {
  try {
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
  } catch (e) {
    console.log(
      "There was an error.  If you're seeing this message you probably tried to execute this function in a testing environment"
    );
    console.log(getErrorMessage(e));
  }
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
  let scrollEl: Element;
  let logLineCollection: HTMLCollectionOf<HTMLElement>;
  scrollEl = document.getElementsByClassName("log-scroll-container")[0];
  if (scrollEl === undefined) throw new Error("Element is undefined");
  logLineCollection = scrollEl.getElementsByClassName(
    "log-line"
  ) as HTMLCollectionOf<HTMLElement>;
  return logLineCollection;
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
            let result: number = sortTwoCardsByName(cardA, cardB, sortType);
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
            let result: number = sortTwoCardsByAmount(
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
            let result = sortTwoCardsByAmount(
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
            let result: number = sortTwoCardsByName(cardA, cardB, sortType);
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

export {
  addResizableAndCustomHandleToCustomSelectScrollBars,
  addResizableAndDraggableToPrimaryFrame,
  chromeListenerUseEffectHandler,
  combinations,
  combineDeckListMapAndZoneListMap,
  createEmptySplitMapsObject,
  cumulativeHyperGeometricProbability,
  getCountsFromArray,
  getCumulativeHyperGeometricProbabilityForCard,
  getErrorMessage,
  getLogScrollContainerLogLines,
  getPrimaryFrameStatus,
  getRowColor,
  hyperGeometricProbability,
  isErrorWithMessage,
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
  sortHistoryDeckView,
  sortMainViewer,
  sortTwoCardsByAmount,
  sortTwoCardsByName,
  sortTwoCardsByProbability,
  sortZoneView,
  splitCombinedMapsByCardTypes,
  stringifyProbability,
  toErrorWithMessage,
};
