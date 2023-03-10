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
}

const initialState: ContentState = {
  playerDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
  opponentDeck: JSON.parse(JSON.stringify(new EmptyOpponentDeck())),
  sortButtonState: {
    category: "probability",
    sort: "ascending",
  },
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
      console.log("SortButtonState reducer");
    },
  },
});

export const { setPlayerDeck, setOpponentDeck, setSortedButtonsState } =
  contentSlice.actions;
export const selectContent = (state: RootState) => state.content;
export default contentSlice.reducer;
