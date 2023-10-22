import { GameResult } from "../utils";

export class BaseDeck {
  currentVP: number = 3;
  debug: boolean = true;
  entireDeck: Array<string> = [];
  gameResult: GameResult;
  gameTitle: string;
  gameTurn: number;
  kingdom: Array<string> = [];
  lastEntryProcessed: string = "";
  logArchive: Array<string> = [];
  playerName: string = "";
  playerNick: string = "";
  ratedGame: boolean;
  rating: string;
  trash: Array<string> = [];
  treasurePopped: boolean = false;

  constructor(
    gameTitle: string,
    ratedGame: boolean,
    rating: string,
    playerName: string,
    playerNick: string,
    kingdom: Array<string>
  ) {
    this.kingdom = kingdom;
    this.playerName = playerName;
    this.playerNick = playerNick;
    this.gameResult = "Unfinished";
    this.gameTitle = gameTitle;
    this.gameTurn = 0;
    this.ratedGame = ratedGame;
    this.rating = rating;
    for (let i = 0; i < 7; i++) {
      if (i < 3) {
        this.entireDeck.push("Estate");
      }
      this.entireDeck.push("Copper");
    }
  }

  getCurrentVP(): number {
    return this.currentVP;
  }

  setCurrentVP(vp: number) {
    this.currentVP = vp;
  }

  getDebug(): boolean {
    return this.debug;
  }

  setDebug(debugOn: boolean): void {
    this.debug = debugOn;
  }

  getEntireDeck(): string[] {
    return this.entireDeck;
  }

  setEntireDeck(deck: Array<string>): void {
    this.entireDeck = deck;
  }

  getGameResult(): GameResult {
    return this.gameResult;
  }

  setGameResult(result: GameResult) {
    this.gameResult = result;
  }

  getGameTitle(): string {
    return this.gameTitle;
  }

  setGameTitle(title: string): void {
    this.gameTitle = title;
  }

  getGameTurn(): number {
    return this.gameTurn;
  }

  setGameTurn(turn: number) {
    this.gameTurn = turn;
  }

  getKingdom(): string[] {
    return this.kingdom;
  }

  setKingdom(kingdom: Array<string>): void {
    this.kingdom = kingdom;
  }

  getLastEntryProcessed(): string {
    return this.lastEntryProcessed;
  }

  setLastEntryProcessed(line: string): void {
    this.lastEntryProcessed = line;
  }

  getLogArchive(): string[] {
    return this.logArchive;
  }

  setLogArchive(logArchive: Array<string>): void {
    this.logArchive = logArchive;
  }

  getPlayerName(): string {
    return this.playerName;
  }

  setPlayerName(name: string): void {
    this.playerName = name;
  }

  getPlayerNick(): string {
    return this.playerNick;
  }

  setPlayerNick(playerNick: string): void {
    this.playerNick = playerNick;
  }

  getRatedGame(): boolean {
    return this.ratedGame;
  }

  setRatedGame(ratedGame: boolean): void {
    this.ratedGame = ratedGame;
  }

  getRating(): string {
    return this.rating;
  }

  setRating(rating: string): void {
    this.rating = rating;
  }

  getTrash(): string[] {
    return this.trash;
  }

  setTrash(trash: Array<string>): void {
    this.trash = trash;
  }

  getTreasurePopped(): boolean {
    return this.treasurePopped;
  }

  setTreasurePopped(popped: boolean) {
    this.treasurePopped = popped;
  }

  /**
   * Adds one instance of the card to the entireDeck field array.
   * @param card - The The given card.
   */
  addCardToEntireDeck(card: string) {
    this.setEntireDeck(this.entireDeck.concat(card));
  }

  /**
   * Adds the provided line to the logArchive
   * @param line
   */
  addLogToLogArchive(line: string) {
    this.setLogArchive(this.logArchive.concat(line));
  }

  /**
   * Checks if the card in the current line was gained by buying.
   * Purpose: Deck control flow to keep logArchive accurate.
   * @returns - Boolean for whether the card in the current line.
   * was gained was from a buy.
   */
  checkForBuyAndGain(line: string, card: string): boolean {
    let isBuyAndGain: boolean;
    if (
      line.match(" buys and gains ") !== null &&
      line.match(` ${card.substring(0, card.length - 1)}`) !== null
    ) {
      isBuyAndGain = true;
    } else isBuyAndGain = false;
    return isBuyAndGain;
  }

