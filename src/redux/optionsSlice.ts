import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { StoreDeck } from "../model/storeDeck";
import { OpponentStoreDeck } from "../model/opponentStoreDeck";

export interface OptionsState {
  savedGames: any;
  logHtml: string;
}

export interface SavedGame {
  logArchive: string;
  playerDeck: StoreDeck;
  opponentDeck: OpponentStoreDeck;
  dateTime: string;
  logHtml: string;
}

const initialState: OptionsState = {
  savedGames: [],
  logHtml: "",
};

export const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setSavedGames: (state, action: PayloadAction<any>) => {
      console.log("Setting saved games");
      state.savedGames = action.payload;
    },
    setLogHtml: (state, action: PayloadAction<string>) => {
      state.logHtml = action.payload;
    },
  },
});

export const { setSavedGames, setLogHtml } = optionsSlice.actions;
export const selectContent = (state: RootState) => state.options;
export default optionsSlice.reducer;