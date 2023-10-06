import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { StoreDeck } from "../model/storeDeck";
import { EmptyDeck } from "../model/emptyDeck";
import { EmptyOpponentDeck } from "../model/emptyOpponentDeck";
import { OpponentStoreDeck } from "../model/opponentStoreDeck";
import { PrimaryFrameTabType, SortButtonState } from "../utils/utils";

export interface ContentState {
  playerDeck: StoreDeck;
  opponentDeck: OpponentStoreDeck;
  sortButtonState: SortButtonState;
  discardSortState: SortButtonState;
  opponentSortState: SortButtonState;
  opponentTrashSortState: SortButtonState;
  trashSortState: SortButtonState;
  inPlaySortState: SortButtonState;
  handSortState: SortButtonState;
  setAsideSortState: SortButtonState;
  viewerHidden: boolean;
  gameActiveStatus: boolean;
  savedGames: any;
  baseOnly: boolean;
  primaryFrameTab: PrimaryFrameTabType;
  pinnedPrimaryFrameTab: PrimaryFrameTabType;
  turnToggleButton: "Current" | "Next";
  pinnedTurnToggleButton: "Current" | "Next";
  topCardsLookAmount: number;
  pinnedTopCardsLookAmount: number;
  selectOpen: boolean;
  selectScrollPosition: number;
}

const initialState: ContentState = {
  playerDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
  opponentDeck: JSON.parse(JSON.stringify(new EmptyOpponentDeck())),
  sortButtonState: {
    category: "probability",
    sort: "ascending",
  },
  discardSortState: {
    category: "card",
    sort: "descending",
  },
  opponentSortState: {
    category: "card",
    sort: "descending",
  },
  opponentTrashSortState: {
    category: "card",
    sort: "descending",
  },
  trashSortState: {
    category: "card",
    sort: "descending",
  },
  inPlaySortState: {
    category: "card",
    sort: "descending",
  },
  handSortState: {
    category: "card",
    sort: "descending",
  },
  setAsideSortState: {
    category: "card",
    sort: "descending",
  },
  viewerHidden: false,
  gameActiveStatus: false,
  savedGames: {
    none: {
      logArchive: "none",
      playerDeck: JSON.stringify(new EmptyDeck()),
      opponentDeck: JSON.stringify(new EmptyOpponentDeck()),
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
  selectOpen: false,
  selectScrollPosition: 0,
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setPlayerDeck: (state, action: PayloadAction<StoreDeck>) => {
      state.playerDeck = action.payload;
    },
    setOpponentDeck: (state, action: PayloadAction<OpponentStoreDeck>) => {
      state.opponentDeck = action.payload;
    },
    setSortedButtonsState: (state, action: PayloadAction<SortButtonState>) => {
      state.sortButtonState = action.payload;
    },
    setDiscardSortState: (state, action: PayloadAction<SortButtonState>) => {
      state.discardSortState = action.payload;
    },
    setOpponentSortState: (state, action: PayloadAction<SortButtonState>) => {
      state.opponentSortState = action.payload;
    },
    setOpponentTrashSortState: (
      state,
      action: PayloadAction<SortButtonState>
    ) => {
      state.opponentTrashSortState = action.payload;
    },
    setTrashSortState: (state, action: PayloadAction<SortButtonState>) => {
      state.trashSortState = action.payload;
    },
    setInPlaySortState: (state, action: PayloadAction<SortButtonState>) => {
      state.inPlaySortState = action.payload;
    },
    setHandSortState: (state, action: PayloadAction<SortButtonState>) => {
      state.handSortState = action.payload;
    },
    setSetAsideSortState: (state, action: PayloadAction<SortButtonState>) => {
      state.setAsideSortState = action.payload;
    },
    setViewerHidden: (state, action: PayloadAction<boolean>) => {
      state.viewerHidden = action.payload;
    },
    setGameActiveStatus: (state, action: PayloadAction<boolean>) => {
      state.gameActiveStatus = action.payload;
    },
    setSavedGames: (state, action: PayloadAction<any>) => {
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
    setSelectOpen: (state, action: PayloadAction<boolean>) => {
      state.selectOpen = action.payload;
    },
    setSelectScrollPosition: (state, action: PayloadAction<number>) => {
      state.selectScrollPosition = action.payload;
    },
  },
});

export const {
  setPlayerDeck,
  setOpponentDeck,
  setSortedButtonsState,
  setViewerHidden,
  setDiscardSortState,
  setOpponentSortState,
  setOpponentTrashSortState,
  setTrashSortState,
  setInPlaySortState,
  setHandSortState,
  setSetAsideSortState,
  setGameActiveStatus,
  setSavedGames,
  setPrimaryFrameTab,
  setPinnedPrimaryFrameTab,
  setBaseOnly,
  setTurnToggleButton,
  setPinnedTurnToggleButton,
  setTopCardsLookAmount,
  setPinnedTopCardsLookAmount,
  setSelectOpen,
  setSelectScrollPosition,
} = contentSlice.actions;
export const selectContent = (state: RootState) => state.content;
export default contentSlice.reducer;
