export interface OpponentStoreDeck {
  gameTitle: string;
  gameTurn: number;
  ratedGame: boolean;
  rating: string;
  entireDeck: Array<string>;
  playerName: string;
  playerNick: string;
  currentVP: number;
  kingdom: Array<string>;
  trash: Array<string>;
  lastEntryProcessed: string;
  logArchive: Array<string>;
  treasurePopped: boolean;
}
