import {
  getLogScrollContainerLogLines,
  toErrorWithMessage,
} from "../utils/utils";
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
  latestPlay: string = "None";
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

  getLatestPlay(): string {
    return this.latestPlay;
  }

  setLatestPlay(card: string): void {
    this.latestPlay = card;
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
      if (this.latestPlay === "Library") {
        libraryLook = true;
      }
    } else {
      libraryLook = false;
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
   * Purpose: To determine which field array a card is played from.
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
    let vassalPlay: boolean = false;
    let vassalPlayInLogs: boolean = false;
    const len = this.logArchive.length;
    if (len > 3) {
      vassalPlayInLogs = this.latestPlay === "Vassal";
    }
    if (vassalPlayInLogs) {
      // try {
      let logScrollElement = getLogScrollContainerLogLines();
      try {
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
        if (currentLinePaddingNumber < previousLinePaddingNumber) {
          vassalPlay = false;
        } else if (currentLinePaddingNumber >= previousLinePaddingNumber) {
          vassalPlay = true;
        }
      } catch (e) {
        if (
          toErrorWithMessage(e).message ===
          "Previous line paddingLeft property does not end with %."
        )
          throw new Error(
            "Previous line paddingLeft property does not end with %."
          );
        else if (
          toErrorWithMessage(e).message ===
          "Current line paddingLeft property does not end with %."
        )
          throw new Error(
            "Current line paddingLeft property does not end with %."
          );
        let logScrollElementInnerText: string[] = [];
        Array.from(logScrollElement).forEach((el) => {
          logScrollElementInnerText.push(el.innerText);
        });
        console.log(e);
        console.log(toErrorWithMessage(e).message);

        console.error(
          `Error in checkForVassalPlay.  Tried to access the ${len}th and ${
            len - 1
          }th element of the log scroll element.`
        );

        console.log(
          "The logScrollElement has length " + logScrollElement.length
        );
        console.log("the logScrollElement is ", logScrollElement);
        console.log(
          "The logs scroll element's innerTexts has length ",
          logScrollElementInnerText.length
        );
        console.log(
          "The logs scroll element's innerTexts is ",
          logScrollElementInnerText
        );
        console.log("The logArchive is ", this.logArchive);
        console.log(
          "Was expecting to compare the paddingLeft of the last line of the logSCroll element with the 2nd last line of the logScroll Element."
        );
        console.log(
          "Compare the logArchive to the innerTexts of the game log.  Identify where the difference lies."
        );
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
    const handCopy = this.hand.slice();
    const inPlayCopy = this.inPlay.slice();
    const graveyardCopy = this.graveyard.slice();
    let i = this.inPlay.length - 1;
    let j = this.hand.length - 1;
    for (i; i >= 0; i--) {
      if (this.debug)
        console.info(
          `Moving ${this.inPlay[i]} from in play into into discard pile.`
        );
      graveyardCopy.push(this.inPlay[i]);
      inPlayCopy.splice(i, 1);
    }
    for (j; j >= 0; j--) {
      if (this.debug)
        console.info(`Moving ${this.hand[j]} from hand into discard pile.`);
      graveyardCopy.push(this.hand[j]);
      handCopy.splice(j, 1);
    }
    this.setHand(handCopy);
    this.setInPlay(inPlayCopy);
    this.setGraveyard(graveyardCopy);
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
    if (index < 0) {
      throw new Error(`No ${card} in hand.`);
    } else {
      const graveyardCopy = this.graveyard.slice();
      const handCopy = this.hand.slice();
      if (this.debug)
        console.info(
          `Discarding ${this.hand[index]} from hand into discard pile.`
        );
      graveyardCopy.push(this.hand[index]);
      handCopy.splice(index, 1);
      this.setGraveyard(graveyardCopy);
      this.setHand(handCopy);
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
    if (index < 0) {
      throw new Error(`No ${card} in library.`);
    } else {
      if (this.debug)
        console.info(`Discarding ${card} from library into discard pile.`);
      const graveyardCopy = this.graveyard.slice();
      const libraryCopy = this.library.slice();
      graveyardCopy.push(card);
      libraryCopy.splice(index, 1);
      this.setGraveyard(graveyardCopy);
      this.setLibrary(libraryCopy);
    }
  }

  /**
   * Moves the provided card from the setAside zone to the graveyard.
   * @param card - The provided card.
   */
  discardFromSetAside(card: string) {
    const index = this.setAside.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in setAside.`);
    } else {
      if (this.debug) console.log(`Discarding ${card} from setAside`);
      const graveyardCopy = this.graveyard.slice();
      const setAsideCopy = this.setAside.slice();
      graveyardCopy.push(card);
      setAsideCopy.splice(index, 1);
      this.setGraveyard(graveyardCopy);
      this.setSetAside(setAsideCopy);
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
    if (index < 0) {
      throw new Error(`No ${card} in library.`);
    } else {
      if (this.debug) console.info(`Drawing ${card} from library into hand.`);
      const handCopy = this.hand.slice();
      const libraryCopy = this.library.slice();
      handCopy.push(card);
      libraryCopy.splice(index, 1);
      this.setHand(handCopy);
      this.setLibrary(libraryCopy);
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
    this.drawFromSetAside(prevLineCard);
  }

  /**
   * Draws the given card from the setAside zone into hand.
   * @param card - The given card.
   */
  drawFromSetAside(card: string): void {
    const index = this.setAside.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in setAside.`);
    } else {
      if (this.debug)
        console.info(
          `Drawing ${card} set aside by Library from setAside into hand.`
        );
      const handCopy = this.hand.slice();
      const setAsideCopy = this.setAside.slice();
      handCopy.push(card);
      setAsideCopy.splice(index, 1);
      this.setHand(handCopy);
      this.setSetAside(setAsideCopy);
    }
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
    const graveyardCopy = this.graveyard.slice();
    graveyardCopy.push(card);
    this.setGraveyard(graveyardCopy);
    this.addCardToEntireDeck(card);
  }

  /**
   * Takes a card and pushes it to the hand field array.
   * @param card - The given card.
   */
  gainIntoHand(card: string) {
    if (this.debug) console.info(`Gaining ${card} into hand.`);
    const handCopy = this.hand.slice();
    handCopy.push(card);
    this.setHand(handCopy);
    this.addCardToEntireDeck(card);
  }

  /**
   * Takes a card and pushes it to the library field array.
   * @param card
   */
  gainIntoLibrary(card: string) {
    if (this.debug) console.info(`Gaining ${card} into deck.`);
    const libraryCopy = this.library.slice();
    libraryCopy.push(card);
    this.setLibrary(libraryCopy);
    this.addCardToEntireDeck(card);
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
   * Function called when checking for source of a gain.  Returns whether
   * or not the gain was from an Artisan.
   * @returns - boolean for whether the card was gained by Artisan.
   */
  isArtisanGain(): boolean {
    return (
      this.lastEntryProcessed.match(this.playerNick + " plays an Artisan") !==
      null
    );
  }

  /**
   * Function called when checking for source of a gain.  Returns whether
   * or not the gain was from an Bureaucrat.
   * @returns - boolean for whether the card was gained by Bureaucrat.
   */
  isBureaucratGain(): boolean {
    return (
      this.lastEntryProcessed.match(this.playerNick + " plays a Bureaucrat") !==
      null
    );
  }

  /**
   * Function returns boolean for whether the gain on the given line is
   * gained by a Mine.
   * @param line = The current line being processed
   */
  isMineGain(): boolean {
    let mineGain: boolean = true;
    if (this.lastEntryProcessed.match(/ trashes an? /) === null) {
      mineGain = false;
    } else if (
      this.logArchive[this.logArchive.length - 2].match(
        `${this.playerNick} plays a Mine`
      ) === null
    ) {
      mineGain = false;
    }
    return mineGain;
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
    if (index < 0) {
      throw new Error(`No ${card} in hand.`);
    } else {
      if (this.debug) console.info(`Playing ${card} from hand into play.`);
      const inPlayCopy = this.inPlay.slice();
      const handCopy = this.hand.slice();
      inPlayCopy.push(card);
      handCopy.splice(index, 1);
      this.setInPlay(inPlayCopy);
      this.setHand(handCopy);
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
    if (index < 0) {
      throw new Error(`No ${card} in discard pile.`);
    } else {
      if (this.debug)
        console.info(`Playing ${card} from discard pile into play.`);
      const inPlayCopy = this.inPlay.slice();
      const graveyardCopy = this.graveyard.slice();
      inPlayCopy.push(card);
      graveyardCopy.splice(index, 1);
      this.setInPlay(inPlayCopy);
      this.setGraveyard(graveyardCopy);
    }
  }

  /**
   * Update function.  Calls the appropriate process line function to update
   * the deck state.
   * @param line - The current line being processed.
   * @param act - The act from the current line. ie: draws, discards.
   * @param cards - The array of cards collected from the line.
   * @param numberOfCards - The array of card amounts collected from the line.
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
        this.processLooksAtLine(cards, numberOfCards);
        break;
      case "reveals":
        this.processRevealsLine(cards, numberOfCards);
        break;
      // case "aside with Library":
      // Placing this switch case here as a reminder that this
      // act exists, and needs to exist for the function
      // libraryTriggeredPreviousLineDraw to work correctly.
    }
  }

  /**
   * Update function.  Discards cards according to the provided information.
   * @param line - The current line being processed.
   * @param cards - Array of card names to be discarded.
   * @param numberOfCards - Array of the amounts of each card to discard.
   */
  processDiscardsLine(cards: string[], numberOfCards: number[]) {
    const mostRecentPlay: string = this.latestPlay;
    // const libraryDiscard = this.checkForLibraryDiscard(line);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (["Sentry", "Library", "Bandit"].includes(mostRecentPlay)) {
          this.discardFromSetAside(cards[i]);
        } else if (["Vassal"].includes(mostRecentPlay)) {
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
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (this.isBureaucratGain()) {
          this.gainIntoLibrary(cards[i]);
        } else if (this.isArtisanGain() || this.isMineGain()) {
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
  processLooksAtLine(cards: string[], numberOfCards: number[]) {
    const mostRecentPlay = this.latestPlay;
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (["Sentry", "Bandit"].includes(mostRecentPlay)) {
          this.setAsideFromLibrary(cards[i]);
        } else if (mostRecentPlay === "Library") {
          const cardsToDrawNow: string[] = [
            "Estate",
            "Duchy",
            "Province",
            "Gardens",
            "Copper",
            "Silver",
            "Gold",
            "Curse",
          ];
          if (this.debug) console.log("It's a library look");
          if (cardsToDrawNow.includes(cards[i])) {
            this.draw(cards[i]);
          } else {
            if (this.debug) console.log("waitToDraw changing to true;");
            this.setAsideFromLibrary(cards[i]);
            this.setWaitToDrawLibraryLook(true);
          }
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
   * Update function.  Processes revealed cards according to the provided information
   * @param cards - Array of cards to be processed
   * @param numberOfCards - Array of the quantities of each card to be processed.
   */
  processRevealsLine(cards: string[], numberOfCards: number[]): void {
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (this.latestPlay === "Bandit") {
          this.setAsideFromLibrary(cards[i]);
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
    const mostRecentPlay = this.latestPlay;
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
    const mostRecentPlay = this.latestPlay;
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (["Sentry", "Bandit"].includes(mostRecentPlay)) {
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
  setAsideFromLibrary(card: string) {
    const index = this.library.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in library.`);
    } else {
      if (this.debug)
        console.info(`Setting aside a ${card} with ${this.latestPlay}.`);
      const setAsideCopy = this.setAside.slice();
      const libraryCopy = this.library.slice();
      setAsideCopy.push(card);
      libraryCopy.splice(index, 1);
      this.setSetAside(setAsideCopy);
      this.setLibrary(libraryCopy);
    }
  }

  /**
   * Update function.  Uses the value of field method to determine whether a
   * shuffle call is needed.  If a shuffle call is needed, performs a check
   * for whether a cleanup is needed, and performs the cleanup before
   * shuffling.
   * @param line - The current line being processed.
   */
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
   * Iterates over all cards instances in the graveyard array.  For each iteration,
   * the card instance is added to the library field array and removed from
   * the graveyard field array.
   */
  shuffleGraveYardIntoLibrary() {
    let i = this.graveyard.length - 1;
    const libraryCopy = this.library.slice();
    const graveyardCopy = this.graveyard.slice();
    for (i; i >= 0; i--) {
      if (this.debug)
        console.info(
          `Shuffling ${this.graveyard[i]} from discard pile into library`
        );
      libraryCopy.push(this.graveyard[i]);
      graveyardCopy.splice(i, 1);
    }
    this.setLibrary(libraryCopy);
    this.setGraveyard(graveyardCopy);
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
    if (index < 0) {
      throw new Error(`No ${card} in discard pile.`);
    } else {
      if (this.debug) console.info(`Top decking ${card} from discard pile.`);
      const libraryCopy = this.library.slice();
      const graveyardCopy = this.graveyard.slice();
      libraryCopy.push(card);
      graveyardCopy.splice(index, 1);
      this.setLibrary(libraryCopy);
      this.setGraveyard(graveyardCopy);
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
    if (index < 0) {
      throw new Error(`No ${card} in hand.`);
    } else {
      if (this.debug)
        console.info(`Top decking ${this.hand[index]} from hand.`);
      const libraryCopy = this.library.slice();
      const handCopy = this.hand.slice();
      libraryCopy.push(card);
      handCopy.splice(index, 1);
      this.setLibrary(libraryCopy);
      this.setHand(handCopy);
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
      if (this.debug) console.info(`Top decking ${card} from setAside.`);
      const libraryCopy = this.library.slice();
      const setAsideCopy = this.setAside.slice();
      libraryCopy.push(card);
      setAsideCopy.splice(index, 1);
      this.setLibrary(libraryCopy);
      this.setSetAside(setAsideCopy);
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
      if (this.debug) console.info(`Trashing ${card} from hand.`);
      const trashCopy = this.trash.slice();
      const handCopy = this.hand.slice();
      trashCopy.push(card);
      handCopy.splice(index, 1);
      this.setTrash(trashCopy);
      this.setHand(handCopy);
      this.removeCardFromEntireDeck(card);
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
      const trashCopy = this.trash.slice();
      const libraryCopy = this.library.slice();
      trashCopy.push(card);
      libraryCopy.splice(index, 1);
      this.setTrash(trashCopy);
      this.setLibrary(libraryCopy);
      this.removeCardFromEntireDeck(card);
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
      if (this.debug) console.info(`Trashing ${card} from setAside.`);
      const trashCopy = this.trash.slice();
      const setAsideCopy = this.setAside.slice();
      trashCopy.push(card);
      setAsideCopy.splice(index, 1);
      this.setTrash(trashCopy);
      this.setSetAside(setAsideCopy);
      this.removeCardFromEntireDeck(card);
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
          this.getConsecutiveTreasurePlayCounts(line);
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
      this.setLatestPlay(this.getMostRecentPlay(this.logArchive));
      if (this.debug) console.groupEnd();
    });
  }
}
