/**
 * Class for a Deck object used to track a
 * player's Deck state.
 */
export class OpponentDeck {
  gameTitle: string;
  gameTurn: number;
  gameResult: string;
  ratedGame: boolean;
  rating: string;
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

  constructor(
    gameTitle: string,
    ratedGame: boolean,
    rating: string,
    playerName: string,
    playerNick: string,
    kingdom: Array<string>
  ) {
    this.gameTitle = gameTitle;
    this.gameTurn = 0;
    this.gameResult = "Unfinished";
    this.ratedGame = ratedGame;
    this.rating = rating;
    this.playerName = playerName;
    this.kingdom = kingdom;
    this.playerNick = playerNick;
    for (let i = 0; i < 7; i++) {
      if (i < 3) {
        this.entireDeck.push("Estate");
      }
      this.entireDeck.push("Copper");
    }
  }

  setGameTitle(title: string) {
    this.gameTitle = title;
  }
  getGameTitle() {
    return this.gameTitle;
  }

  setGameTurn(turn: number) {
    this.gameTurn = turn;
  }

  getGameTurn() {
    return this.gameTurn;
  }

  setGameResult(result: string) {
    this.gameResult = result;
  }

  getGameResult() {
    return this.gameResult;
  }

  setRatedGame(ratedGame: boolean) {
    this.ratedGame = ratedGame;
  }

  getRatedGame() {
    return this.ratedGame;
  }

  setPlayerName(name: string) {
    this.playerName = name;
  }
  getPlayerName() {
    return this.playerName;
  }
  setPlayerNick(playerNick: string) {
    this.playerNick = playerNick;
  }
  getPlayerNick() {
    return this.playerNick;
  }

  setRating(rating: string) {
    this.rating = rating;
  }

  getRating() {
    return this.rating;
  }

  setCurrentVP(vp: number) {
    this.currentVP = vp;
  }
  getCurrentVP() {
    return this.currentVP;
  }
  setKingdom(kingdom: Array<string>) {
    this.kingdom = kingdom;
  }
  getKingdom() {
    return this.kingdom;
  }
  setTrash(trash: Array<string>) {
    this.trash = trash;
  }
  getTrash() {
    return this.trash;
  }
  setLogArchive(logArchive: Array<string>) {
    this.logArchive = logArchive;
  }
  getLogArchive() {
    return this.logArchive;
  }

  getEntireDeck() {
    return this.entireDeck;
  }

  setEntireDeck(deck: Array<string>) {
    this.entireDeck = deck;
  }

  setDebug(debugOn: boolean) {
    this.debug = debugOn;
  }

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

