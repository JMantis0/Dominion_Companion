import { GameResult } from "../utils";
import { getLogScrollContainerLogLines } from "../utils/utils";
import durationList from "../../src/utils/durations";
export class BaseDeck {
  currentVP: number = 3;
  debug: boolean = true;
  entireDeck: Array<string> = [];
  gameResult: GameResult;
  gameTitle: string;
  gameTurn: number;
  kingdom: Array<string> = [];
  lastEntryProcessed: string = "";
  latestAction: string = "None";
  latestPlay: string = "None";
  latestPlaySource: string = "None";
  logArchive: Array<string> = [];
  playerName: string = "";
  playerNick: string = "";
  ratedGame: boolean;
  rating: string;
  trash: Array<string> = [];

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

  getLatestAction(): string {
    return this.latestAction;
  }

  setLatestAction(card: string): void {
    this.latestAction = card;
  }

  getLatestPlay(): string {
    return this.latestPlay;
  }

  setLatestPlay(card: string): void {
    this.latestPlay = card;
  }

  getLatestPlaySource(): string {
    return this.latestPlaySource;
  }

  setLatestPlaySource(card: string): void {
    this.latestPlaySource = card;
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

  /**
   * Adds one instance of the card to the entireDeck field array.
   * @param card - The The given card.
   */
  addCardToEntireDeck(card: string) {
    if (this.debug) console.info(`Gaining ${card} into entireDeck.`);
    const entireDeckCopy = this.entireDeck.slice();
    entireDeckCopy.push(card);
    this.setEntireDeck(entireDeckCopy);
  }

  /**
   * Adds the provided line to the logArchive
   * @param line
   */
  addLogToLogArchive(line: string) {
    const logArchiveCopy = this.logArchive.slice();
    logArchiveCopy.push(line);
    this.setLogArchive(logArchiveCopy);
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
    const treasureLine: boolean =
      line.match(" plays ") !== null &&
      line.match(/Coppers?|Silvers?|Golds?|Platinum|Platina/) !== null;
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
   * Checks the game-log in the client and the logArchive for accuracy,
   * used to identify bugs.
   * @returns - boolean for if the logs are accurately matching.
   */
  checkLogAccuracy(): boolean {
    const gameLog = getLogScrollContainerLogLines();
    const gLogTexts = [];
    for (const el of gameLog) {
      gLogTexts.push(el.innerText);
    }
    const accurate =
      gLogTexts.length === this.logArchive.length ||
      (gLogTexts.length === this.logArchive.length + 1 &&
        gLogTexts.slice().pop() === "Between Turns");
    if (!accurate) {
      console.log("gameLog", gLogTexts);
      console.log("logArchive", this.logArchive);
    }
    return accurate;
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
  consecutiveBuysOfSameCard(act: string, line: string, card: string): boolean {
    let consecutiveBuysOfTheSameCard: boolean = false;
    if (act === "gains") {
      const thisLineBuyAndGains = this.checkForBuyAndGain(line, card);
      const lastLineBuyAndGains = this.checkForBuyAndGain(
        this.lastEntryProcessed,
        card
      );
      if (lastLineBuyAndGains && thisLineBuyAndGains) {
        consecutiveBuysOfTheSameCard = true;
      }
    }
    return consecutiveBuysOfTheSameCard;
  }

  /**
   * Returns boolean for whether the current line and most recent line are consecutive gains
   * without buying.
   * @param line - The given line.
   * @returns - Boolean for whether the current line and most recent line are consecutive gains without buying.
   */
  consecutiveGainWithoutBuy(line: string): boolean {
    const consecutive: boolean =
      this.logEntryAppliesToThisDeck(this.lastEntryProcessed) &&
      this.lastEntryProcessed.match(" gains ") !== null &&
      this.lastEntryProcessed.match(" buys ") === null &&
      this.logEntryAppliesToThisDeck(line) &&
      line.match(" gains ") !== null &&
      line.match(" buys ") === null &&
      !(this.latestAction === "Dismantle" && this.latestPlay === "Dismantle");
    return consecutive;
  }

  /**
   * Checks for consecutive 'into their hand' lines.  Needed to remove
   * duplicate logs from the log archive.
   * @param line - the given line.
   * @returns - Boolean for whether the lines are consecutive into their hand lines.
   */
  consecutiveIntoTheirHandLines(line: string): boolean {
    const consecutive =
      this.lastEntryProcessed.match(" into their hand") !== null &&
      line.match(" into their hand") !== null;
    return consecutive;
  }

  /**
   * Returns a boolean for whether the current line and the most recent
   * logArchive entry are consecutive Sage reveals.
   * @param line - The given line.
   * @returns - Boolean
   */
  consecutiveReveals(line: string): boolean {
    return (
      line.match(" reveals ") !== null &&
      ["Sage", "Farming Village"].includes(this.latestAction) &&
      this.lastEntryProcessed.match(" reveals ") !== null
    );
  }

  /**
   * Checks if the given line and last line processed are both trash lines.
   * Needed to keep the log archive and game log in sync.
   * @param line - The given line.
   * @returns Boolean for wether the lines are consecutive trashes.
   */
  consecutiveTrash(line: string): boolean {
    const consecutiveTrashes =
      line.match(" trashes ") !== null &&
      this.lastEntryProcessed.match(" trashes ") !== null &&
      this.latestAction !== "Treasure Map";
    return consecutiveTrashes;
  }

  /**
   * Checks to see if the current line is a consecutive treasure play.
   * @param entry - The log entry to be checked.
   * @returns - Boolean for whether the log entry and the last entry are both treasure plays.
   */
  consecutiveTreasurePlays(entry: string): boolean {
    const consecutiveTreasurePlays: boolean =
      this.checkForTreasurePlayLine(this.lastEntryProcessed) &&
      this.checkForTreasurePlayLine(entry) &&
      !["Courier", "Fortune Hunter"].includes(this.latestPlaySource); // treasures played by these sources get their own log lines in the client game-log.

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
      number = this.getConsecutiveTreasurePlayCounts(line);
      act = "plays";
      cards = ["Copper", "Silver", "Gold", "Platinum"];
    } else if (this.consecutiveReveals(line)) {
      [cards, number] = this.handleConsecutiveReveals(line);
      act = "reveals";
    } else if (this.consecutiveTrash(line)) {
      act = "trashes";
      [cards, number] = this.handleConsecutiveDuplicates(line);
    } else if (this.consecutiveGainWithoutBuy(line)) {
      act = "gains";
      [cards, number] = this.handleConsecutiveDuplicates(line);
    } else if (this.consecutiveIntoTheirHandLines(line)) {
      act = "into their hand";
      [cards, number] = this.handleConsecutiveDuplicates(line);
    } else {
      act = this.getActionFromLine(line);
      [cards, number] = this.getCardsAndCountsFromLine(line);
      //Pop off repeated buy log entry if needed
      if (this.consecutiveBuysOfSameCard(act, line, cards[0])) {
        number[0] = this.getRepeatBuyGainCounts(line, this.logArchive);
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
   * @param line -The log line.
   * @returns - The action from the line.
   */
  getActionFromLine(line: string): string {
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
      "passes",
      "into their hand",
      "back onto their deck",
      "moves their deck to the discard",
      "starts with",
    ];
    const lineWithoutNickName = line.slice(this.playerNick.length);
    if (line.match(" reveals their hand:") === null)
      for (let i = 0; i < actionArray.length; i++) {
        const action = actionArray[i];
        if (lineWithoutNickName.match(action) !== null) {
          act = action;
          break;
        }
      }
    return act;
  }

  /**
   * Parses the given log line and creates a card array and a cardAmount array.
   * For each card in the log line, that card is pushed to the card array and the amount of
   * that card is pushed to the cardAmount array.
   * @param line - The log line to get cards and amounts from
   * @returns -The cards array and cardAmounts array.
   */
  getCardsAndCountsFromLine(line: string): [string[], number[]] {
    type LineDatum = {
      card: string;
      amount: number;
      startIndex: number;
    };
    const lineData: Array<LineDatum> = [];
    this.kingdom.forEach((card) => {
      // Add case for matching Platinums, which have plural form 'Platina'
      let cardMatcher: string;
      if (card === "Platinum") {
        cardMatcher = "Platin";
      } else cardMatcher = card.substring(0, card.length - 1);
      if (line.match(" " + cardMatcher) !== null) {
        const upperSlice = line.indexOf(cardMatcher) - 1;
        const lowerSlice = line.substring(0, upperSlice).lastIndexOf(" ") + 1;
        const amountChar = line.substring(lowerSlice, upperSlice);
        let amount = 0;
        if (amountChar == "an" || amountChar == "a") {
          amount = 1;
        } else {
          amount = parseInt(amountChar);
        }
        lineData.push({
          card: card,
          amount: amount,
          startIndex: lowerSlice,
        });
      }
    });

    // Arrange the card data in the same order it appears on the line before returning.
    lineData.sort((a, b) => {
      return a.startIndex - b.startIndex;
    });
    const cards: string[] = [];
    const cardAmounts: number[] = [];
    lineData.forEach((datum) => {
      cards.push(datum.card);
      cardAmounts.push(datum.amount);
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
  getConsecutiveTreasurePlayCounts(line: string): Array<number> {
    // Inside this if, this means that the player is in a play treasure phase.
    // The two lines must be compared to see how many additional treasures must be
    // processed
    const prevLine = this.lastEntryProcessed;
    const treasures = ["Copper", "Silver", "Gold", "Platinum"];
    // get the total number of each treasure that was played on the last line
    const numberOfPrevCards: Array<number> = [];
    const treasureMatcher = (treasure: string): string => {
      if (treasure === "Platinum") return "Platin";
      else return treasure;
    };
    treasures.forEach((treasureRaw) => {
      const treasure = treasureMatcher(treasureRaw);
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
    treasures.forEach((treasureRaw) => {
      const treasure = treasureMatcher(treasureRaw);
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

    const amountsToPlay = [
      numberOfCards[0] - numberOfPrevCards[0],
      numberOfCards[1] - numberOfPrevCards[1],
      numberOfCards[2] - numberOfPrevCards[2],
      numberOfCards[3] - numberOfPrevCards[3],
    ];

    this.popLastLogArchiveEntry(this.logArchive);
    return amountsToPlay;
  }

  /**
   ** This function is used to deal with the Client-DOM behavior of removing and adding
   * a log line when the same card is purchased more than once in a row.
   * @param currentLine - The current line.
   * @returns - The number of cards to gain (to avoid over gaining)
   */
  getRepeatBuyGainCounts(currentLine: string, logArchive: string[]): number {
    if (logArchive.length === 0) throw new Error("Empty logArchive.");
    const logArchiveCopy = logArchive.slice();
    const prevLine = this.lastEntryProcessed;
    const lastSpaceIndex = prevLine.lastIndexOf(" ");
    const secondLastSpaceIndex = prevLine
      .slice(0, lastSpaceIndex)
      .lastIndexOf(" ");

    const lastIndex = currentLine.lastIndexOf(" ");
    const secondLastIndex = currentLine.slice(0, lastIndex).lastIndexOf(" ");

    let prevCount: number;
    if (
      prevLine
        .substring(secondLastSpaceIndex! + 1, lastSpaceIndex)
        .match(/\ban?\b/) !== null
    ) {
      prevCount = 1;
    } else {
      prevCount = parseInt(
        prevLine.substring(secondLastSpaceIndex! + 1, lastSpaceIndex)
      );
    }
    const currCount: number = parseInt(
      currentLine.substring(secondLastIndex + 1, lastIndex)
    );
    this.popLastLogArchiveEntry(logArchiveCopy);
    const amendedAmount: number = currCount - prevCount;
    return amendedAmount;
  }

  handleConsecutiveDuplicates(line: string): [string[], number[]] {
    const [currCards, currNumberOfCards] = this.getCardsAndCountsFromLine(line);
    const [prevCards, prevNumberOfCards] = this.getCardsAndCountsFromLine(
      this.lastEntryProcessed
    );
    const map = new Map<string, number>();
    currCards.forEach((card, idx) => {
      map.set(card, currNumberOfCards[idx]);
    });
    prevCards.forEach((card, idx) => {
      map.set(card, map.get(card)! - prevNumberOfCards[idx]);
    });
    const cards: string[] = [];
    const numberOfCards: number[] = [];
    Array.from(map.entries()).forEach((entry) => {
      const card = entry[0];
      const number = entry[1];
      cards.push(card);
      numberOfCards.push(number);
    });

    this.popLastLogArchiveEntry(this.logArchive);

    return [cards, numberOfCards];
  }

  /**
   * Removes duplicate merchant bonus lines from the logArchive.
   */
  handleConsecutiveMerchantBonus() {
    // Set up loop to check 2 elements maximum
    for (let i = 0; i < 2; i++) {
      const lastLogArchiveEntry = this.logArchive[this.logArchive.length - 1];
      // If the element is a Merchant bonus remove it, otherwise break the loop.
      if (lastLogArchiveEntry.match(/gets \+\$\d*\. \(Merchant\)/) !== null) {
        this.popLastLogArchiveEntry(this.logArchive);
      } else {
        break;
      }
    }
  }

  /**
   * Reconciliation function to handle consecutive reveals lines.
   * @param line - The current reveals line.
   * @returns - The correct cards and number of cards to be processed.
   */
  handleConsecutiveReveals(
    line: string,
    reconciling?: "reconcile"
  ): [string[], number[]] {
    // Need to compare the two consecutive lines.  If there is no intervening shuffle and both
    // Lines contain the same card types, the most recent logArchiveEntry must be popped.
    const intercedingShuffle =
      this.logArchive.slice().pop()?.match(" shuffles their deck") !== null;
    const previousRevealsLine = intercedingShuffle
      ? this.logArchive[this.logArchive.length - 2]
      : this.logArchive[this.logArchive.length - 1];
    const [currCards, currNumberOfCards] = this.getCardsAndCountsFromLine(line);
    const [prevCards, prevNumberOfCards] =
      this.getCardsAndCountsFromLine(previousRevealsLine);
    const newCardOnCurrentLine: boolean = currCards.length > prevCards.length;
    const map = new Map<string, number>();
    currCards.forEach((card, idx) => {
      map.set(card, currNumberOfCards[idx]);
    });
    prevCards.forEach((card, idx) => {
      map.set(card, map.get(card)! - prevNumberOfCards[idx]);
    });
    const cards: string[] = [];
    const numberOfCards: number[] = [];
    Array.from(map.entries()).forEach((entry) => {
      const card = entry[0];
      const number = entry[1];
      cards.push(card);
      numberOfCards.push(number);
    });
    if (
      (!intercedingShuffle && !newCardOnCurrentLine) ||
      reconciling === "reconcile"
    ) {
      this.popLastLogArchiveEntry(this.logArchive);
    }

    return [cards, numberOfCards];
  }

  /**
   * Increases the gameTurn field by one.
   */
  incrementTurn() {
    let newGameTurn = this.gameTurn;
    newGameTurn++;
    this.setGameTurn(newGameTurn);
  }

  /**
   * Checks to see if the current line and the previous line are both
   * merchant bonus lines, and the given line is not for exactly $1.
   * @param line - The given line.
   * @returns - Boolean for whether there are consecutive merchant bonuses.
   */
  isConsecutiveMerchantBonus(line: string): boolean {
    let consecutiveMerchantBonus: boolean = false;
    if (line.match(/ gets \+\$1\. \(Merchant\)/) === null) {
      if (
        line.match(/gets \+\$\d*\. \(Merchant\)/) !== null &&
        this.lastEntryProcessed.match(/gets \+\$\d*\. \(Merchant\)/) !== null
      ) {
        consecutiveMerchantBonus = true;
      }
    }
    return consecutiveMerchantBonus;
  }

  /**
   * Checks whether the given plays line plays a duration card.
   * @param playLine - the given line
   * @returns -Boolean for whether the line plays a duration card.
   */
  isDurationPlay(playLine: string): boolean {
    let durationPlay: boolean = false;
    const durationNames = Object.keys(durationList);
    if (playLine.match(" plays ") !== null)
      for (let i = 0; i <= durationNames.length; i++) {
        if (playLine.match(durationNames[i]) !== null) {
          durationPlay = true;
          break;
        }
      }
    return durationPlay;
  }

  /**
   * Checks to see if the current line applies to the current deck.
   * @param entry - A log entry from the game-log.
   * @returns - Boolean for if it applies to this deck.
   */
  logEntryAppliesToThisDeck(entry: string): boolean {
    const applies: boolean =
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
    const archiveCopy = logArchive.slice();
    const removed = archiveCopy.pop();
    if (this.debug) console.log("Removing duplicate entry:", removed);
    this.setLogArchive(archiveCopy);
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
      const entireDeckCopy = this.entireDeck.slice();
      entireDeckCopy.splice(index, 1);
      this.setEntireDeck(entireDeckCopy);
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
    const newCurrentVP = this.entireDeck.reduce(
      (accumulatedVP, currentValue) => {
        switch (currentValue) {
          case "Gardens":
            return Math.floor(this.entireDeck.length / 10) + accumulatedVP;
          case "Estate":
            return 1 + accumulatedVP;
          case "Duchy":
            return 3 + accumulatedVP;
          case "Province":
            return 6 + accumulatedVP;
          case "Colony":
            return 10 + accumulatedVP;
          case "Curse":
            return accumulatedVP - 1;
          default:
            return 0 + accumulatedVP;
        }
      },
      0
    );
    this.setCurrentVP(newCurrentVP);
  }
}
