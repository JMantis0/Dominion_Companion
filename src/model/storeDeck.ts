export interface StoreDeck {
  gameTitle: string;
  gameTurn: number;
  gameResult: string;
  ratedGame: boolean;
  rating: string;
  entireDeck: Array<string>;
  playerName: string;
  playerNick: string;
  currentVP: number;
  kingdom: Array<string>;
  library: Array<string>;
  graveyard: Array<string>;
  inPlay: Array<string>;
  hand: Array<string>;
  trash: Array<string>;
  lastEntryProcessed: string;
  logArchive: Array<string>;
  setAside: Array<string>;
  waitToShuffle: boolean;
  waitToDrawLibraryLook: boolean;
  treasurePopped: boolean;
}