  update(log: Array<string>) {
    log.forEach((line) => {
      this.treasurePopped = false;
      if (!this.logEntryAppliesToThisDeck(line)) {
        // Inside this if, log entries do not apply to this deck.  They are either
        // info entries, or apply to opponent decks.
        if (this.consecutiveTreasurePlays(line)) {
          //  If playing with no animations, need this to pop off opponent treasure plays.
          this.handleConsecutiveTreasurePlays(line);
        }
      }
      // inside this else, log entries apply to this deck.
      else {
        //Clean up before shuffling if needed.

        if (this.debug) console.group(line);
        let act = "";
        let cards: Array<string> = [];
        let numberOfCards: Array<number> = [];
        //Pop off repeated treasure log entry if needed
        if (this.consecutiveTreasurePlays(line)) {
          numberOfCards = this.handleConsecutiveTreasurePlays(line);
          act = "plays";
          cards = ["Copper", "Silver", "Gold"];
        } else {
          act = this.getActionFromEntry(line);
          [cards, numberOfCards] = this.getCardsAndCountsFromEntry(line);
          //Pop off repeated buy log entry if needed
          if (
            this.consecutiveBuysOfSameCard(act, cards.length, line, cards[0])
          ) {
            numberOfCards[0] = this.handleRepeatBuyGain(line);
          }
        }

        switch (act) {
          case "gains":
            {
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  this.addCardToEntireDeck(cards[i]);
                }
              }
            }
            break;
          case "trashes":
            {
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  this.trash.push(cards[i]);
                  this.removeCardFromEntireDeck(cards[i]);
                }
              }
            }
            break;
          default: {
            null;
          }
        }
      }

      if (line.match("Premoves") === null) this.lastEntryProcessed = line;

      //update the log archive
      if (line !== "Between Turns" && line.substring(0, 8) !== "Premoves") {
        this.logArchive.push(line);
      }
      this.updateVP();
      if (this.checkForTurnLine(line)) this.incrementTurn();
      if (this.debug) console.groupEnd();
    });
  }

  /**
   * Adds one instance of the card to the entireDeck field array.
   * @param card - The The given card.
   */
  addCardToEntireDeck(card: string) {
    if (this.debug) console.log(`pushing ${card} to ${this.playerName}'s deck`);
    this.entireDeck.push(card);
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
      throw new Error(`No ${card} in the deck list`);
    }
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
   * Checks if the card in the most recent logArchive entry
   * was for the purchase of the card in the current line.
   * Purpose: Deck control flow to keep logArchive from having duplicate entries.
   * @param currentCard - The card to check the latest logArchive entry for.
   * @returns - Boolean for whether the latest logArchive entry was for the buy of the card
   * gaines and bought in the current line.
   */
  checkPreviousLineProcessedForCurrentCardBuy = (
    currentCard: string
  ): boolean => {
    let previousLineBoughtCurrentLineCard: boolean;
    if (
      this.logArchive.slice().pop()?.match(` buys a ${currentCard}`) !== null
    ) {
      previousLineBoughtCurrentLineCard = true;
    } else {
      previousLineBoughtCurrentLineCard = false;
    }
    return previousLineBoughtCurrentLineCard;
  };

  checkForTreasurePlayLine(line: string): boolean {
    let treasureLine: boolean;
    treasureLine =
      line.match(" plays ") !== null &&
      line.match(/Coppers?|Silvers?|Golds?/) !== null;
    return treasureLine;
  }

  /**
   * This function is used to deal with the Client-DOM behavior of removing and adding
   * a log line when consecutive treasures are played.  The function looks at the
   * current line and the previously processed line and calculated the difference in the
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
    this.treasurePopped = true;
    if (this.debug) console.info("popping log off", removed);
    return amountsToPlay;
  }

  /**
   ** This function is used to deal with the Client-DOM behavior of removing and adding
   * a log line when the same card is purchased more than once in a row.
   * @param currentLine - The current line.
   * @returns - The number of cards to gain (to avoid over gaining)
   */
  handleRepeatBuyGain(currentLine: string): number {
    let amendedAmount: number;
    const prevLine = this.logArchive.slice().pop();
    const lastSpaceIndex = prevLine?.lastIndexOf(" ");
    const secondLastSpaceIndex = prevLine
      ?.slice(0, lastSpaceIndex)
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

    if (
      currentLine.substring(secondLastIndex + 1, lastIndex).match(/\ban?\b/) !==
      null
    ) {
      currCount = 1;
    } else {
      currCount = parseInt(
        currentLine.substring(secondLastIndex + 1, lastIndex)
      );
    }
    const removed = this.logArchive.pop();
    if (this.debug) console.info(`Popping off ${removed}`);
    amendedAmount = currCount - prevCount;
    return amendedAmount;
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
   * Parses a log entry to get the action from it.
   * @param entry -The log entry.
   * @returns - The action from the entry.
   */
  getActionFromEntry(entry: string): string {
    let act: string = "None";
    const actionArray = ["gains", "trashes"];
    for (let i = 0; i < actionArray.length; i++) {
      const action = actionArray[i];
      if (entry.match(action) !== null) {
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

  incrementTurn() {
    this.gameTurn++;
    if (this.debug) console.log("turn: ", this.gameTurn);
  }

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
}
