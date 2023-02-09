import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { StoreDeck } from "../../model/storeDeck";
import { Deck } from "../../model/deck";

export interface OptionsState {
  playerDeck: StoreDeck;
  opponentDeck: StoreDeck;
}

const initialState: OptionsState = {
  playerDeck: JSON.parse(
    JSON.stringify(new Deck("emptyPlayer", "ep", ["empty Kingdom"]))
  ),
  opponentDeck: JSON.parse(
    JSON.stringify(new Deck("emptyOpponent", "eo", ["empty Kingdom"]))
  ),
};

export const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setPlayerDeck: (state, action: PayloadAction<StoreDeck>) => {
      state.playerDeck = action.payload;
    },
    setOpponentDeck: (state, action: PayloadAction<StoreDeck>) => {
      state.opponentDeck = action.payload;
    },
  },
});

export const { setPlayerDeck, setOpponentDeck } = optionsSlice.actions;
export const selectOptions = (state: RootState) => state.options;
export default optionsSlice.reducer;
