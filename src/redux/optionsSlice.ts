import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { StoreDeck } from "../model/storeDeck";
import { OpponentStoreDeck } from "../model/opponentStoreDeck";

export interface OptionsState {
  savedGames: any;
}

export interface SavedGame {
  logArchive: string;
  playerDeck: StoreDeck;
  opponentDeck: OpponentStoreDeck;
  dateTime: string;
}

const initialState: OptionsState = {
  savedGames: [],
};

export const contentSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setSavedGames: (state, action: PayloadAction<any>) => {
      console.log("Setting saved games");
      state.savedGames = action.payload;
    },
  },
});

export const { setSavedGames } = contentSlice.actions;
export const selectContent = (state: RootState) => state.options;
export default contentSlice.reducer;
