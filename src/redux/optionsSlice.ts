import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { EmptyDeck } from "../model/emptyDeck";
import { EmptyOpponentDeck } from "../model/emptyOpponentDeck";
import type {
  StoreDeck,
  SortButtonState,
  OpponentStoreDeck,
  SavedGames,
} from "../utils/.d";

interface OptionsState {
  playerDeck: StoreDeck;
  opponentDeck: OpponentStoreDeck;
  sortButtonState: SortButtonState;
  savedGames: SavedGames;
  logHtml: string;
  gameKeys: string[];
  selectedRecord: number;
  modalSwitch: boolean;
  gameDateTitle: string;
}

interface OptionsState {
  playerDeck: StoreDeck;
  opponentDeck: OpponentStoreDeck;
  sortButtonState: SortButtonState;
  savedGames: SavedGames;
  logHtml: string;
  gameKeys: string[];
  selectedRecord: number;
  modalSwitch: boolean;
  gameDateTitle: string;
}

const initialState: OptionsState = {
  playerDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
  opponentDeck: JSON.parse(JSON.stringify(new EmptyOpponentDeck())),
  sortButtonState: {
    category: "owned",
    sort: "ascending",
  },
  savedGames: {},
  logHtml: "",
  gameKeys: [],
  selectedRecord: -1,
  modalSwitch: false,
  gameDateTitle: "",
};

export const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setPlayerDeck: (state, action: PayloadAction<StoreDeck>) => {
      state.playerDeck = action.payload;
    },
    setOpponentDeck: (state, action: PayloadAction<OpponentStoreDeck>) => {
      state.opponentDeck = action.payload;
    },
    setSavedGames: (state, action: PayloadAction<SavedGames>) => {
      console.log("Setting saved games");
      state.savedGames = action.payload;
    },
    setLogHtml: (state, action: PayloadAction<string>) => {
      state.logHtml = action.payload;
    },
    setGameKeys: (state, action: PayloadAction<string[]>) => {
      state.gameKeys = action.payload;
    },
    setSelectedRecord: (state, action: PayloadAction<number>) => {
      state.selectedRecord = action.payload;
    },
    setModalSwitch: (state, action: PayloadAction<boolean>) => {
      state.modalSwitch = action.payload;
    },
    setGameDateTitle: (state, action: PayloadAction<string>) => {
      state.gameDateTitle = action.payload;
    },
  },
});

export const {
  setPlayerDeck,
  setOpponentDeck,
  setSavedGames,
  setLogHtml,
  setGameKeys,
  setSelectedRecord,
  setModalSwitch,
  setGameDateTitle,
} = optionsSlice.actions;
export const selectContent = (state: RootState) => state.options;
export default optionsSlice.reducer;
