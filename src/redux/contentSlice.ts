import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { StoreDeck } from "../model/storeDeck";
import { EmptyDeck } from "../model/emptyDeck";

export interface ContentState {
  playerDeck: StoreDeck;
  opponentDeck: StoreDeck;
}

const initialState: ContentState = {
  playerDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
  opponentDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setPlayerDeck: (state, action: PayloadAction<StoreDeck>) => {
      console.log("Reducer setting playerDeck state");
      console.log("playerDeckState Before: ", state.playerDeck);
      state.playerDeck = action.payload;
      console.log("playerDeckState After: ", state.playerDeck);
    },
    setOpponentDeck: (state, action: PayloadAction<StoreDeck>) => {
      console.log("Reducer setting opponentDeck state");
      console.log("opponentDeckState: Before", state.opponentDeck);
      state.opponentDeck = action.payload;
      console.log("opponentDeckState: After", state.opponentDeck);
    },
  },
});

export const { setPlayerDeck, setOpponentDeck } = contentSlice.actions;
export const selectContent = (state: RootState) => state.content;
export default contentSlice.reducer;
