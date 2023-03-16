import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { StoreDeck } from "../model/storeDeck";
import { EmptyDeck } from "../model/emptyDeck";
import { EmptyOpponentDeck } from "../model/emptyOpponentDeck";
import { OpponentStoreDeck } from "../model/opponentStoreDeck";

export interface SortButtonState {
  category: "card" | "zone" | "owned" | "probability";
  sort: "ascending" | "descending";
}

export interface ContentState {
  playerDeck: StoreDeck;
  opponentDeck: OpponentStoreDeck;
  sortButtonState: SortButtonState;
  discardSortState: SortButtonState;
  opponentSortState: SortButtonState;
  opponentTrashSortState: SortButtonState;
  trashSortState: SortButtonState;
  viewerHidden: boolean;
  gameActiveStatus: boolean;
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
  viewerHidden: false,
  gameActiveStatus: false,
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
    setViewerHidden: (state, action: PayloadAction<boolean>) => {
      state.viewerHidden = action.payload;
    },
    setGameActiveStatus: (state, action: PayloadAction<boolean>) => {
      state.gameActiveStatus = action.payload;
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
  setGameActiveStatus,
} = contentSlice.actions;
export const selectContent = (state: RootState) => state.content;
export default contentSlice.reducer;