  /**
   * Checks the given line to see if it is a line that plays a treasure card.
   * @param line
   * @returns
   */
  checkForTreasurePlayLine(line: string): boolean {
    let treasureLine: boolean;
    treasureLine =
      line.match(" plays ") !== null &&
      line.match(/Coppers?|Silvers?|Golds?/) !== null;
    return treasureLine;
  }

  /**
   * Checks whether the current line/log entry is a turn line
   * @param line
   * @returns
   */
  checkForTurnLine(line: string): boolean {
    let turnLine: boolean;
    if (
      line.match(this.playerName) !== null &&
      line.match(/Turn \d* -/) !== null
    )
      turnLine = true;
    else turnLine = false;
    return turnLine;
  }

  /**
   * Checks if the card in the most recent logArchive entry
   * was for the purchase of the card in the current line.
   * Purpose: Deck control flow to keep logArchive from having duplicate entries.
   * @param currentCard - The card to check the latest logArchive entry for.
   * @returns - Boolean for whether the latest logArchive entry was for the buy of the card
   * gaines and bought in the current line.
   */
  checkPreviousLineProcessedForCurrentCardBuy(currentCard: string): boolean {
    let previousLineBoughtCurrentLineCard: boolean;
    if (this.lastEntryProcessed.match(` buys a ${currentCard}`) !== null) {
      previousLineBoughtCurrentLineCard = true;
    } else {
      previousLineBoughtCurrentLineCard = false;
    }
    return previousLineBoughtCurrentLineCard;
  }

  /**
   * Checks if the current entry and the previous entry both bought the same card (consecutive buys of the same card).
   * @param act - The act from the current line
   * @param numberOfCards - The number of different cards on the line
   * @param line - The line itself
   * @param card - the card from the current line
   * @returns -  Boolean for if the current line and previous line both bought the same card (consecutive buys).
   */
  consecutiveBuysOfSameCard(
    act: string,
    numberOfCards: number,
    line: string,
    card: string
  ): boolean {
    let consecutiveBuysOfTheSameCard: boolean = false;
    if (act === "gains" && numberOfCards === 1) {
      const thisLineBuyAndGains = this.checkForBuyAndGain(line, card);
      const lastLineBuyAndGains = this.checkForBuyAndGain(
        this.logArchive[this.logArchive.length - 1],
        card
      );
      if (lastLineBuyAndGains && thisLineBuyAndGains) {
        consecutiveBuysOfTheSameCard = true;
      }
    }
    return consecutiveBuysOfTheSameCard;
  }

  /**
   * Checks to see if the current line is a consecutive treasure play.
   * @param entry - The log entry to be checked.
   * @returns - Boolean for whether the log entry and the last entry are both treasure plays.
   */
  consecutiveTreasurePlays(entry: string): boolean {
    let consecutiveTreasurePlays: boolean;
    consecutiveTreasurePlays =
      this.checkForTreasurePlayLine(this.lastEntryProcessed) &&
      this.checkForTreasurePlayLine(entry);
    return consecutiveTreasurePlays;
  }

  /**
   * Function gets required details from the current line
   * @param line - Current line being processed through the update method.
   * @returns - on object containing the act from the line, an array of cards from the line
   * and a corresponding array of numbers for the amounts of cards from the line.
   */
  getActCardsAndCounts(line: string): {
    act: string;
    cards: string[];
    numberOfCards: number[];
  } {
    let act: string = "";
    let cards: Array<string> = [];
    let number: Array<number> = [];

    if (this.consecutiveTreasurePlays(line)) {
      number = this.handleConsecutiveTreasurePlays(line);
      act = "plays";
      cards = ["Copper", "Silver", "Gold"];
    } else {
      act = this.getActionFromEntry(line);
      [cards, number] = this.getCardsAndCountsFromEntry(line);
      //Pop off repeated buy log entry if needed
      if (this.consecutiveBuysOfSameCard(act, cards.length, line, cards[0])) {
        number[0] = this.handleRepeatBuyGain(line, this.logArchive);
      }
    }

    const lineInfo: {
      act: string;
      cards: string[];
      numberOfCards: number[];
    } = {
      act: act,
      cards: cards,
      numberOfCards: number,
    };
    return lineInfo;
  }

