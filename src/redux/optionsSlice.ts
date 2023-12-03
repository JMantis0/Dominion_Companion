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
} from "../utils";

export interface OptionsState {
  playerDeck: StoreDeck;
  opponentDecks: OpponentStoreDeck[];
  sortButtonState: SortButtonState;
  savedGames: SavedGames;
  logHtml: string;
  gameKeys: string[];
  selectedRecord: number;
  modalSwitch: boolean;
  gameDateTitle: string;
}

export const initialState: OptionsState = {
  playerDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
  opponentDecks: [JSON.parse(JSON.stringify(new EmptyOpponentDeck()))],
  sortButtonState: {
    category: "card",
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
    setOpponentDecks: (state, action: PayloadAction<OpponentStoreDeck[]>) => {
      state.opponentDecks = action.payload;
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
    setModalDisplayOnData: (
      state,
      action: PayloadAction<{
        idx: number;
        html: string;
        playerDeck: StoreDeck;
        opponentDecks: OpponentStoreDeck[];
        dateTime: string;
      }>
    ) => {
      state.selectedRecord = action.payload.idx;
      state.logHtml = action.payload.html;
      state.playerDeck = action.payload.playerDeck;
      state.opponentDecks = action.payload.opponentDecks;
      state.gameDateTitle = action.payload.dateTime;
      state.modalSwitch = true;
    },
  },
});

export const {
  setPlayerDeck,
  setOpponentDecks,
  setSavedGames,
  setLogHtml,
  setGameKeys,
  setSelectedRecord,
  setModalSwitch,
  setGameDateTitle,
  setModalDisplayOnData,
} = optionsSlice.actions;
export const selectContent = (state: RootState) => state.options;
export default optionsSlice.reducer;
