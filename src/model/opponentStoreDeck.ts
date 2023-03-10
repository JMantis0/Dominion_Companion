export interface OpponentStoreDeck {

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