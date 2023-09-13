import { getLogScrollContainerLogLines } from "../content/components/Observer/observerFunctions";
import { getErrorMessage } from "../content/components/PrimaryFrame/components/componentFunctions";

/**
 * Class for a Deck object used to track a
 * player's Deck state.
 */
export class Deck {
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
  debug: boolean = true;

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
        this.library.push("Estate");
      }
      this.entireDeck.push("Copper");
      this.library.push("Copper");
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
  setLibrary(lib: Array<string>) {
    this.library = lib;
  }
  getLibrary() {
    return this.library;
  }
  setGraveyard(gy: Array<string>) {
    this.graveyard = gy;
  }
  getGraveyard() {
    return this.graveyard;
  }
  setInPlay(inPlay: Array<string>) {
    this.inPlay = inPlay;
  }
  getInPlay() {
    return this.inPlay;
  }
  setHand(hand: Array<string>) {
    this.hand = hand;
  }
  getHand() {
    return this.hand;
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

  getSetAside() {
    return this.setAside;
  }

  setSetAside(setAsideCards: string[]) {
    this.setAside = setAsideCards;
  }

  getDebug() {
    return this.debug;
  }

  setDebug(bool: boolean) {
    this.debug = bool;
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
        if (this.waitToShuffle) {
          if (this.ifCleanUpNeeded(line)) {
            this.cleanup();
          }
          this.shuffleGraveYardIntoLibrary();
          this.waitToShuffle = false;
        }
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
        // For Library activity, draw card from previous line if needed
        if (this.libraryTriggeredPreviousLineDraw(act)) {
          this.drawCardFromPreviousLine();
        }
        if (this.waitToDrawLibraryLook) {
          this.waitToDrawLibraryLook = false;
          if (this.debug) console.log("changing waitToDraw to false");
        }

        switch (act) {
          case "shuffles their deck":
            {
              this.waitToShuffle = true;
            }

            break;
          case "gains":
            {
              const mostRecentPlay = this.getMostRecentPlay(this.logArchive);
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  if (mostRecentPlay === "Bureaucrat") {
                    this.gainIntoDeck(cards[i]);
                  } else if (
                    mostRecentPlay === "Mine" ||
                    mostRecentPlay === "Artisan"
                  ) {
                    this.gainIntoHand(cards[i]);
                  } else {
                    const buyAndGain = this.checkForBuyAndGain(line, cards[i]);
                    if (buyAndGain) {
                      const lastLineBuy =
                        this.checkPreviousLineProcessedForCurrentCardBuy(
                          cards[i]
                        );
                      if (lastLineBuy) {
                        // keep the logArchive from accumulating duplicates.
                        const dupRemoved = this.logArchive.pop();
                        if (this.debug)
                          console.info(
                            "removing a duplicate entry: ",
                            dupRemoved
                          );
                      }
                    }
                    this.gain(cards[i]);
                  }
                  this.addCardToEntireDeck(cards[i]);
                }
              }
            }
            break;
          case "draws":
            {
              const cleanupNeeded = this.checkForCleanUp(line);
              const shuffleOccurred = this.checkForShuffle(
                this.lastEntryProcessed
              );
              const cellarDraws = this.checkForCellarDraw();
              if (cleanupNeeded && !shuffleOccurred && !cellarDraws) {
                this.cleanup();
              }

              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  this.draw(cards[i]);
                }
              }
            }

            break;
          case "discards":
            {
              const mostRecentPlay = this.getMostRecentPlay(this.logArchive);
              const libraryDiscard = this.checkForLibraryDiscard(line);
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  if (libraryDiscard) {
                    this.discardFromSetAside(cards[i]);
                  } else if (
                    ["Sentry", "Vassal", "Bandit"].includes(mostRecentPlay)
                  ) {
                    this.discardFromLibrary(cards[i]);
                  } else {
                    this.discard(cards[i]);
                  }
                }
              }
            }
            break;
          case "plays":
            {
              const throneRoomPlay = line.match(" again.");
              const vassalPlay = this.checkForVassalPlay();
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  if (throneRoomPlay) {
                    //Do Nothing
                  } else if (vassalPlay) {
                    this.playFromDiscard(cards[i]);
                  } else {
                    this.play(cards[i]);
                  }
                }
              }
            }
            break;
          case "trashes":
            {
              const mostRecentPlay = this.getMostRecentPlay(this.logArchive);
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  if (["Sentry", "Bandit"].includes(mostRecentPlay)) {
                    this.trashFromLibrary(cards[i]);
                  } else {
                    this.trashFromHand(cards[i]);
                  }
                  this.removeCardFromEntireDeck(cards[i]);
                }
              }
            }
            break;
          case "topdecks":
            {
              const mostRecentPlay = this.getMostRecentPlay(this.logArchive);
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  if (mostRecentPlay === "Harbinger") {
                    this.topDeckFromGraveyard(cards[i]);
                  } else if (
                    ["Artisan", "Bureaucrat"].includes(mostRecentPlay)
                  ) {
                    this.topDeckCardFromHand(cards[i]);
                  }
                }
              }
            }
            break;
          case "looks at":
            {
              const libraryLook = this.checkForLibraryLook(line);
              if (libraryLook) {
                const cardsToDrawNow: string[] = [
                  "Estate",
                  "Duchy",
                  "Province",
                  "Gardens",
                  "Copper",
                  "Silver",
                  "Gold",
                ];
                if (this.debug) console.log("It's a library look");
                if (cardsToDrawNow.includes(cards[0])) {
                  this.draw(cards[0]);
                } else {
                  if (this.debug) console.log("waitToDraw changing to true;");
                  this.waitToDrawLibraryLook = true;
                }
              }
            }
            break;
          case "aside with Library":
            {
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  this.setAsideWithLibrary(cards[i]);
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
   * Checks library field array to see if card is there.  If yes, removes one
   * instance of that card from the library field array and then adds one
   * instance of that card to hand field array.
   * @param card - The given card.
   */
  draw(card: string) {
    const index = this.library.indexOf(card);
    if (index > -1) {
      if (this.debug) console.info(`Drawing ${card} from library into hand.`);
      this.hand.push(card);
      this.library.splice(index, 1);
    } else {
      throw new Error(`No ${card} in deck`);
    }
  }
  /**
   * Checks hand field array to see if card is there.  If yes, removes one
   * instance of that card from the hand field and then adds one
   * instance of that card to inPlay field
   * @param card - The given card.
   */
  play(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      if (this.debug) console.info(`Playing ${card} from hand into play.`);
      this.inPlay.push(card);
      this.hand.splice(index, 1);
    } else {
      throw new Error(`No ${card} in hand`);
    }
  }

  /**
   * Adds one instance of the card to the entireDeck field array.
   * @param card - The The given card.
   */
  addCardToEntireDeck(card: string) {
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
    } else {
      throw new Error(`No ${card} in the deck list`);
    }
  }

  /**
   * Randomizes the order of the library array field.
   * Might be obsolete.  Shuffling is a superficiality.
   */
  shuffle() {
    if (this.debug) console.info("Shuffling library into a random order.");
    let currentIndex = this.library.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [this.library[currentIndex], this.library[randomIndex]] = [
        this.library[randomIndex],
        this.library[currentIndex],
      ];
    }
  }

  /**
   * Checks graveyard field array to see if card is there.  If yes,
   * removes one instance of the card from the graveyard field array,
   * and adds one instance of the card to the library field array.
   * and adds it to the library.
   * @param card - The given card.
   */
  topDeckFromGraveyard(card: string) {
    const index = this.graveyard.indexOf(card);
    if (index > -1) {
      if (this.debug) console.info(`Top decking ${card} from discard pile.`);
      this.library.push(card);
      this.graveyard.splice(index, 1);
    } else {
      throw new Error(`No ${card} in discard`);
    }
  }

  /**
   * Checks discard field array to see if card is there.  If yes,
   * removes one instance of the card from the graveyard field array,
   * and adds one instance of the card to the inPlay field array.
   * and removes
   * @param card  - The given card.
   */
  playFromDiscard(card: string) {
    const index = this.graveyard.indexOf(card);
    if (index > -1) {
      if (this.debug)
        console.info(`Playing ${card} from discard pile into play.`);
      this.inPlay.push(card);
      this.graveyard.splice(index, 1);
    } else {
      throw new Error(`No ${card} in discard pile`);
    }
  }

  /**
   * Iterates over all cards instances in the graveyard array.  For each iteration,
   * the card instance is added to the library field array and removed from
   * the graveyard field array.
   */
  shuffleGraveYardIntoLibrary() {
    let i = this.graveyard.length - 1;
    for (i; i >= 0; i--) {
      if (this.debug)
        console.info(
          `Shuffling ${this.graveyard[i]} from discard pile into library`
        );
      this.library.push(this.graveyard[i]);
      this.graveyard.splice(i, 1);
    }
    this.shuffle();
  }

  /**
   * Iterates over all the card instances in the hand and inPlay field arrays.
   * For each iteration, the card instance is added to the graveyard array and removed
   * from the hand and/or inPlay arrays and added to the graveyard array.
   */
  cleanup() {
    if (this.debug) console.group("Cleaning up:");
    let i = this.inPlay.length - 1;
    let j = this.hand.length - 1;
    for (i; i >= 0; i--) {
      if (this.debug)
        console.info(
          `Moving ${this.inPlay[i]} from in play into into discard pile.`
        );
      this.graveyard.push(this.inPlay[i]);
      this.inPlay.splice(i, 1);
    }
    for (j; j >= 0; j--) {
      if (this.debug)
        console.info(`Moving ${this.hand[j]} from hand into discard pile.`);
      this.graveyard.push(this.hand[j]);
      this.hand.splice(j, 1);
    }
    if (this.debug) console.groupEnd();
  }

  /**
   * Takes a card and pushes it to the graveyard field array.
   * @param card = The given card.
   */
  gain(card: string) {
    if (this.debug) console.info(`Gaining ${card} into discard pile.`);
    this.graveyard.push(card);
  }

  /**
   * Takes a card and pushes it to the hand field array.
   * @param card - The given card.
   */
  gainIntoHand(card: string) {
    if (this.debug) console.info(`Gaining ${card} into hand.`);
    this.hand.push(card);
  }

  /**
   * Takes a card and pushes it to the library field array.
   * @param card
   */
  gainIntoDeck(card: string) {
    if (this.debug) console.info(`Gaining ${card} into deck.`);
    this.library.push(card);
  }

  /**
   * Checks hand field array to see if card is there.  If yes,
   * removes an instance of that card from hand field array
   * and adds an instance of that card to library field array.
   * @param card -The given card.
   */
  topDeckCardFromHand(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      if (this.debug)
        console.info(`Top decking ${this.hand[index]} from hand.`);
      this.library.push(this.hand[index]);
      this.hand.splice(index, 1);
    } else {
      throw new Error(`No ${card} in hand`);
    }
  }

  /**
   * Checks hand field array to see if card is there.  If yes,
   * removes an instance of that card from the hand field array
   * and adds an instance of that card to the graveyard field array.
   * @param card - The given card.
   */
  discard(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      if (this.debug)
        console.info(
          `Discarding ${this.hand[index]} from hand into discard pile.`
        );
      this.graveyard.push(this.hand[index]);
      this.hand.splice(index, 1);
    } else {
      throw new Error(`No ${card} in hand.`);
    }
  }

  /**
   * Checks library field array to see if card is there.  If yes,
   * removes an instance of that card from the library field array
   * and adds an instance of that card to the graveyard field array.
   * @param card - The given card.
   */
  discardFromLibrary(card: string) {
    const index = this.library.indexOf(card);
    if (index > -1) {
      if (this.debug)
        console.info(
          `Discarding ${this.library[index]} from library into discard pile.`
        );
      this.graveyard.push(this.library[index]);
      this.library.splice(index, 1);
    } else {
      throw new Error(`No ${card} in library.`);
    }
  }

  discardFromSetAside(card: string) {
    const index = this.setAside.indexOf(card);
    if (index > -1) {
      if (this.debug) console.log(`Discarding ${card} from setAside`);
      this.graveyard.push(card);
      this.setAside.splice(index, 1);
    } else {
      throw new Error(`No ${card} in setAside`);
    }
  }

  /**
   * Checks hand field array to see if given card is there.  If yes,
   * removes an instance of that card from the hand field array and,
   * adds an instance of that card to the trash field array.
   * @param card - The given card.
   */
  trashFromHand(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      if (this.debug) console.info(`Trashing ${this.hand[index]} from hand.`);
      this.trash.push(this.hand[index]);
      this.hand.splice(index, 1);
    } else {
      throw new Error(`No ${card} in hand.`);
    }
  }

  /**
   * Checks if the given card is in the library field array. If yes,
   * then removes one instance of the card from the library field array
   * and adds one instance of the card to the trash field array.
   * @param card - The given card.
   */
  trashFromLibrary(card: string) {
    const index = this.library.indexOf(card);
    if (index > -1) {
      if (this.debug)
        console.info(`Trashing ${this.library[index]} from library.`);
      this.trash.push(this.library[index]);
      this.library.splice(index, 1);
    } else {
      throw new Error(`No ${card} in library.`);
    }
  }

  /**
   *
   */
  setAsideWithLibrary(card: string) {
    const index = this.library.indexOf(card);
    if (index > -1) {
      if (this.debug) console.info(`Setting aside a ${card} with Library`);
      this.setAside.push(card);
      this.library.splice(index, 1);
    } else {
      throw new Error(`No ${card} in library.`);
    }
  }

  /**
   * Looks 2 lines back in the logArchive to determine if
   * the current line being read is a gain from a Mine card.
   * Purpose: control flow for deck update.  Gains triggered by Mine
   * need to be gained into hand.
   * @returns - Boolean for whether the gain is from a Mine or not.
   */
  checkForMineGain() {
    // let len = this.logArchive.length;
    // return this.logArchive[len - 2].match(" plays a Mine") !== null;
    return this.getMostRecentPlay(this.logArchive) === "Mine";
  }
  /**
   * Checks the current line to see if there are exactly five draws
   * occurring on the line.
   * Purpose:  Control flow for updating deck.  5 draws are occurring, it
   * may be necessary to a cleanup before drawing.
   * @param line
   * @returns
   */
  checkForCleanUp = (line: string) => {
    let needCleanUp = false;
    let drawCount = 0;
    const lineCopyWithoutNickname = line.slice(this.getPlayerNick().length);
    if (lineCopyWithoutNickname.match(/\ban?\b/g)) {
      drawCount += lineCopyWithoutNickname.match(/\ban?\b/g)!.length;
    }
    (lineCopyWithoutNickname.match(/\d/g) || []).forEach((n) => {
      drawCount += parseInt(n);
    });
    if (drawCount == 5) {
      needCleanUp = true;
    } else if (
      this.entireDeck.length < 5 &&
      drawCount === this.entireDeck.length
    ) {
      needCleanUp = true;
    }
    return needCleanUp;
  };

  /**
   * Checks to see if the current line contains the substring
   * "shuffles their deck".
   * @param line - The line being checked.
   * @returns - Boolean for whether the match is found.
   */
  checkForShuffle = (line: string) => {
    return line.match("shuffles their deck") !== null;
  };

  /**
   * Checks the log archive to see if the entry at the index of 3 less than the
   * archive log length indicates that a cellar was played.  If yes, then the
   * control flow should not trigger a shuffle if the current line has 5 draws.
   * @returns - Boolean for if the current line's draws were from a Cellar.
   */
  checkForCellarDraw = () => {
    let cellarDraws = false;
    const logArchLen = this.logArchive.length;
    if (
      (logArchLen > 2 &&
        this.logArchive[logArchLen - 3].match(" plays a Cellar") !== null) ||
      (logArchLen > 3 &&
        this.logArchive[logArchLen - 1].match(" shuffles their deck") !==
          null &&
        this.logArchive[logArchLen - 4].match(" plays a Cellar") !== null)
    ) {
      cellarDraws = true;
    }
    return cellarDraws;
  };

  /**
   * Checks the logArchive to see if the current line's topdeck was triggered
   * by a Harbinger.
   * @returns Boolean for if the current line's topdeck came from a Harbinger
   */
  checkForHarbingerTopDeck() {
    return this.getMostRecentPlay(this.logArchive) === "Harbinger";
  }

  /**
   * Checks the logArchive to see if the current line's discard activity
   * was triggered by a Sentry.
   * Purpose: Control flow of deck updates: discards triggered by Sentry must
   * be discarded from the library field array.
   * @returns - Boolean for whether the current line's discard was triggered by a Sentry.
   */
  checkForSentryDiscard(): boolean {
    let isSentryDiscard: boolean = false;
    // const len = this.logArchive.length;

    isSentryDiscard = this.getMostRecentPlay(this.logArchive) === "Sentry";

    return isSentryDiscard;
  }

  /**
   * Checks the logArchive to see if the current line's Trash activity
   * was triggered by a Sentry.
   * @returns Boolean for whether the current line's trash was triggered by a Sentry.
   *
   */
  checkForSentryTrash() {
    return this.getMostRecentPlay(this.logArchive) === "Sentry";
  }

  /**
   * Checks to see if the trash activity of the current line was triggered
   * by an opponent's Bandit.  Cards trashed in this way must be removed from
   * the library field array.
   * @returns - Boolean for whether the trash activity was triggered by a Bandit.
   */
  checkForBanditTrash = () => {
    return this.getMostRecentPlay(this.logArchive) === "Bandit";
  };

  /**
   * Checks to see if the current discard activity of the current line
   * was triggered by an opponent's Bandit. Cards discarded this way must
   * be removed from the library field array.
   * @returns - Boolean for whether the discard activity was triggered by a Bandit.
   */
  checkForBanditDiscard = () => {
    return this.getMostRecentPlay(this.logArchive) === "Bandit";
  };

  /**
   * Checks to see if the current line's play activity was
   * triggered by a Vassal.
   * Purpose: To determine which field array to remove card from.
   * @returns - Boolean for whether the current line play activity is triggered by a Vassal.
   */
  checkForVassalPlay() {
    /*
    Log text alone does not provide sufficient context to
    resolve ambiguity for whether a play that takes place immediately after a Vassal play is
    being played from the hand, or if it is being played from discard (triggered by the Vassal).
    To resolve this ambiguity we look to the style property of the log-line elements: padding-left.
    If a play is triggered by a vassal, the value of the padding-left property of the related log-line element 
    is equal to the value of the padding-left property of the previous log-line element.  If the play is not 
    triggered by the Vassal, but is coming from the hand, the padding-left property of the previous line will
    be less than the current line.
    */
    if (this.debug) console.log("Check for vassal play");
    let vassalPlay: boolean = false;
    let vassalPlayInLogs: boolean = false;
    const len = this.logArchive.length;
    if (len > 3) {
      vassalPlayInLogs = this.getMostRecentPlay(this.logArchive) === "Vassal";
    }
    if (vassalPlayInLogs) {
      try {
        let logScrollElement = getLogScrollContainerLogLines();
        if (this.debug)
          console.log("The logScrollElement is: ", logScrollElement);
        if (this.debug)
          console.log(
            "The logScrollElement has length of: ",
            logScrollElement.length
          );

        let logScrollElementInnerText: Array<string> = [];
        for (let i = 0; i < logScrollElement.length; i++) {
          logScrollElementInnerText.push(logScrollElement[i].innerText);
        }

        if (this.debug)
          console.log(
            "The logSCrollElementInnerText is: ",
            logScrollElementInnerText
          );
        if (this.debug)
          console.log(
            "The logScrollElementInnerText has length: ",
            logScrollElementInnerText.length
          );

        if (this.debug) console.log("The logArchive is: ", this.logArchive);
        if (this.debug)
          console.log(
            "The logArchive has a length of : ",
            this.logArchive.length
          );
        let currentLinePaddingNumber: number;
        let currentLinePaddingPercentage: string;
        currentLinePaddingPercentage = logScrollElement[len].style.paddingLeft;
        if (
          currentLinePaddingPercentage[
            currentLinePaddingPercentage.length - 1
          ] === "%"
        ) {
          currentLinePaddingNumber = parseFloat(
            currentLinePaddingPercentage.slice(
              0,
              currentLinePaddingPercentage.length - 1
            )
          );
        } else
          throw new Error(
            "Current line PaddingLeft property does not end with %"
          );
        let previousLinePaddingNumber: number;
        let previousLinePaddingPercentage: string;
        previousLinePaddingPercentage =
          logScrollElement[len - 1].style.paddingLeft;
        if (previousLinePaddingPercentage.slice(-1) === "%") {
          previousLinePaddingNumber = parseFloat(
            previousLinePaddingPercentage.slice(
              0,
              previousLinePaddingPercentage.length - 1
            )
          );
        } else
          throw new Error(
            "Previous line paddingLeft property does not end with %"
          );
        if (this.debug) console.log("Length is : ", len);
        if (this.debug)
          console.log(
            `Padding for line current line ${logScrollElement[len].innerText}`,
            currentLinePaddingNumber
          );
        if (this.debug)
          console.log(
            `Padding for line previous line ${
              logScrollElement[len - 1].innerText
            }`,
            previousLinePaddingNumber
          );
        if (currentLinePaddingNumber < previousLinePaddingNumber) {
          vassalPlay = false;
        } else if (currentLinePaddingNumber >= previousLinePaddingNumber) {
          vassalPlay = true;
        }
      } catch (e) {
        if (this.debug)
          console.group("There was an error: ", getErrorMessage(e));
        if (this.debug) console.log(this.logArchive);
        if (this.debug) console.groupEnd();
      }
    }
    return vassalPlay;
  }

  /**
   * Checks to see if the current line's discard activity was
   * triggered by a Vassal.
   * Purpose: To determine which field array to discard card from.
   * @returns - Boolean for whether the current line discard activity is triggered by a Vassal.
   */
  checkForVassalDiscard() {
    return this.getMostRecentPlay(this.logArchive) === "Vassal";
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

  /**
   * Checks the logArchive to determine if the current line gain activity
   * was triggered by an Artisan.
   * @returns Boolean for whether the current line gain activity
   * was triggered by an Artisan
   */
  checkForArtisanGain = (): boolean => {
    return this.getMostRecentPlay(this.logArchive) === "Artisan";
  };

  /**
   * Checks the logArchive to determine if the current line top deck activity
   * was triggered by an Artisan.
   * @returns Boolean for whether the current line top deck activity.
   */
  checkForArtisanTopDeck = (): boolean => {
    return this.getMostRecentPlay(this.logArchive) === "Artisan";
  };

  /**
   * Checks the logArchive to determine whether the look at activity was triggered
   * by a Library.
   * @param currentLine - The current look at line
   * @returns The boolean for whether the current look at activity was triggered by a Library
   */
  checkForLibraryLook = (currentLine: string): boolean => {
    let libraryLook: boolean = false;
    if (currentLine.match(" looks at ") !== null) {
      if (this.getMostRecentPlay(this.logArchive) === "Library") {
        libraryLook = true;
      }
    } else {
      libraryLook = false;
      // throw new Error("Current line is not a looks at line.");
    }
    return libraryLook;
  };

  /**
   * Checks the logArchive to determine whether the discard activity was triggered
   * by a Library.
   * @param currentLine - The current discard line
   * @returns The boolean for whether the current discard activity was triggered by a Library
   */
  checkForLibraryDiscard(currentLine: string): boolean {
    let libraryDiscard: boolean = false;
    if (currentLine.match(" discards ") !== null) {
      if (this.getMostRecentPlay(this.logArchive) === "Library")
        libraryDiscard = true;
    } else {
      libraryDiscard = false;
      throw new Error("Current line is not a discard line.");
    }
    return libraryDiscard;
  }
  /**
   * Checks to see if the current line gain activity was triggered by a Bureaucrat.
   * Purpose: Control flow for Deck state updates: such gains must be pushed to the library field array.
   * @returns Boolean for whether the current line's gain activity was from a Bureaucrat
   */
  checkForBureaucratGain(): boolean {
    return this.getMostRecentPlay(this.logArchive) === "Bureaucrat";
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

  checkForBureaucratTopDeck() {
    return this.getMostRecentPlay(this.logArchive) === "Bureaucrat";
  }

  /**
   * Function looks at the logArchive, starting with the last entry, and looks at each entry
   * until it finds a play, and returns the card in that entry that was played.
   * entry
   * @param logArchive
   * @returns
   */
  getMostRecentPlay(logArchive: string[]): string {
    let mostRecentCardPlayed: string = "None";
    const len = logArchive.length;
    if (len === 0) throw new Error("Empty log archive");
    let playFound: boolean = false;

    for (let i = len - 1; i >= 0; i--) {
      if (logArchive[i].match(/ plays an? /) !== null) {
        playFound = true;
        let lowerIndex: number;
        if (logArchive[i].match(" plays a ")) {
          lowerIndex = logArchive[i].indexOf(" plays a ") + " plays a ".length;
        } else {
          lowerIndex =
            logArchive[i].indexOf(" plays an ") + " plays an ".length;
        }

        // the line might end with the card, or it might end with " again."

        if (logArchive[i].match(" again.")) {
          mostRecentCardPlayed = logArchive[i].slice(
            lowerIndex,
            logArchive[i].lastIndexOf(" ")
          );
        } else {
          mostRecentCardPlayed = logArchive[i].slice(
            lowerIndex,
            logArchive[i].length - 1
          );
        }
      }
      if (playFound || logArchive[i].match("Turn ")) break;
    }
    if (!playFound) {
      playFound = false;
    }

    return mostRecentCardPlayed;
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
   * Checks to see if the previous enrty was a library look that needs to be drawn.
   * @param act - The act from the current entry.
   * @returns Boolean for whether the card on the previous line needs to be drawn.
   */
  libraryTriggeredPreviousLineDraw(act: string): boolean {
    let needToDrawCardLookedAtFromPreviousLine: boolean = false;

    if (this.logArchive.length >= 1) {
      const len = this.logArchive.length;
      const prevLineLibraryLook = this.checkForLibraryLook(
        this.logArchive[len - 1]
      );
      needToDrawCardLookedAtFromPreviousLine =
        prevLineLibraryLook &&
        this.waitToDrawLibraryLook &&
        act !== "aside with Library" &&
        !this.treasurePopped; //here we check to see if a treasure log entry was popped off for this line.  If so, the draw from the library look already occurred and this prevents it from drawing again.
    }

    return needToDrawCardLookedAtFromPreviousLine;
  }

  /**
   * Draws the card from the previous line.
   */
  drawCardFromPreviousLine(): void {
    const prevLine = this.logArchive.slice().pop()!;
    let prevLineCard: string = "EmptyCard";
    for (let i = 0; i < this.kingdom.length; i++) {
      const card = this.kingdom[i];
      if (prevLine.match(card) !== null) {
        prevLineCard = card;
        break;
      }
    }
    if (prevLineCard === "EmptyCard")
      throw new Error("No card found in previous entry");
    this.draw(prevLineCard);
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
   * Checks if a cleanUp is needed.
   * @param entry - A log entry to be checked.
   */
  ifCleanUpNeeded(entry: string): boolean {
    const cleanUp = this.checkForCleanUp(entry);
    const cellarDraws = this.checkForCellarDraw();
    return cleanUp && !cellarDraws;
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
    const actionArray = [
      "shuffles their deck",
      "gains",
      "draws",
      "discards",
      "plays",
      "trashes",
      "looks at",
      "topdecks",
      "aside with Library",
    ];
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