  /**
   * Parses a log entry to get the action from it.
   * @param entry -The log entry.
   * @returns - The action from the entry.
   */
  getActionFromEntry(entry: string): string {
    let act: string = "None";
    const actionArray = [
      "aside with Library",
      "discards",
      "draws",
      "gains",
      "looks at",
      "plays",
      "reveals",
      "shuffles their deck",
      "topdecks",
      "trashes",
    ];
    const entryWithoutNickName = entry.slice(this.playerNick.length);
    for (let i = 0; i < actionArray.length; i++) {
      const action = actionArray[i];
      if (entryWithoutNickName.match(action) !== null) {
        act = action;
        break;
      }
    }
    return act;
  }

  /**
   * Parses the given log entry and creates a card array and a cardAmount array.
   * For each card in the log entry, that card is pushed to the card array and the amount of
   * that card is pushed to the cardAmount array.
   * @param entry - The log entry to get cards and amounts from
   * @returns -The cards array and cardAmounts array.
   */
  getCardsAndCountsFromEntry(entry: string): [string[], number[]] {
    let cards: string[] = [];
    let cardAmounts: number[] = [];
    this.kingdom.forEach((card) => {
      const cardMatcher = card.substring(0, card.length - 1);
      if (entry.match(" " + cardMatcher) !== null) {
        let upperSlice = entry.indexOf(cardMatcher) - 1;
        let lowerSlice = entry.substring(0, upperSlice).lastIndexOf(" ") + 1;
        const amountChar = entry.substring(lowerSlice, upperSlice);
        let amount = 0;
        if (amountChar == "an" || amountChar == "a") {
          amount = 1;
        } else {
          amount = parseInt(amountChar);
        }
        cards.push(card);
        cardAmounts.push(amount);
      }
    });
    return [cards, cardAmounts];
  }

  /**
   * This function is used to deal with the Client-DOM behavior of removing and adding
   * a log line when consecutive treasures are played.  The function looks at the
   * current line and the previously processed line and calculates the difference in the
   * amount of treasures played on each line for each treasure, and returns an array with those
   * counts, to be used by the update method.  It also pops the last log entry off of the logArchive
   * to keep it identical to what appears in the "game-log" innerText.
   * @param line - the current line.
   * @returns - A number array of length 3 representing the number of Copper, Silver, Gold to be played.
   */
  handleConsecutiveTreasurePlays(line: string): Array<number> {
    // Inside this if, this means that the player is in a play treasure phase.
    // The two lines must be compared to see how many additional treasures must be
    // processed
    const prevLine = this.lastEntryProcessed;
    const treasures = ["Copper", "Silver", "Gold"];

    // get the total number of each treasure that was played on the last line
    const numberOfPrevCards: Array<number> = [];
    treasures.forEach((treasure) => {
      if (prevLine.match(treasure)) {
        const upperSlice = prevLine.indexOf(treasure) - 1;
        const lowerSlice = prevLine.slice(0, upperSlice).lastIndexOf(" ") + 1;
        const amountChar = prevLine.substring(lowerSlice, upperSlice);
        let amount = 0;
        if (amountChar === "an" || amountChar === "a") {
          amount = 1;
        } else {
          amount = parseInt(amountChar);
        }
        numberOfPrevCards.push(amount);
      } else {
        numberOfPrevCards.push(0);
      }
    });

    const numberOfCards: Array<number> = [];
    treasures.forEach((treasure) => {
      if (line.match(treasure)) {
        const upperSlice = line.indexOf(treasure) - 1;
        const lowerSlice = line.slice(0, upperSlice).lastIndexOf(" ") + 1;
        const amountChar = line.substring(lowerSlice, upperSlice);
        let amount = 0;
        if (amountChar == "an" || amountChar == "a") {
          amount = 1;
        } else {
          amount = parseInt(amountChar);
        }
        numberOfCards.push(amount);
      } else {
        numberOfCards.push(0);
      }
    });

    let amountsToPlay = [
      numberOfCards[0] - numberOfPrevCards[0],
      numberOfCards[1] - numberOfPrevCards[1],
      numberOfCards[2] - numberOfPrevCards[2],
    ];

    const removed = this.logArchive.pop(); // keep duplicate entries out.
    this.setTreasurePopped(true);
    if (this.debug) console.info("popping log off", removed);
    return amountsToPlay;
  }

