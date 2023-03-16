export class EmptyDeck {
  entireDeck: Array<string> = [];
  gamerTurn: number = 0;
  playerName: string = "";
  playerNick: string = "";
  currentVP: number = 3;
  kingdom: Array<string> = [];
  library: Array<string> = [];
  graveyard: Array<string> = [];
  inPlay: Array<string> = [];
  hand: Array<string> = [];
  trash: Array<string> = [];
  lastEntryProcessed: string = "";
  logArchive: Array<string> = [];
  setAside: Array<string> = [];
  waitToShuffle: boolean = false;
  waitToDrawLibraryLook: boolean = false;
  treasurePopped: boolean = false;
  constructor() {}
}
