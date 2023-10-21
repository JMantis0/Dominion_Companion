import { getLogScrollContainerLogLines } from "../utils/utils";
import type { StoreDeck } from "../utils";
import { BaseDeck } from "./baseDeck";

/**
 * Class for a Deck object used to track a
 * player's Deck state.
 */
export class Deck extends BaseDeck implements StoreDeck {
  graveyard: Array<string> = [];
  hand: Array<string> = [];
  inPlay: Array<string> = [];
  library: Array<string> = [];
  setAside: Array<string> = [];
  waitToDrawLibraryLook: boolean = false;
  waitToShuffle: boolean = false;

  constructor(
    gameTitle: string,
    ratedGame: boolean,
    rating: string,
    playerName: string,
    playerNick: string,
    kingdom: Array<string>
  ) {
    super(gameTitle, ratedGame, rating, playerName, playerNick, kingdom);
    for (let i = 0; i < 7; i++) {
      if (i < 3) {
        this.library.push("Estate");
      }
      this.library.push("Copper");
    }
  }

  getGraveyard() {
    return this.graveyard;
  }

  setGraveyard(gy: Array<string>) {
    this.graveyard = gy;
  }

  getHand() {
    return this.hand;
  }

  setHand(hand: Array<string>) {
    this.hand = hand;
  }

  getInPlay() {
    return this.inPlay;
  }

  setInPlay(inPlay: Array<string>) {
    this.inPlay = inPlay;
  }

  getLibrary() {
    return this.library;
  }

  setLibrary(lib: Array<string>) {
    this.library = lib;
  }

  getSetAside() {
    return this.setAside;
  }

  setSetAside(setAsideCards: string[]) {
    this.setAside = setAsideCards;
  }

  getWaitToDrawLibraryLook() {
    return this.waitToDrawLibraryLook;
  }

  setWaitToDrawLibraryLook(wait: boolean) {
    this.waitToDrawLibraryLook = wait;
  }

  getWaitToShuffle() {
    return this.waitToShuffle;
  }

  setWaitToShuffle(wait: boolean) {
    this.waitToShuffle = wait;
  }

  /**
   * Checks the log archive to see if the entry at the index of 3 less than the
   * archive log length indicates that a cellar was played.  If yes, then the
   * control flow should not trigger a shuffle if the current line has 5 draws.
   * @returns - Boolean for if the current line's draws were from a Cellar.
   */
  checkForCellarDraw() {
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
  }

  /**
   * Checks the current line to see if there are exactly five draws
   * occurring on the line.
   * Purpose:  Control flow for updating deck.  5 draws are occurring, it
   * may be necessary to a cleanup before drawing.
   * @param line
   * @returns
   */
  checkForCleanUp(line: string) {
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
  }

  /**
   * Checks the logArchive to determine whether the look at activity was triggered
   * by a Library.
   * @param currentLine - The current look at line
   * @returns The boolean for whether the current look at activity was triggered by a Library
   */
  checkForLibraryLook(currentLine: string): boolean {
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
  }