  /**
   ** This function is used to deal with the Client-DOM behavior of removing and adding
   * a log line when the same card is purchased more than once in a row.
   * @param currentLine - The current line.
   * @returns - The number of cards to gain (to avoid over gaining)
   */
  handleRepeatBuyGain(currentLine: string, logArchive: string[]): number {
    let amendedAmount: number;
    if (logArchive.length === 0) throw new Error("Empty logArchive.");
    const prevLine = logArchive.slice().pop()!;
    const lastSpaceIndex = prevLine!.lastIndexOf(" ");
    const secondLastSpaceIndex = prevLine
      .slice(0, lastSpaceIndex)
      .lastIndexOf(" ");

    const lastIndex = currentLine.lastIndexOf(" ");
    const secondLastIndex = currentLine.slice(0, lastIndex).lastIndexOf(" ");

    let prevCount: number;
    let currCount: number;
    if (
      prevLine!
        .substring(secondLastSpaceIndex! + 1, lastSpaceIndex)
        .match(/\ban?\b/) !== null
    ) {
      prevCount = 1;
    } else {
      prevCount = parseInt(
        prevLine!.substring(secondLastSpaceIndex! + 1, lastSpaceIndex)
      );
    }
    currCount = parseInt(currentLine.substring(secondLastIndex + 1, lastIndex));
    const removed = logArchive.pop();
    this.setLogArchive(logArchive);
    if (this.debug) console.info(`Popping off ${removed}`);
    amendedAmount = currCount - prevCount;
    return amendedAmount;
  }

  /**
   * Increases the gameTurn field by one.
   */
  incrementTurn() {
    this.gameTurn++;
  }

  /**
   * Checks to see if the current line applies to the current deck.
   * @param entry - A log entry from the game-log.
   * @returns - Boolean for if it applies to this deck.
   */
  logEntryAppliesToThisDeck(entry: string): boolean {
    let applies: boolean;
    applies =
      entry.slice(0, this.playerNick.length) === this.playerNick ||
      entry.match(this.playerName) !== null;
    return applies;
  }

  /**
   * Takes a given logArchive, removes the last entry from it, and sets
   * the result to the logArchive field.  Used to remove duplicate entries
   * from the logArchive
   * @param logArchive - the current logArchive
   */
  popLastLogArchiveEntry(logArchive: string[]) {
    logArchive.pop();
    this.setLogArchive(logArchive);
  }

  /**
   * Checks entireDeck field array to see if card is there.
   *  If yes, removes one instance of that card from the
   *  entireDeck field array.
   * @param card - The The given card..
   */
  removeCardFromEntireDeck(card: string) {
    const index = this.entireDeck.indexOf(card);
    if (index > -1) {
      this.entireDeck.splice(index, 1);
      if (this.debug)
        console.log(`Removing ${card} from ${this.playerName}'s deck`);
    } else {
      throw new Error(`No ${card} in the deck list.`);
    }
  }

  /**
   * Update function.  Refreshes the logArchive, lastEntryProcessed, and
   * gameTurn fields.
   * @param line - The current line being processed
   */
  updateArchives(line: string) {
    if (
      line.match("Between Turns") === null &&
      line.substring(0, 8) !== "Premoves"
    ) {
      //update the log archive
      this.setLastEntryProcessed(line);
      this.addLogToLogArchive(line);
    }
    if (this.checkForTurnLine(line)) this.incrementTurn();
  }

  /**
   * Deck method updates the value of the currentVP field.
   */
  updateVP() {
    this.currentVP = this.entireDeck.reduce((accumulatedVP, currentValue) => {
      switch (currentValue) {
        case "Gardens":
          return Math.floor(this.entireDeck.length / 10) + accumulatedVP;
        case "Estate":
          return 1 + accumulatedVP;
        case "Duchy":
          return 3 + accumulatedVP;
        case "Province":
          return 6 + accumulatedVP;
        case "Curse":
          return accumulatedVP - 1;
        default:
          return 0 + accumulatedVP;
      }
    }, 0);
  }
}