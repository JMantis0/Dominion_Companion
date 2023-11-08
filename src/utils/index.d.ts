import {
  ActionCreatorWithPayload,
  AnyAction,
  MiddlewareArray,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { ContentState } from "../redux/contentSlice";
import { OptionsState } from "../redux/optionsSlice";

/**
 * Custom object literal type.  One property holds value for the total amount of cards
 * owned.  The other property holds the value for the amount of that card in a specific
 * zone.
 */
interface CardCounts {
  entireDeckCount: number;
  zoneCount: number;
}

// Type for the redux store.  This type allows for an empty middleware array for faster testing.
type DOMStore = ToolkitStore<
  {
    content: ContentState;
    options: OptionsState;
  },
  AnyAction,
  | MiddlewareArray<
      [
        ThunkMiddleware<
          {
            content: ContentState;
            options: OptionsState;
          },
          AnyAction
        >
      ]
    >
  | never[]
>;

/**
 * Interface used for handling unknown objects that *might* be an error.
 */
interface ErrorWithMessage extends Error {
  message: string;
}

/**
 * Custom type for deck field gameResult.
 */
type GameResult = "Victory" | "Defeat" | "Tie" | "Unfinished";

/**
 * Type used to stringify and store in Chrome Local Storage
 */
interface OpponentStoreDeck {
  gameTitle: string;
  gameTurn: number;
  gameResult: GameResult;
  ratedGame: boolean;
  rating: string;
  entireDeck: Array<string>;
  playerName: string;
  playerNick: string;
  currentVP: number;
  kingdom: Array<string>;
  trash: Array<string>;
  lastEntryProcessed: string;
  logArchive: Array<string>;
  treasurePopped: boolean;
}

/**
 * Custom type for PrimaryFrameTab
 */
type PrimaryFrameTabType = "Deck" | "Discard" | "Trash" | "Opponent";

/**
 * Type for a SavedGame as stored in chrome local storage as JSON
 */
interface SavedGame {
  logArchive: string;
  playerDeck: StoreDeck;
  opponentDeck: OpponentStoreDeck;
  dateTime: string;
  logHtml: string;
}

/**
 * Type for all the saved games as stored in chrome local storage as JSON
 */
interface SavedGames {
  [title: string]: SavedGame;
}

/**
 * Custom type for redux variable sortButtonState.
 */
interface SortButtonState {
  category: SortCategory;
  sort: "ascending" | "descending";
}

/**
 * Custom Type for redux variable that holds the category to sort by.
 */
type SortCategory = "card" | "zone" | "owned" | "probability";

/**
 *Custom type for the dispatch functions / reducers that change the redux sortButtonState.
 */
type SortReducer = ActionCreatorWithPayload<SortButtonState, any>;

/**
 * Custom object literal type, an object with 4 properties, each a Map<string,CardCounts object,
 * one for each card type: Treasure, Action, Victory, Curse
 */
interface SplitMaps {
  treasures: Map<string, CardCounts> | undefined;
  actions: Map<string, CardCounts> | undefined;
  victories: Map<string, CardCounts> | undefined;
  curses: Map<string, CardCounts> | undefined;
}

/**
 * Type used to stringify and store in Chrome Local Storage
 */
interface StoreDeck {
  currentVP: number;
  entireDeck: Array<string>;
  gameResult: GameResult;
  gameTitle: string;
  gameTurn: number;
  graveyard: Array<string>;
  hand: Array<string>;
  inPlay: Array<string>;
  kingdom: Array<string>;
  lastEntryProcessed: string;
  library: Array<string>;
  logArchive: Array<string>;
  playerName: string;
  playerNick: string;
  ratedGame?: boolean;
  rating: string;
  setAside: Array<string>;
  trash: Array<string>;
  treasurePopped: boolean;
  waitToDrawLibraryLook: boolean;
  waitToShuffle: boolean;
}

export {
  CardCounts,
  DOMStore,
  ErrorWithMessage,
  GameResult,
  OpponentStoreDeck,
  PrimaryFrameTabType,
  SavedGame,
  SavedGames,
  SortButtonState,
  SortCategory,
  SortReducer,
  SplitMaps,
  StoreDeck,
};
