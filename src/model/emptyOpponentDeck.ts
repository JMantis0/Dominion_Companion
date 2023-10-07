import { GameResult } from "../utils/.d";

export class EmptyOpponentDeck {
  gameTitle: string = "";
  gameTurn: number = 0;
  gameResult: GameResult = "Unfinished";
  ratedGame: boolean = false;
  rating: string = "";
  entireDeck: Array<string> = [];
  playerName: string = "";
  playerNick: string = "";
  currentVP: number = 3;
  kingdom: Array<string> = [];
  trash: Array<string> = [];
  lastEntryProcessed: string = "";
  logArchive: Array<string> = [];
  treasurePopped: boolean = false;
  debug: boolean = false;
  constructor() {}
}
