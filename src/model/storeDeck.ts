export interface StoreDeck {
  entireDeck: Array<string>;
  playerName: string;
  abbrvName: string;
  currentVP: number | string;
  kingdom: Array<string>;
  library: Array<string>;
  graveyard: Array<string>;
  inPlay: Array<string>;
  hand: Array<string>;
  trash: Array<string>;
  lastEntryProcessed: string;
  logArchive: Array<string>;
  DOMLog: Array<string>;
}
