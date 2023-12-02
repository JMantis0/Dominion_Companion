import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { EmptyDeck } from "../model/emptyDeck";
import { EmptyOpponentDeck } from "../model/emptyOpponentDeck";
import type {
  OpponentStoreDeck,
  PrimaryFrameTabType,
  SavedGames,
  StoreDeck,
} from "../utils";

export interface ContentState {
  playerDeck: StoreDeck;
  opponentDecks: OpponentStoreDeck[];
  viewerHidden: boolean;
  gameActiveStatus: boolean;
  savedGames: SavedGames;
  baseOnly: boolean;
  primaryFrameTab: PrimaryFrameTabType;
  pinnedPrimaryFrameTab: PrimaryFrameTabType;
  turnToggleButton: "Current" | "Next";
  pinnedTurnToggleButton: "Current" | "Next";
  topCardsLookAmount: number;
  pinnedTopCardsLookAmount: number;
  selectScrollPosition: number;
  error: string | null;
  minimized: boolean;
}

export const initialState: ContentState = {
  playerDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
  opponentDecks: [JSON.parse(JSON.stringify(new EmptyOpponentDeck()))],
  viewerHidden: false,
  gameActiveStatus: false,
  savedGames: {
    none: {
      logArchive: "none",
      playerDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
      opponentDecks: [JSON.parse(JSON.stringify(new EmptyOpponentDeck()))],
      dateTime: "none",
      logHtml: "none",
    },
  },
  baseOnly: true,
  primaryFrameTab: "Deck",
  pinnedPrimaryFrameTab: "Deck",
  turnToggleButton: "Current",
  pinnedTurnToggleButton: "Current",
  topCardsLookAmount: 1,
  pinnedTopCardsLookAmount: 1,
  selectScrollPosition: 0,
  error: null,
  minimized: false,
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setPlayerDeck: (state, action: PayloadAction<StoreDeck>) => {
      state.playerDeck = action.payload;
    },
    setOpponentDecks: (state, action: PayloadAction<OpponentStoreDeck[]>) => {
      state.opponentDecks = action.payload;
    },
    setViewerHidden: (state, action: PayloadAction<boolean>) => {
      state.viewerHidden = action.payload;
    },
    setGameActiveStatus: (state, action: PayloadAction<boolean>) => {
      state.gameActiveStatus = action.payload;
    },
    setSavedGames: (state, action: PayloadAction<SavedGames>) => {
      state.savedGames = action.payload;
    },
    setBaseOnly: (state, action: PayloadAction<boolean>) => {
      state.baseOnly = action.payload;
    },
    setPrimaryFrameTab: (state, action: PayloadAction<PrimaryFrameTabType>) => {
      state.primaryFrameTab = action.payload;
    },
    setPinnedPrimaryFrameTab: (
      state,
      action: PayloadAction<PrimaryFrameTabType>
    ) => {
      state.pinnedPrimaryFrameTab = action.payload;
    },
    setTurnToggleButton: (state, action: PayloadAction<"Current" | "Next">) => {
      state.turnToggleButton = action.payload;
    },
    setPinnedTurnToggleButton: (
      state,
      action: PayloadAction<"Current" | "Next">
    ) => {
      state.pinnedTurnToggleButton = action.payload;
    },
    setTopCardsLookAmount: (state, action: PayloadAction<number>) => {
      state.topCardsLookAmount = action.payload;
    },
    setPinnedTopCardsLookAmount: (state, action: PayloadAction<number>) => {
      state.pinnedTopCardsLookAmount = action.payload;
    },
    setSelectScrollPosition: (state, action: PayloadAction<number>) => {
      state.selectScrollPosition = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMinimized: (state, action: PayloadAction<boolean>) => {
      state.minimized = action.payload;
    },
  },
});

export const {
  setPlayerDeck,
  setOpponentDecks,
  setViewerHidden,
  setGameActiveStatus,
  setSavedGames,
  setPrimaryFrameTab,
  setPinnedPrimaryFrameTab,
  setBaseOnly,
  setPinnedTopCardsLookAmount,
  setPinnedTurnToggleButton,
  setTopCardsLookAmount,
  setSelectScrollPosition,
  setTurnToggleButton,
  setError,
  setMinimized,
} = contentSlice.actions;
export const selectContent = (state: RootState) => state.content;
export default contentSlice.reducer;
