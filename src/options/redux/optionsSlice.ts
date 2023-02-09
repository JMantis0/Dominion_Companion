import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Root } from "react-dom/client";
import { Deck } from "../../model/deck";

export interface OptionsState {
  playerDeck: string;
  opponentDeck: string;
}

const initialState: OptionsState = {
  playerDeck: JSON.stringify(new Deck("emptyPlayer", "ep", ["empty Kingdom"])),
  opponentDeck: JSON.stringify(
    new Deck("emptyOpponent", "eo", ["empty Kingdom"])
  ),
};

export const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setPlayerDeck: (state, action: PayloadAction<string>) => {
      console.log("SetPlayer Reducer");
      console.log("currentstate is:", current(state));
      state.playerDeck = action.payload;
    },
    setOpponentDeck: (state, action: PayloadAction<string>) => {
      console.log("SetOpponent Reducer");
      console.log("currentstate is:", current(state));
      state.opponentDeck = action.payload;
    },
  },
});

export const { setPlayerDeck, setOpponentDeck } = optionsSlice.actions;
export const selectOptions = (state: RootState) => state.options;
export default optionsSlice.reducer;