  /**
   * Checks to see if the lastEntryProcessed contains the substring
   * "shuffles their deck".
   * @returns - Boolean for whether the match is found.
   */
  checkForShuffle() {
    return this.lastEntryProcessed.match(" shuffles their deck") !== null;
  }

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
      // try {
      let logScrollElement = getLogScrollContainerLogLines();
      if (this.debug) {
        console.log("The logScrollElement is: ", logScrollElement);
        console.log(
          "The logScrollElement has length of: ",
          logScrollElement.length
        );
        let logScrollElementInnerText: Array<string> = [];
        for (let i = 0; i < logScrollElement.length; i++) {
          logScrollElementInnerText.push(logScrollElement[i].innerHTML);
        }
        console.log(
          "The logSCrollElementInnerText is: ",
          logScrollElementInnerText
        );
        console.log(
          "The logScrollElementInnerText has length: ",
          logScrollElementInnerText.length
        );
        console.log("The logArchive is: ", this.logArchive);
        console.log(
          "The logArchive has a length of : ",
          this.logArchive.length
        );
      }
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
          "Current line paddingLeft property does not end with %."
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
          "Previous line paddingLeft property does not end with %."
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
    }
    return vassalPlay;
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

  /**
   * Moves the provided card from the setAside zone to the graveyard.
   * @param card - The provided card.
   */
  discardFromSetAside(card: string) {
    const index = this.setAside.indexOf(card);
    if (index > -1) {
      if (this.debug) console.log(`Discarding ${card} from setAside`);
      this.graveyard.push(card);
      this.setAside.splice(index, 1);
    } else {
      throw new Error(`No ${card} in setAside.`);
    }
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
      throw new Error(`No ${card} in library.`);
    }
  }

  /**
   * Draws the card from the previous line.  Used to
   * handle Library looks that lack sufficient context to
   * handle immediately.
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
      throw new Error("No card found in the most recent logArchive entry.");
    this.draw(prevLineCard);
  }

  /**
   * Update function.  Checks to see if the a card needs to be drawn from
   * any Library activity that took place on the previous logArchive line.
   * @param act
   */
  drawLookedAtCardIfNeeded(act: string) {
    if (this.libraryTriggeredPreviousLineDraw(act)) {
      this.drawCardFromPreviousLine();
    }
    this.setWaitToDrawLibraryLook(false);
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
   * Takes a card and pushes it to the library field array.
   * @param card
   */
  gainIntoDeck(card: string) {
    if (this.debug) console.info(`Gaining ${card} into deck.`);
    this.library.push(card);
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
   * Function looks at the logArchive, starting with the last entry, and looks at each entry
   * until it finds a play, and returns the card in that entry that was played.
   * entry
   * @param logArchive
   * @returns
   */
  getMostRecentPlay(logArchive: string[]): string {
    let mostRecentCardPlayed: string = "None";
    const len = logArchive.length;
    if (len === 0) throw new Error("Empty logArchive.");
    let playFound: boolean = false;

    for (let i = len - 1; i >= 0; i--) {
      if (
        logArchive[i].match(/ plays an? /) !== null &&
        !this.checkForTreasurePlayLine(logArchive[i])
      ) {
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
   * Checks if a cleanUp is needed.
   * @param entry - A log entry to be checked.
   */
  ifCleanUpNeeded(entry: string): boolean {
    const cleanUp = this.checkForCleanUp(entry);
    const cellarDraws = this.checkForCellarDraw();
    return cleanUp && !cellarDraws;
  }

  /**
   * Checks to see if the previous entry was a library look that needs to be drawn.
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
        act !== "aside with Library";
    }

    return needToDrawCardLookedAtFromPreviousLine;
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
      throw new Error(`No ${card} in hand.`);
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
      throw new Error(`No ${card} in discard pile.`);
    }
  }

  /**
   * Update function.  Calls the appropriate process line function to update
   * the deck state.
   * @param line - The current line being processed.
   * @param act - The act from the current line. ie: draws, discards
   * @param cards - The array of cards collected from the line.
   * @param numberOfCards - The array of card amounts collected from the line
   */
  processDeckChanges(
    line: string,
    act: string,
    cards: string[],
    numberOfCards: number[]
  ) {
    switch (act) {
      case "shuffles their deck":
        this.setWaitToShuffle(true);
        break;
      case "gains":
        this.processGainsLine(line, cards, numberOfCards);
        break;
      case "draws":
        this.processDrawsLine(line, cards, numberOfCards);
        break;
      case "discards":
        this.processDiscardsLine(cards, numberOfCards);
        break;
      case "plays":
        this.processPlaysLine(line, cards, numberOfCards);
        break;
      case "trashes":
        this.processTrashesLine(cards, numberOfCards);
        break;
      case "topdecks":
        this.processTopDecksLine(cards, numberOfCards);
        break;
      case "looks at":
        this.processLooksAtLine(line, cards, numberOfCards);
        break;
      case "aside with Library": {
        for (let i = 0; i < cards.length; i++) {
          for (let j = 0; j < numberOfCards[i]; j++) {
            this.setAsideWithLibrary(cards[i]);
          }
        }
      }
    }
  }

  /**
   * Update function.  Discards cards according to the provided information.
   * @param line - The current line being processed.
   * @param cards - Array of card names to be discarded.
   * @param numberOfCards - Array of the amounts of each card to discard.
   */
  processDiscardsLine(
    // line: string,
    cards: string[],
    numberOfCards: number[]
  ) {
    const mostRecentPlay: string = this.getMostRecentPlay(this.logArchive);
    const libraryDiscard: boolean = mostRecentPlay === "Library";
    // const libraryDiscard = this.checkForLibraryDiscard(line);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (libraryDiscard) {
          this.discardFromSetAside(cards[i]);
        } else if (["Sentry", "Vassal", "Bandit"].includes(mostRecentPlay)) {
          this.discardFromLibrary(cards[i]);
        } else {
          this.discard(cards[i]);
        }
      }
    }
  }

  /**
   * Update function.  Draws cards according to the provided information.  Will
   * perform cleanup before drawing cards when necessary.
   * @param line - The current line being processed.
   * @param cards - Array of card names to be drawn.
   * @param numberOfCards - Array of the amounts of each card to draw.
   */
  processDrawsLine(line: string, cards: string[], numberOfCards: number[]) {
    // This first section collects 3 booleans which serve
    // as sufficient context to determine whether or not
    // to perform a cleanup before drawing any cards.
    // This check happens at the end of every turn,
    // when a player draws Their new hand.
    const cleanupNeeded = this.checkForCleanUp(line);
    const shuffleOccurred = this.checkForShuffle();
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

  /**
   * Update function.  Gains cards according to the provided information.
   * @param line - The current line being processed.
   * @param cards - Array of card names to be gained.
   * @param numberOfCards - Array of the amounts of each card to gain.
   */
  processGainsLine(line: string, cards: string[], numberOfCards: number[]) {
    const mostRecentPlay = this.getMostRecentPlay(this.logArchive);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (mostRecentPlay === "Bureaucrat") {
          this.gainIntoDeck(cards[i]);
        } else if (mostRecentPlay === "Mine" || mostRecentPlay === "Artisan") {
          this.gainIntoHand(cards[i]);
        } else {
          const buyAndGain = this.checkForBuyAndGain(line, cards[i]);
          if (buyAndGain) {
            const lastLineBuy =
              this.checkPreviousLineProcessedForCurrentCardBuy(cards[i]);
            if (lastLineBuy) {
              // keep the logArchive from accumulating duplicates.
              this.popLastLogArchiveEntry(this.logArchive);
            }
          }
          this.gain(cards[i]);
        }
        this.addCardToEntireDeck(cards[i]);
      }
    }
  }

  /**
   * Update function.  Specific to Library card.  Draws cards that are
   * moved to hand by Library, or sets waitToDrawLibraryLook to true if
   * more context is needed before deciding to draw.
   * @param line - The current line being processed by the update function.
   * @param cards - The card being looked at.
   */
  processLooksAtLine(line: string, cards: string[], numberOfCards: number[]) {
    const sentryLook = this.getMostRecentPlay(this.logArchive) === "Sentry";
    const libraryLook = this.checkForLibraryLook(line);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
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
          if (cardsToDrawNow.includes(cards[i])) {
            this.draw(cards[i]);
          } else {
            if (this.debug) console.log("waitToDraw changing to true;");
            this.setWaitToDrawLibraryLook(true);
          }
        } else if (sentryLook) {
          this.setAsideWithLibrary(cards[i]);
        }
      }
    }
  }

  /**
   * Update function.  Plays cards according to the provided information
   * @param line - The current line being processed.
   * @param cards - Array of card names to be played.
   * @param numberOfCards - Array of the amounts of each card to play.
   */
  processPlaysLine(line: string, cards: string[], numberOfCards: number[]) {
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

  /**
   * Update function.  Topdecks cards according to the provided information.
   * @param cards  - Array of card names to topdeck.
   * @param numberOfCards - Array of the amounts of each card to topdeck.
   */
  processTopDecksLine(cards: string[], numberOfCards: number[]) {
    const mostRecentPlay = this.getMostRecentPlay(this.logArchive);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (mostRecentPlay === "Sentry") {
          this.topDeckFromSetAside(cards[i]);
        } else if (mostRecentPlay === "Harbinger") {
          this.topDeckFromGraveyard(cards[i]);
        } else if (["Artisan", "Bureaucrat"].includes(mostRecentPlay)) {
          this.topDeckFromHand(cards[i]);
        }
      }
    }
  }

  /**
   * Update function. Trashes cards according the provided information.
   * @param cards - Array of the cards names to trash.
   * @param numberOfCards - Array of the amount of each card to trash.
   */
  processTrashesLine(cards: string[], numberOfCards: number[]) {
    const mostRecentPlay = this.getMostRecentPlay(this.logArchive);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (mostRecentPlay === "Bandit") {
          this.trashFromLibrary(cards[i]);
        } else if (mostRecentPlay === "Sentry") {
          this.trashFromSetAside(cards[i]);
        } else {
          this.trashFromHand(cards[i]);
        }
      }
    }
  }

  /**
   *  Removes the given card from the library and pushes it to the setAside zone.
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
      throw new Error(`No ${card} in discard pile.`);
    }
  }

  /**
   * Checks hand field array to see if card is there.  If yes,
   * removes an instance of that card from hand field array
   * and adds an instance of that card to library field array.
   * @param card -The given card.
   */
  topDeckFromHand(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      if (this.debug)
        console.info(`Top decking ${this.hand[index]} from hand.`);
      this.library.push(this.hand[index]);
      this.hand.splice(index, 1);
    } else {
      throw new Error(`No ${card} in hand.`);
    }
  }

  /**
   * Checks if the given card is in the setAside zone.  Then it
   * removes one instance of that card from the setAside zone
   * and adds it to the library zone.
   * @param card - The given card.
   */
  topDeckFromSetAside(card: string): void {
    const index = this.setAside.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in setAside.`);
    } else {
      // Remove card from setAside.
      const newSetAside = this.setAside.slice();
      newSetAside.splice(index, 1);
      this.setSetAside(newSetAside);
      // Add card to library.
      this.setLibrary(this.library.concat(card));
    }
  }

  /**
   * Checks hand field array to see if given card is there.  If yes,
   * removes an instance of that card from the hand field array and,
   * adds an instance of that card to the trash field array.
   * @param card - The given card.
   */
  trashFromHand(card: string): void {
    const index = this.hand.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in hand.`);
    } else {
      if (this.debug) console.info(`Trashing ${this.hand[index]} from hand.`);
      // Remove card from entireDeck
      this.removeCardFromEntireDeck(card);
      // Add card to trash
      this.setTrash(this.trash.concat(card));
      // Remove card from hand
      const newHand = this.hand.slice();
      newHand.splice(index, 1);
      this.setHand(newHand);
    }
  }

  /**
   * Checks if the given card is in the setAside zone.  If so
   * removes one instance of the card from the entireDeck and one from
   * setAside. Then it  adds it one instance to the trash zone.
   * @param card - The given card.
   */
  trashFromSetAside(card: string): void {
    const index = this.setAside.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in setAside.`);
    } else {
      if (this.debug)
        console.info(`Trashing ${this.hand[index]} from setAside.`);
      // Remove from entireDeck
      this.removeCardFromEntireDeck(card);
      // Add card to trash
      this.setTrash(this.trash.concat(card));
      // Remove card from setAside
      const newSetAside = this.setAside.slice();
      newSetAside.splice(index, 1);
      this.setSetAside(newSetAside);
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
    if (index < 0) {
      throw new Error(`No ${card} in library.`);
    } else {
      if (this.debug)
        console.info(`Trashing ${this.library[index]} from library.`);
      // Remove card from entireDeck
      this.removeCardFromEntireDeck(card);
      // Add card to trash
      this.setTrash(this.trash.concat(card));
      // Remove card from library
      const newLibrary = this.library.slice();
      newLibrary.splice(index, 1);
      this.setLibrary(newLibrary);
    }
  }

  shuffleAndCleanUpIfNeeded(line: string) {
    if (this.waitToShuffle) {
      if (this.ifCleanUpNeeded(line)) {
        this.cleanup();
      }
      this.shuffleGraveYardIntoLibrary();
      this.setWaitToShuffle(false);
    }
  }

  /**
   * Updates the deck state based on log entries from the client game log.
   * @param log - An array of log lines from the DOM Clients
   */
  update(log: Array<string>) {
    log.forEach((line) => {
      this.setTreasurePopped(false);
      if (!this.logEntryAppliesToThisDeck(line)) {
        // Inside this if, log entries apply to an opponent deck.
        if (this.consecutiveTreasurePlays(line)) {
          //  When playing with no animations this will remove duplicate treasure play logs from the logArchive.
          this.handleConsecutiveTreasurePlays(line);
        }
      }
      // Inside this else, log entries apply to this deck.
      else {
        this.shuffleAndCleanUpIfNeeded(line);
        if (this.debug) console.group(line);
        const { act, cards, numberOfCards } = this.getActCardsAndCounts(line);
        this.drawLookedAtCardIfNeeded(act);
        this.processDeckChanges(line, act, cards, numberOfCards);
      }
      this.updateArchives(line);
      this.updateVP();
      if (this.debug) console.groupEnd();
    });
  }
}
