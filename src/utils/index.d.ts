import {
  ActionCreatorWithPayload,
  AnyAction,
  MiddlewareArray,
  ThunkMiddleware,
} from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { ContentState } from "../redux/contentSlice";
import { OptionsState } from "../redux/optionsSlice";
import { Duration } from "../model/duration";

/**
 * Custom object literal type.  One property holds value for the total amount of cards
 * owned.  The other property holds the value for the amount of that card in a specific
 * zone.
 */
interface CardCounts {
  entireDeckCount: number;
  zoneCount: number;
}

/**
 * Type used by the getCumulativeHyperGeometricProbabilityForCard parameter.
 */
type DeckZones = {
  library: string[];
  hand: string[];
  graveyard: string[];
  entireDeck: string[];
  setAside: string[];
  inPlay: string[];
};

type DiscardZoneViewerState = {
  playerName: string;
  graveyard: string[];
};

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

type DurationName =
  | "Cage"
  | "Grotto"
  | "Guardian"
  | "Haven"
  | "Lighthouse"
  | "Search"
  | "Amulet"
  | "Astrolabe"
  | "Caravan Guard"
  | "Cargo Ship"
  | "Church"
  | "Dungeon"
  | "Enchantress"
  | "Fishing Village"
  | "Gear"
  | "Ghost Town"
  | "Importer"
  | "Monkey"
  | "Secluded Shrine"
  | "Secret Cave"
  | "Siren"
  | "Stowaway"
  | "Taskmaster"
  | "Abundance"
  | "Blockade"
  | "Cabin Boy"
  | "Caravan"
  | "Conjurer"
  | "Flagship"
  | "Garrison"
  | "Landing Party"
  | "Research"
  | "Royal Galley"
  | "Sailor"
  | "Tide Pools"
  | "Village Green"
  | "Voyage"
  | "Rope"
  | "Ghost"
  | "Archive"
  | "Barge"
  | "Bridge Troll"
  | "Buried Treasure"
  | "Cobbler"
  | "Contract"
  | "Corsair"
  | "Crew"
  | "Crypt"
  | "Cutthroat"
  | "Den of Sin"
  | "Enlarge"
  | "Frigate"
  | "Gatekeeper"
  | "Haunted Woods"
  | "Highwayman"
  | "Longship"
  | "Mastermind"
  | "Merchant Ship"
  | "Outpost"
  | "Pirate"
  | "Quartermaster"
  | "Sea Witch"
  | "Swamp Hag"
  | "Tactician"
  | "Warlord"
  | "Wharf"
  | "Captain"
  | "Hireling"
  | "Raider"
  | "Stronghold"
  | "Champion"
  | "Amphora"
  | "Endless Chalice"
  | "Figurehead"
  | "Jewels"
  | "Prince"
  | "Throne Room";

/**
 * Interface used for handling unknown objects that *might* be an error.
 */
interface ErrorWithMessage extends Error {
  message: string;
}

/**
 * Custom type for deck field gameResult.
 */
type GameResult =
  | "Victory"
  | "Defeat"
  | "Tie"
  | "Unfinished"
  | "1st Place"
  | "2nd Place"
  | "3rd Place"
  | "4th Place"
  | "5th Place"
  | "6th Place";

type MainDeckViewerState = {
  playerName: string;
  deck: DeckZones;
  turnToggleButton: "Current" | "Next";
  topCardsLookAmount: number;
};

/**
 * Type used to stringify and store in Chrome Local Storage
 */
interface OpponentStoreDeck {
  gameTitle: string;
  gameTurn: number;
  gameResult: GameResult;
  ratedGame: boolean;
  rating?: string;
  entireDeck: Array<string>;
  playerName: string;
  playerNick: string;
  currentVP: number;
  kingdom: Array<string>;
  trash: Array<string>;
  lastEntryProcessed: string;
  logArchive: Array<string>;
  debug: boolean;
}

type OpponentViewerState = {
  opponentDeckData: Array<{ playerName: string; entireDeck: string[] }>;
};

/**
 * Type for optional custom handles to be consumed by JQuery resizable widget
 */
type OptionalHandles = {
  handles: {
    n?: HTMLDivElement;
    e?: HTMLDivElement;
    s?: HTMLDivElement;
    w?: HTMLDivElement;
    ne?: HTMLDivElement;
    se?: HTMLDivElement;
    sw?: HTMLDivElement;
    nw?: HTMLDivElement;
  };
};

/**
 * Custom type for PrimaryFrameTab
 */
type PrimaryFrameTabType =
  | "Deck"
  | "Discard"
  | "Trash"
  | "Opponent"
  | "Opponents";

/**
 * Type for a SavedGame as stored in chrome local storage as JSON
 */
interface SavedGame {
  logArchive: string;
  playerDeck: StoreDeck;
  opponentDecks: OpponentStoreDeck[];
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
type SortReducer = ActionCreatorWithPayload<SortButtonState, string>;

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
  activeDurations: Array<Duration>;
  currentVP: number;
  durationSetAside: string[];
  entireDeck: Array<string>;
  gameResult: GameResult;
  gameTitle: string;
  gameTurn: number;
  graveyard: Array<string>;
  hand: Array<string>;
  inPlay: Array<string>;
  kingdom: Array<string>;
  lastEntryProcessed: string;
  latestAction: string;
  library: Array<string>;
  logArchive: Array<string>;
  playerName: string;
  playerNick: string;
  ratedGame?: boolean;
  rating: string;
  setAside: Array<string>;
  trash: Array<string>;
  waitToDrawLibraryLook: boolean;
  waitToShuffle: boolean;
  debug: boolean;
}

/**
 * State type for TrashZoneViewer component.
 */
type TrashZoneViewerState = {
  playerName: string;
  playerTrash: string[];
  opponentTrashData: Array<{ playerName: string; trashZone: string[] }>;
};

export {
  CardCounts,
  DeckZones,
  DiscardZoneViewerState,
  DurationName,
  DOMStore,
  ErrorWithMessage,
  GameResult,
  MainDeckViewerState,
  OpponentStoreDeck,
  OpponentViewerState,
  OptionalHandles,
  PrimaryFrameTabType,
  SavedGame,
  SavedGames,
  SortButtonState,
  SortCategory,
  SortReducer,
  SplitMaps,
  StoreDeck,
  TrashZoneViewerState,
};
