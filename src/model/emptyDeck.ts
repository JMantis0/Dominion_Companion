import { GameResult } from "../utils";

export class EmptyDeck {
  gameTitle: string = "";
  gameTurn: number = NaN;
  gameResult: GameResult = "Unfinished";
  ratedGame: boolean = false;
  rating: string = "";
  entireDeck: Array<string> = [];
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
  constructor() {}
}
