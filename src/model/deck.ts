import {
  getClientGameLog,
  getErrorMessage,
  getLogScrollContainerLogLines,
  toErrorWithMessage,
} from "../utils/utils";
import type { DurationName, StoreDeck } from "../utils";
import { BaseDeck } from "./baseDeck";
import { setError } from "../redux/contentSlice";
import { store } from "../redux/store";
import { Duration } from "./duration";

/**
 * Class for a Deck object used to track a
 * player's Deck state.
 */
export class Deck extends BaseDeck implements StoreDeck {
  activeDurations: Array<Duration> = [];
  durationLogs: Array<string> = [];
  durationPlaySourceCounter: number = 0;
  durationSetAside: Array<string> = [];
  graveyard: Array<string> = [];
  hand: Array<string> = [];
  inPlay: Array<string> = [];
  library: Array<string> = [];
  masterMindEffectCount: number = 0;
  setAside: Array<string> = [];
  throneMotherPadding: number = 0;
  throneRoomActive: boolean = false;
  throneID: number = 0;
  waitToAssignBargeLifespan: boolean = false;
  waitToDrawLibraryLook: boolean = false;
  waitToTopdeckCrystalBallLook: boolean = false;
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
    this.debug = true;
  }

  getActiveDurations(): Duration[] {
    return this.activeDurations;
  }

  setActiveDurations(activeDurations: Duration[]) {
    this.activeDurations = activeDurations;
  }

  getDurationLogs(): string[] {
    return this.durationLogs;
  }

  setDurationLogs(durationLogs: string[]) {
    this.durationLogs = durationLogs;
  }

  getDurationSetAside(): string[] {
    return this.durationSetAside;
  }

  setDurationSetAside(durationSetAside: string[]) {
    this.durationSetAside = durationSetAside;
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

  getThroneRoomActive(): boolean {
    return this.throneRoomActive;
  }

  setThroneRoomActive(active: boolean) {
    this.throneRoomActive = active;
  }

  getThroneID(): number {
    return this.throneID;
  }

  setThroneID(id: number) {
    this.throneID = id;
  }

  getThroneMotherPadding(): number {
    return this.throneMotherPadding;
  }

  setThroneMotherPadding(padding: number) {
    this.throneMotherPadding = padding;
  }

  getWaitToAssignBargeLifespan() {
    return this.waitToAssignBargeLifespan;
  }

  setWaitToAssignBargeLifespan(wait: boolean) {
    this.waitToAssignBargeLifespan = wait;
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

  getWaitToTopdeckCrystalBallLook(): boolean {
    return this.waitToTopdeckCrystalBallLook;
  }

  setWaitToTopdeckCrystalBallLook(wait: boolean) {
    this.waitToTopdeckCrystalBallLook = wait;
  }

  /**
   * Decreases age of all active durations by 1
   */
  ageAllActiveDurations() {
    this.activeDurations.forEach((duration) => {
      if (duration.age !== undefined && duration.age !== "unset") {
        duration.setAge(duration.age - 1);
      } else if (duration.age === undefined) {
        throw Error("Duration age is undefined.");
      } else if (duration.age === "unset") {
        throw Error("Duration age is unset.");
      }
    });
  }

  /**
   * Assigns the correct lifespan to a Barge duration, depending on the player's choice,
   * whether they used the effect on the same turn, or decided to use the effect on the next turn.
   */
  assignBargeLifespanIfNeeded(act: string) {
    if (this.waitToAssignBargeLifespan) {
      const bargeDuration =
        this.activeDurations[this.activeDurations.length - 1];
      let lifeSpan = bargeDuration.age;
      if (
        // If the duration is not already set to 1
        bargeDuration.age !== 1 &&
        // and iff the last entry processed is a Barge play
        this.lastEntryProcessed.match(`${this.playerNick} plays a Barge`) !==
          null &&
        // and the act on the current line is 'shuffles their deck'
        act === "shuffles their deck"
      ) {
        lifeSpan = 0;
      } else if (
        bargeDuration.age !== 1 &&
        this.lastEntryProcessed.match(`${this.playerNick} plays a Barge`) !==
          null
      ) {
        // Check paddings
        const gameLogLines = Array.from(getLogScrollContainerLogLines());
        const currentLine = gameLogLines[this.logArchive.length];
        const prevLine = gameLogLines[this.logArchive.length - 1];
        const currentPadding: number = parseInt(
          currentLine!.style.paddingLeft.slice(
            0,
            currentLine!.style.paddingLeft.length - 1
          )
        );
        const prevPadding: number = parseInt(
          prevLine!.style.paddingLeft.slice(
            0,
            prevLine!.style.paddingLeft.length - 1
          )
        );

        if (currentPadding > prevPadding) {
          lifeSpan = 0;
        } else {
          lifeSpan = 1;
        }
      }
      bargeDuration.setAge(lifeSpan);
      if (typeof bargeDuration.playSource !== "string") {
        bargeDuration.playSource.setAge(lifeSpan);
      }
      this.setWaitToAssignBargeLifespan(false);
    }
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
   * Checks the log archive to see if the draws on the current line are
   * caused by a Hunting Lodge
   * @returns - Boolean for if the current line's draws were from a Hunting Lodge.
   */
  checkForHuntingLodgeDraw() {
    let huntingLodgeDraws = false;
    const logArchLen = this.logArchive.length;
    if (
      // Case 1, no shuffle, no discards
      (logArchLen > 2 &&
        this.logArchive[logArchLen - 3].match(" plays a Hunting Lodge") !==
          null) ||
      // Case 2, no shuffle, with discards
      (logArchLen > 3 &&
        this.logArchive[logArchLen - 4].match(" plays a Hunting Lodge") !==
          null) ||
      // Case 3, early shuffle, and discards.
      (logArchLen > 4 &&
        this.logArchive[logArchLen - 5].match(" plays a Hunting Lodge") !==
          null &&
        this.logArchive[logArchLen - 4].match(" shuffles their deck") !==
          null) ||
      // Case 4, later shuffle, and discards
      (logArchLen > 4 &&
        this.logArchive[logArchLen - 5].match(" plays a Hunting Lodge") !==
          null &&
        this.logArchive[logArchLen - 1].match(" shuffles their deck") !== null)
    ) {
      huntingLodgeDraws = true;
    }
    return huntingLodgeDraws;
  }

  /**
   * Checks the log archive to see if the draws on the current line are
   * caused by an Innkeeper
   * @returns - Boolean for if the current line's draws were from an Innkeeper.
   */
  checkForInnkeeperDraw() {
    let innKeeperDraws = false;
    const logArchLen = this.logArchive.length;
    if (
      (logArchLen > 1 &&
        this.logArchive[logArchLen - 2].match(" plays an Innkeeper") !==
          null) ||
      (logArchLen > 2 &&
        this.logArchive[logArchLen - 1].match(" shuffles their deck") !==
          null &&
        this.logArchive[logArchLen - 3].match(" plays an Innkeeper") !== null)
    ) {
      innKeeperDraws = true;
    }
    return innKeeperDraws;
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
   * by the given card.
   * @param line - The given line to check
   * @returns The boolean for whether the current look at activity was triggered by the given card.
   */
  checkForLook(line: string, lookType: string): boolean {
    let lookLine: boolean = false;
    if (line.match(" looks at ") !== null) {
      if (this.latestAction === lookType) {
        lookLine = true;
      }
    } else {
      lookLine = false;
    }
    return lookLine;
  }

  /**
   * Checks to see if the the play on the current line being processed was played from a non-hand source, such
   * as a Vassal or Fortune Hunter, and if the play was from a non-hand source, it returns the card name
   * for that source, otherwise it returns "None".
   * triggered by a NonHand source.
   * @returns - The non-hand source of the current play, or "None"
   */
  checkForNonHandPlay() {
    /*
    Log text alone does not provide sufficient context to
    resolve ambiguity for whether a play that takes place immediately after a non-hand play is
    being played from the hand, or if it is being played another zone by an Action card.
    To resolve this ambiguity we look to the style property of the log-line elements: padding-left.
    If a play is triggered by a non-hand source, the value of the padding-left property of the related log-line element
    is equal to the value of the padding-left property of the previous log-line element.  If the play is not
    triggered by the Courier, but is coming from the hand, the padding-left property of the previous line will
    be less than the current line.
    */
    let nonHandPlay =
      ["Courier", "Fortune Hunter", "Vassal"].includes(this.latestAction) &&
      ["Courier", "Fortune Hunter", "Vassal"].includes(this.latestPlay);
    const len = this.logArchive.length;
    if (len >= 3 && nonHandPlay) {
      // try {
      const logScrollElement = getLogScrollContainerLogLines();
      try {
        let currentLinePaddingNumber: number;
        const currentLinePaddingPercentage: string =
          logScrollElement[len].style.paddingLeft;
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
        const previousLinePaddingPercentage: string =
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
          nonHandPlay = false;
        } else if (currentLinePaddingNumber >= previousLinePaddingNumber) {
          nonHandPlay = true;
        }
      } catch (e) {
        if (
          toErrorWithMessage(e).message ===
          "Previous line paddingLeft property does not end with %."
        )
          throw new Error(
            "checkForNonHandPlay error: Previous line paddingLeft property does not end with %."
          );
        else if (
          toErrorWithMessage(e).message ===
          "Current line paddingLeft property does not end with %."
        )
          throw new Error(
            "checkForNonHandPlay error: Current line paddingLeft property does not end with %."
          );
        const logScrollElementInnerText: string[] = [];
        Array.from(logScrollElement).forEach((el) => {
          logScrollElementInnerText.push(el.innerText);
        });
        console.log(e);
        console.log(toErrorWithMessage(e).message);

        console.error(
          `Error in checkForNonHandPlay.  Tried to access the ${len}th and ${
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
        throw new Error("checkForNonHandPlay error: " + getErrorMessage(e));
      }
    }
    if (nonHandPlay) return this.latestPlay;
    else return "None";
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
   * Iterates over all the card instances in the hand and inPlay field arrays.
   * For each iteration, the card instance is added to the graveyard array and removed
   * from the hand and/or inPlay arrays and added to the graveyard array.
   * Active durations are excluded from this process, and remain in the inPlay array.
   */
  cleanup() {
    if (this.debug) console.group("Cleaning up:");
    // Temporarily remove active durations with remaining lifespan from inPlay.
    const livingDurations: Duration[] = [];
    const livingDurationNames: string[] = [];
    this.activeDurations.forEach((duration, idx) => {
      if (this.debug) {
        console.log("active duration ", idx);
        console.log(duration);
      }
      if (
        duration.age !== undefined &&
        duration.age !== "unset" &&
        duration.age > 0
      ) {
        const index = this.inPlay.indexOf(duration.name);
        if (index < 0) throw Error(`No ${duration.name} in play.`);
        const inPlayCopy = this.inPlay.slice();
        livingDurations.push(duration);
        livingDurationNames.push(duration.name);
        inPlayCopy.splice(index, 1);
        this.setInPlay(inPlayCopy);
      } else if (duration.age !== undefined && duration.age === 0) {
        if (this.debug)
          console.log(
            `Duration ${duration.name} has reached 0 and will be removed.`
          );
      } else if (duration.age === undefined || duration.age === "unset") {
        throw Error("Duration age is " + duration.age + ".");
      }
    });
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
    this.setGraveyard(graveyardCopy);
    // Repopulate inPlay with living durations
    this.setInPlay(livingDurationNames);
    // Set the activeDurations field to be only the living durations
    this.setActiveDurations(livingDurations);
    // Age active durations.
    this.ageAllActiveDurations();
    if (this.debug) console.groupEnd();
  }

  /**
   * Creates a duration objects from the given card and adds it to the
   * activeDurations field.
   * @param line - The line currently being processed.
   * @param card - The given duration card.
   */
  createDuration(line: string, card: DurationName, source?: string | Duration) {
    console.log("Duration play occurring, ", card);
    if (card === "Barge") {
      this.setWaitToAssignBargeLifespan(true);
    }
    if (line.match(`${card} again`) === null) {
      // AboveIf condition ensures that new durations are not added to th activeDurations field
      //  if the log-line where the card is played is playing the card again by a Throne Room.
      const activeDurationsCopy = this.activeDurations.slice();

      if (
        this.lastEntryProcessed.match("plays a Throne Room again.") !== null
      ) {
        // This if condition ensures that source is not set to Throne Room if the Throne Room is
        // being played again (ie, not playing Throne Room card from hand)
        activeDurationsCopy.push(new Duration(card as DurationName));
      } else {
        activeDurationsCopy.push(
          new Duration(card as DurationName, { playSource: source })
        );
      }
      this.setActiveDurations(activeDurationsCopy);
    }
  }

  /**
   * Checks hand field array to see if card is there.  If yes,
   * removes an instance of that card from the hand field array
   * and adds an instance of that card to the graveyard field array.
   * @param card - The given card.
   */
  discard(card: string) {
    if (this.debug)
      console.info(`Discarding ${card} from hand into discard pile.`);
    const index = this.hand.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in hand.`);
    } else {
      const graveyardCopy = this.graveyard.slice();
      const handCopy = this.hand.slice();
      graveyardCopy.push(card);
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
    if (this.debug)
      console.info(`Discarding ${card} from library into discard pile.`);
    const index = this.library.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in library.`);
    } else {
      const graveyardCopy = this.graveyard.slice();
      const libraryCopy = this.library.slice();
      graveyardCopy.push(card);
      libraryCopy.splice(index, 1);
      this.setGraveyard(graveyardCopy);
      this.setLibrary(libraryCopy);
    }
  }

  /**
   * Moves the provided card from the durationSetAside zone to the graveyard.
   * @param card - The provided card.
   */
  discardFromDurationSetAside(card: string) {
    const index = this.durationSetAside.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in durationSetAside.`);
    } else {
      if (this.debug) console.log(`Discarding ${card} from durationSetAside.`);
      const graveyardCopy = this.graveyard.slice();
      const durationSetAsideCopy = this.durationSetAside.slice();
      graveyardCopy.push(card);
      durationSetAsideCopy.splice(index, 1);
      this.setGraveyard(graveyardCopy);
      this.setDurationSetAside(durationSetAsideCopy);
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
    if (this.debug) console.info(`Drawing ${card} from library into hand.`);
    const index = this.library.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in library.`);
    } else {
      const handCopy = this.hand.slice();
      const libraryCopy = this.library.slice();
      handCopy.push(card);
      libraryCopy.splice(index, 1);
      this.setHand(handCopy);
      this.setLibrary(libraryCopy);
    }
  }

  /**
   * Draws the given card from durationSetAside into hand.
   * @param card - The given card.
   */
  drawFromDurationSetAside(card: string) {
    if (this.debug)
      console.info(`Drawing ${card} from durationSetAside into hand.`);
    const index = this.durationSetAside.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in durationSetAside.`);
    } else {
      const handCopy = this.hand.slice();
      const durationSetAsideCopy = this.durationSetAside.slice();
      handCopy.push(card);
      durationSetAsideCopy.splice(index, 1);
      this.setHand(handCopy);
      this.setDurationSetAside(durationSetAsideCopy);
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
   * Draws the given card from graveyard into hand.
   * @param card - The given card.
   */
  drawFromGraveyard(card: string) {
    if (this.debug) console.info(`Drawing ${card} from discard into hand.`);
    const index = this.graveyard.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in discard.`);
    } else {
      const handCopy = this.hand.slice();
      const graveyardCopy = this.graveyard.slice();
      handCopy.push(card);
      graveyardCopy.splice(index, 1);
      this.setHand(handCopy);
      this.setGraveyard(graveyardCopy);
    }
  }

  /**
   * Draws the given card from the setAside zone into hand.
   * @param card - The given card.
   */
  drawFromSetAside(card: string): void {
    if (this.debug) console.info(`Drawing ${card} from setAside into hand.`);
    let index = this.setAside.indexOf(card);
    if (index < 0) {
      this.reconcileMissingRevealsProcess();
      index = this.setAside.indexOf(card);
    }
    if (index < 0) throw new Error(`No ${card} in setAside.`);
    const handCopy = this.hand.slice();
    const setAsideCopy = this.setAside.slice();
    handCopy.push(card);
    setAsideCopy.splice(index, 1);
    this.setHand(handCopy);
    this.setSetAside(setAsideCopy);
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
   * Removes one instance of the given card from hand and adds it to durationSetAside.
   * @param card - The given card.
   */
  durationSetAsideFromHand(card: string) {
    if (this.debug)
      console.info(`Setting aside ${card} from hand into durationSetAside.`);
    const index = this.hand.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in hand.`);
    } else {
      const durationSetAsideCopy = this.durationSetAside.slice();
      const handCopy = this.hand.slice();
      durationSetAsideCopy.push(card);
      handCopy.splice(index, 1);
      this.setDurationSetAside(durationSetAsideCopy);
      this.setHand(handCopy);
    }
  }

  /**
   * Removes one instance of the given card from hand and adds it to durationSetAside.
   * @param card - The given card.
   */
  durationSetAsideFromInPlay(card: string) {
    if (this.debug)
      console.info(`Setting aside ${card} from inPlay into durationSetAside.`);
    const index = this.inPlay.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in inPlay.`);
    } else {
      const durationSetAsideCopy = this.durationSetAside.slice();
      const inPlayCopy = this.inPlay.slice();
      durationSetAsideCopy.push(card);
      inPlayCopy.splice(index, 1);
      this.setDurationSetAside(durationSetAsideCopy);
      this.setInPlay(inPlayCopy);
    }
  }

  /**
   * Removes one instance of the given card from library and adds it to durationSetAside.
   * @param card - The given card.
   */
  durationSetAsideFromLibrary(card: string) {
    if (this.debug)
      console.info(`Setting aside ${card} from library into durationSetAside.`);
    const index = this.library.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in library.`);
    } else {
      const durationSetAsideCopy = this.durationSetAside.slice();
      const libraryCopy = this.library.slice();
      durationSetAsideCopy.push(card);
      libraryCopy.splice(index, 1);
      this.setDurationSetAside(durationSetAsideCopy);
      this.setLibrary(libraryCopy);
    }
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
   * until it finds an action play, and returns the card in that entry that was played.
   * entry
   * @param logArchive
   * @returns
   */
  getMostRecentAction(logArchive: string[]): string {
    let mostRecentActionPlayed: string = "None";
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
          mostRecentActionPlayed = logArchive[i].slice(
            lowerIndex,
            logArchive[i].lastIndexOf(" ")
          );
        }
        // the line might end with '(<DurationName>)'
        else if (logArchive[i].match(/\(.*\)/)) {
          mostRecentActionPlayed = logArchive[i].slice(
            lowerIndex,
            logArchive[i].lastIndexOf(" (") - 1
          );
        } else {
          mostRecentActionPlayed = logArchive[i].slice(
            lowerIndex,
            logArchive[i].length - 1
          );
        }
      }
      if (playFound || logArchive[i].match("Turn ")) break;
    }
    return mostRecentActionPlayed;
  }

  /**
   * Function looks at the logArchive, starting with the last entry, and looks at each entry
   * until it finds an action play, and returns the card in that entry that was played.
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
          // The line might end with a +$(<number>) if its a treasure play, or (<DurationName>) if its a duration effect.
        } else if (logArchive[i].match(/\(.*\)/)) {
          mostRecentCardPlayed = logArchive[i].slice(
            lowerIndex,
            logArchive[i].lastIndexOf(" (") - 1
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
   * Update function checks if any passes are incoming.
   * @param act - The act from the given line.
   * @param line - The given line being processed.
   * @param cards - The card names on the given line.
   * @param numberOfCards - The amounts of the cards on the given line.
   */
  handleIncomingPasses(
    line: string,
    act: string,
    cards: string[],
    numberOfCards: number[]
  ) {
    if (act === "passes") {
      // Check if the passing is done to this deck.
      const lineWithoutPeriod = line.substring(0, line.length - 1);
      const passTo = lineWithoutPeriod.substring(
        lineWithoutPeriod.length - this.playerNick.length
      );
      if (passTo === this.playerNick) {
        this.processPassesLine(cards, numberOfCards, "incoming");
      }
    }
  }

  /**
   * Checks if a cleanUp is needed.
   * @param entry - A log entry to be checked.
   */
  ifCleanUpNeeded(entry: string): boolean {
    const cleanUp = this.checkForCleanUp(entry);
    const isDrawLine = entry.match("draws") !== null;
    return (
      cleanUp &&
      !this.checkForCellarDraw() &&
      !this.checkForInnkeeperDraw() &&
      !this.checkForHuntingLodgeDraw() &&
      isDrawLine
    );
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

  isThereMastermindSourceAmbiguity() {
    //Get all existing active Mastermind durations.
    const playSources = new Set<string>();
    const mastermindDurations = this.activeDurations.reduce(
      (prev: Duration[], curr: Duration) => {
        const mmDurations = prev.slice();
        const currentDuration = curr;
        if (curr.name === "Mastermind") {
          mmDurations.push(currentDuration);
          if (typeof currentDuration.playSource === "string")
            playSources.add(currentDuration.playSource);
        }
        return mmDurations;
      },
      []
    );
    console.log("all mastermind durations", mastermindDurations);
    return playSources.size > 1;
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
      const prevLineLibraryLook = this.checkForLook(
        this.logArchive[len - 1],
        "Library"
      );
      needToDrawCardLookedAtFromPreviousLine =
        prevLineLibraryLook &&
        this.waitToDrawLibraryLook &&
        act !== "aside with Library";
    }

    return needToDrawCardLookedAtFromPreviousLine;
  }

  /**
   * Handles Mastermind Duration effects.  Ensures a card is played
   * from hand only once.
   * @param deck - The deck playing a Mastermind
   * @param card - The card being played thrice by Mastermind
   */
  masterMindEffectHandler(deck: Deck, card: string) {
    if (deck.masterMindEffectCount === 0) {
      deck.play(card);
      deck.masterMindEffectCount++;
    } else if (deck.masterMindEffectCount === 1) {
      deck.masterMindEffectCount++;
    } else if (deck.masterMindEffectCount === 2) {
      deck.masterMindEffectCount = 0;
    }
  }

  /**
   * Moves an instance of the given card from the given fromZone to the given toZone,
   * and returns the resulting arrays.
   * @param card - The card to be moved.
   * @param fromZone - The zone the card shall be removed from.
   * @param toZone - The zone the card shall be moved to
   * @returns - An object containing the new resulting Zones
   */
  moveCard(
    card: string,
    fromZone: string[],
    toZone: string[]
  ): { newFromZone: string[]; newToZone: string[] } {
    const index = fromZone.indexOf(card);
    if (index < 0) {
      throw Error(`No ${card} in fromZone.`);
    }
    const newToZone = toZone.slice();
    const newFromZone = fromZone.slice();
    newToZone.push(card);
    newFromZone.splice(index, 1);
    return { newFromZone, newToZone };
  }

  /**
   * Checks hand field array to see if card is there.  If yes, removes one
   * instance of that card from the hand field and then adds one
   * instance of that card to inPlay field
   * @param card - The given card.
   */
  play(card: string) {
    if (this.debug) console.info(`Playing ${card} from hand into play.`);
    const index = this.hand.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in hand.`);
    } else {
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
    if (this.debug)
      console.info(`Playing ${card} from discard pile into play.`);
    const index = this.graveyard.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in discard pile.`);
    } else {
      const inPlayCopy = this.inPlay.slice();
      const graveyardCopy = this.graveyard.slice();
      inPlayCopy.push(card);
      graveyardCopy.splice(index, 1);
      this.setInPlay(inPlayCopy);
      this.setGraveyard(graveyardCopy);
    }
  }

  /**
   * Checks setAside field array to see if card is there.  If yes,
   * removes one instance of the card from the setAside field array,
   * and adds one instance of the card to the inPlay field array.
   * and removes
   * @param card  - The given card.
   */
  playFromSetAside(card: string) {
    if (this.debug) console.info(`Playing ${card} from setAside into play.`);
    const index = this.setAside.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in setAside.`);
    } else {
      const inPlayCopy = this.inPlay.slice();
      const setAsideCopy = this.setAside.slice();
      inPlayCopy.push(card);
      setAsideCopy.splice(index, 1);
      this.setInPlay(inPlayCopy);
      this.setSetAside(setAsideCopy);
    }
  }

  /**
   * Update function.  Sets aside cards according to the provided information.
   * @param line - The current line being processed.
   * @param cards - Array of card names to be set aside.
   * @param numberOfCards - Array of the amounts of each card to set aside.
   */
  processAsideLine(cards: string[], numberOfCards: number[]) {
    const sourceCard = this.getCardsAndCountsFromLine(this.lineSource())[0][0];
    console.log("sourceCard is", sourceCard);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (["Research"].includes(this.latestAction)) {
          this.durationSetAsideFromLibrary(cards[i]);
        } else if (["Royal Galley"].includes(sourceCard)) {
          this.durationSetAsideFromInPlay(cards[i]);
        } else if (["Archive"].includes(this.latestAction)) {
          // do nothing... cards were already durationSetAside by the Archive's 'looks at' line
        } else {
          this.durationSetAsideFromHand(cards[i]);
        }
      }
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
      case "and finds it":
        this.processDrawsLine(line, cards, numberOfCards);
        break;
      case "discards":
        this.processDiscardsLine(line, cards, numberOfCards);
        break;
      case "plays":
        this.processPlaysLine(line, cards, numberOfCards);
        break;
      case "trashes":
        this.processTrashesLine(line, cards, numberOfCards);
        break;
      case "topdecks":
        this.processMoveToLibraryLine(cards, numberOfCards);
        break;
      case "back onto their deck":
        this.processMoveToLibraryLine(cards, numberOfCards);
        break;
      case "into their deck":
        this.processMoveToLibraryLine(cards, numberOfCards);
        break;
      case "on the bottom of their deck":
        this.processMoveToLibraryLine(cards, numberOfCards);
        break;
      case "looks at":
        this.processLooksAtLine(cards, numberOfCards);
        break;
      case "reveals":
        this.processRevealsLine(cards, numberOfCards);
        break;
      case "passes":
        this.processPassesLine(cards, numberOfCards);
        break;
      case "into their hand":
        this.processIntoTheirHandLine(cards, numberOfCards);
        break;
      case "in hand":
        this.processIntoTheirHandLine(cards, numberOfCards);
        break;
      case "moves their deck to the discard":
        this.processMovesTheirDeckToTheDiscardLine();
        break;
      case "starts with":
        this.processStartsWithLine(cards, numberOfCards);
        break;
      case "aside":
        this.processAsideLine(cards, numberOfCards);
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
  processDiscardsLine(line: string, cards: string[], numberOfCards: number[]) {
    const mostRecentPlay: string = this.latestAction;
    let durationEffectCausedBy: string = "None";
    const isDurationEffect = this.isDurationEffect();
    if (isDurationEffect)
      durationEffectCausedBy = this.durationEffectCausedBy(line);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (isDurationEffect) {
          if (["Dungeon", "Tide Pools"].includes(durationEffectCausedBy)) {
            this.discard(cards[i]);
          } else {
            this.discardFromDurationSetAside(cards[i]);
          }
        } else if (
          [
            "Sentry",
            "Library",
            "Bandit",
            "Lookout",
            "Sage",
            "Farming Village",
            "Wandering Minstrel",
            "Hunter",
            "Cartographer",
            "Hunting Party",
            "Fortune Teller",
            "Advisor",
            "Envoy",
            "Crystal Ball",
            "Journeyman",
          ].includes(mostRecentPlay)
        ) {
          this.discardFromSetAside(cards[i]);
        } else if (
          ["Vassal", "Courier", "Harvest", "Jester"].includes(mostRecentPlay)
        ) {
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
    if (this.ifCleanUpNeeded(line) && !this.checkForShuffle()) {
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
        if (
          [
            "Bureaucrat",
            "Armory",
            "Treasure Map",
            "Fool's Gold",
            "Taxman",
          ].includes(this.latestAction) ||
          // Fool's Gold reaction
          (this.lineSource()?.match(/gains (a|\d*) Province/) &&
            cards[0] === "Gold" &&
            numberOfCards[0] === 1)
        ) {
          this.gainIntoLibrary(cards[i]);
        } else if (
          ["Artisan", "Mine", "Trading Post"].includes(this.latestAction)
        ) {
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
   * Update function.  Draws cards from setAside.
   * @param cards - The given cards.
   * @param numberOfCards - The amounts of the given cards.
   */
  processIntoTheirHandLine(cards: string[], numberOfCards: number[]) {
    const isDurationEffect = this.isDurationEffect();
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (["Mountain Village"].includes(this.latestAction)) {
          this.drawFromGraveyard(cards[i]);
        } else if (
          [
            "Hunting Party",
            "Hunter",
            "Farming Village",
            "Sea Chart",
            "Sage",
            "Patrol",
            "Seer",
            "Advisor",
            "Envoy",
            "Journeyman",
          ].includes(this.latestAction)
        ) {
          this.drawFromSetAside(cards[i]);
        } else if (["Archive"].includes(this.latestAction)) {
          this.drawFromDurationSetAside(cards[i]);
        } else if (isDurationEffect) {
          this.drawFromDurationSetAside(cards[i]);
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
    const mostRecentPlay = this.latestAction;
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (
          [
            "Sentry",
            "Bandit",
            "Lookout",
            "Sentinel",
            "Fortune Hunter",
            "Wandering Minstrel",
            "Cartographer",
            "Crystal Ball",
          ].includes(mostRecentPlay)
        ) {
          if (mostRecentPlay === "Crystal Ball") {
            console.log("waitToTopDeck changing to true.");
            this.setWaitToTopdeckCrystalBallLook(true);
          }
          this.setAsideFromLibrary(cards[i]);
        } else if (["Archive"].includes(this.latestAction)) {
          this.durationSetAsideFromLibrary(cards[i]);
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
   * Update method, discards all cards in the library from
   * the library to the graveyard.
   */
  processMovesTheirDeckToTheDiscardLine() {
    const libraryCopy = this.library.slice().reverse();
    while (libraryCopy.length > 0) {
      this.discardFromLibrary(libraryCopy.pop()!);
    }
  }

  /**
   * Update function.  Topdecks cards according to the provided information.
   * @param cards  - Array of card names to topdeck.
   * @param numberOfCards - Array of the amounts of each card to topdeck.
   */
  processMoveToLibraryLine(cards: string[], numberOfCards: number[]) {
    const isDurationEffect = this.isDurationEffect();
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (isDurationEffect) {
          this.topDeckFromInPlay(cards[i]);
        } else if (
          [
            "Sentry",
            "Lookout",
            "Sentinel",
            "Sea Chart",
            "Fortune Hunter",
            "Wandering Minstrel",
            "Hunter",
            "Cartographer",
            "Patrol",
            "Seer",
            "Fortune Teller",
          ].includes(this.latestAction)
        ) {
          this.topDeckFromSetAside(cards[i]);
        } else if (
          ["Harbinger", "Scavenger", "Replace"].includes(this.latestAction)
        ) {
          this.topDeckFromGraveyard(cards[i]);
        } else if (
          [
            "Artisan",
            "Bureaucrat",
            "Courtyard",
            "Pilgrim",
            "Secret Passage",
          ].includes(this.latestAction)
        ) {
          this.topDeckFromHand(cards[i]);
        }
      }
    }
  }

  /**
   * Processes deck changes that may occur as a result of Opponent's turns.
   * @param line - The given log line
   * @param act - The act from the line, if any.
   * @param cards - The card types on the given line.
   * @param numberOfCards - The amounts of each respective card type from the given line.
   */
  processOpponentLog(
    line: string,
    act: string,
    cards: string[],
    numberOfCards: number[]
  ) {
    switch (act) {
      case "plays":
        this.processOpponentPlaysLine();
        break;
      case "passes":
        this.handleIncomingPasses(line, act, cards, numberOfCards);
    }
  }

  /**
   * Update method handles deck state updates related to opponent 'plays' lines.
   * Needed to update latestPlaySource for opponent log lines.
   */
  processOpponentPlaysLine() {
    const nonHandPlaySource = this.checkForNonHandPlay();
    let latestPlaySource: string;
    if (nonHandPlaySource === "None") {
      latestPlaySource = "Hand";
    } else {
      latestPlaySource = nonHandPlaySource;
    }
    this.setLatestPlaySource(latestPlaySource);
  }

  /**
   * Update method handles passes of cards from one player to another.
   * @param cards - The cards being passed.
   * @param numberOfCards - The amounts of each card being passed
   * @param passDirection - If 'incoming' the pass is being made to the invoking deck,
   * otherwise it is being passed from the invoking deck.
   */
  processPassesLine(
    cards: string[],
    numberOfCards: number[],
    passDirection?: "incoming"
  ) {
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (passDirection === "incoming") {
          const handCopy = this.hand.slice();
          handCopy.push(cards[i]);
          this.setHand(handCopy);
          this.addCardToEntireDeck(cards[i]);
        } else {
          const index = this.hand.indexOf(cards[i]);
          if (index < 0) {
            throw new Error(`No ${cards[i]} in hand.`);
          }
          const handCopy = this.hand.slice();
          handCopy.splice(index, 1);
          this.setHand(handCopy);
          this.removeCardFromEntireDeck(cards[i]);
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
    let source: string;
    if (this.isDurationEffect()) {
      source = this.durationEffectCausedBy(line);
    } else {
      source = this.getCardsAndCountsFromLine(this.lineSource())[0][0];
    }
    const durationPlay = this.isDurationPlay(line);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (durationPlay) {
          if (source === "Mastermind") {
            if (this.masterMindEffectCount === 0) {
              //Find a duration with name Mastermind and sourceof Unset, and use it
              // as the source of the created duration.

              if (!this.isThereMastermindSourceAmbiguity()) {
                let sourceMastermind: Duration | undefined = undefined;
                for (let i = 0; i < this.activeDurations.length; i++) {
                  const duration = this.activeDurations[i];
                  if (
                    duration.name === "Mastermind" &&
                    duration.sourceOf === "unset"
                  ) {
                    sourceMastermind = duration;
                    break;
                  }
                }
                if (sourceMastermind === undefined)
                  throw Error("No source Mastermind found in activeDurations.");
                this.createDuration(
                  line,
                  cards[i] as DurationName,
                  sourceMastermind
                );
                // Create duration just pushed the duration to activeDurations.  Now get it
                // as the source of the sourceMastermind.
                const createdDuration =
                  this.activeDurations[this.activeDurations.length - 1];
                sourceMastermind.setAge(createdDuration.age);
                sourceMastermind.setSourceOf(
                  createdDuration.name + this.durationPlaySourceCounter++
                );
              } else throw Error("Cannot find a unique Mastermind source.");
            }
          } else {
            if (source === "Throne Room") {
              this.createDuration(
                line,
                cards[i] as DurationName,
                source + this.throneID
              );
            } else {
              this.createDuration(line, cards[i] as DurationName, source);
            }
          }
        }
        if (["Fortune Hunter", "Crystal Ball"].includes(source)) {
          this.playFromSetAside(cards[i]);
          this.setLatestPlaySource(source);
        } else if (["Throne Room", "Counterfeit"].includes(source)) {
          if (line.match(`${cards[i]} again`) === null) {
            this.play(cards[i]);
          }
          this.setLatestPlaySource(source);
        } else if (["Courier", "Vassal"].includes(source)) {
          this.playFromDiscard(cards[i]);
          this.setLatestPlaySource(source);
        } else if (source === "Mastermind") {
          this.masterMindEffectHandler(this, cards[i]);
        } else {
          this.play(cards[i]);
          this.setLatestPlaySource("Hand");
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
        if (
          [
            "Bandit",
            "Sage",
            "Sea Chart",
            "Farming Village",
            "Wandering Minstrel",
            "Hunter",
            "Hunting Party",
            "Patrol",
            "Seer",
            "Fortune Teller",
            "Advisor",
            "Envoy",
            "Journeyman",
          ].includes(this.latestAction)
        ) {
          this.setAsideFromLibrary(cards[i]);
        }
      }
    }
  }

  /**
   * Update function.  Adds starting cards to the library and entireDeck.
   * @param cards - The given card names to start with.
   * @param numberOfCards - The given card amounts to start with.
   */
  processStartsWithLine(cards: string[], numberOfCards: number[]) {
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        this.gainIntoLibrary(cards[i]);
      }
    }
  }

  /**
   * Update function. Trashes cards according the provided information.
   * @param cards - Array of the cards names to trash.
   * @param numberOfCards - Array of the amount of each card to trash.
   */
  processTrashesLine(line: string, cards: string[], numberOfCards: number[]) {
    let durationEffectCausedBy: string = "None";
    const isDurationEffect = this.isDurationEffect();
    if (isDurationEffect)
      durationEffectCausedBy = this.durationEffectCausedBy(line);
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        if (
          ["Sentry", "Bandit", "Lookout", "Sentinel", "Crystal Ball"].includes(
            this.latestAction
          )
        ) {
          this.trashFromSetAside(cards[i]);
        } else if (["Swindler", "Barbarian"].includes(this.latestAction)) {
          this.trashFromLibrary(cards[i]);
        } else if (
          (this.latestAction === "Treasure Map" &&
            this.lastEntryProcessed.match(" plays a Treasure Map.") !== null) ||
          ["Tragic Hero", "Mining Village"].includes(this.latestAction) ||
          ["Cabin Boy"].includes(durationEffectCausedBy)
        ) {
          this.trashFromInPlay(cards[i]);
        } else {
          this.trashFromHand(cards[i]);
        }
      }
    }
  }

  /**
   * An update reconciliation function that saves the extension from breaking when
   * the DOM Client does not append a sage reveal before appending the Sage draw.
   */
  reconcileMissingRevealsProcess() {
    const gameArr = getClientGameLog().split("\n");
    const previousLogEntry = gameArr[gameArr.length - 2];
    if (
      this.consecutiveReveals(previousLogEntry) &&
      previousLogEntry !== this.lastEntryProcessed
    ) {
      console.log(
        "Mismatch between the gameLog and logArchive... unequal sage reveals.. reconciling"
      );
      const [cards, numbers] = this.handleConsecutiveReveals(
        previousLogEntry,
        "reconcile"
      );
      this.addLogToLogArchive(previousLogEntry);
      this.processRevealsLine(cards, numbers);
    }
  }

  /**
   *  Removes the given card from the library and pushes it to the setAside zone.
   */
  setAsideFromLibrary(card: string) {
    if (this.debug)
      console.info(`Setting aside a ${card} with ${this.latestAction}.`);
    const index = this.library.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in library.`);
    } else {
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
   * If the given line is a Throne Room play, switches on the activeThroneRoom field and
   * assigns the value of the current log-line from the client to the throneMotherPadding field.
   * @param line - The given line.
   * @param act - The act from the current line.
   * @param cards - The array of cardNames from the current line.
   * @param numberOfCards - The array of cardAmounts from the current line.
   * @param logArchive - The current logArchive.
   */
  throneRoomInitializer(
    line: string,
    act: string,
    cards: string[],
    numberOfCards: number[],
    logArchive: string[]
  ) {
    if (
      !this.throneRoomActive &&
      line.match(`${this.playerNick} plays a Throne Room`) !== null &&
      line.match(" again") === null &&
      act === "plays" &&
      cards.length === 1 &&
      numberOfCards.length === 1 &&
      cards[0] === "Throne Room" &&
      numberOfCards[0] === 1
    ) {
      const logLines = Array.from(getLogScrollContainerLogLines());
      const lineToCompare = logLines[logArchive.length];
      const lastLinePaddingLeft = lineToCompare.style.paddingLeft;
      const paddingLeftStringWithoutPercent = lastLinePaddingLeft.substring(
        0,
        lastLinePaddingLeft.length - 1
      );
      const paddingLeftNumber = parseFloat(paddingLeftStringWithoutPercent);
      this.throneRoomActive = true;
      this.throneMotherPadding = paddingLeftNumber;
    }
  }

  /**
   * If an activeThroneRoom is ending, and updates the
   * throneID and throneRoomActive fields.  This method is needed as part
   * of the solution to identify how many throne room cards to remain in
   * play as a result of playing Durations.
   * @param logArchive - The current logArchive.
   */
  throneRoomTerminator(logArchive: string[]) {
    if (this.throneRoomActive) {
      const logLines = Array.from(getLogScrollContainerLogLines());
      const lineToCompare = logLines[logArchive.length];
      const lastLinePaddingLeft = lineToCompare.style.paddingLeft;
      const paddingLeftStringWithoutPercent = lastLinePaddingLeft.substring(
        0,
        lastLinePaddingLeft.length - 1
      );
      const paddingLeftNumber = parseFloat(paddingLeftStringWithoutPercent);
      if (paddingLeftNumber <= this.throneMotherPadding) {
        this.setThroneID(this.throneID + 1);
        this.setThroneRoomActive(false);
      }
    }
  }

  /**
   * Topdecks the card from the previous line.  Used to
   * handle Crystal Ball looks that get topdecked.
   */
  topdeckCardFromPreviousLine(): void {
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
    this.topDeckFromSetAside(prevLineCard);
  }

  /**
   * Checks graveyard field array to see if card is there.  If yes,
   * removes one instance of the card from the graveyard field array,
   * and adds one instance of the card to the library field array.
   * and adds it to the library.
   * @param card - The given card.
   */
  topDeckFromGraveyard(card: string) {
    if (this.debug) console.info(`Top decking ${card} from discard pile.`);
    const index = this.graveyard.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in discard pile.`);
    } else {
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
    if (this.debug) console.info(`Top decking ${card} from hand.`);
    const index = this.hand.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in hand.`);
    } else {
      const libraryCopy = this.library.slice();
      const handCopy = this.hand.slice();
      libraryCopy.push(card);
      handCopy.splice(index, 1);
      this.setLibrary(libraryCopy);
      this.setHand(handCopy);
    }
  }

  /**
   * Removes an instance of the given card from inPlay and adds one instance
   * to the library.  Throws an error if the given card is not in play.
   * @param card -The given card.
   */
  topDeckFromInPlay(card: string) {
    if (this.debug) console.info(`Top decking ${card} from inPlay.`);
    const index = this.inPlay.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in inPlay.`);
    } else {
      const libraryCopy = this.library.slice();
      const inPlayCopy = this.inPlay.slice();
      libraryCopy.push(card);
      inPlayCopy.splice(index, 1);
      this.setLibrary(libraryCopy);
      this.setInPlay(inPlayCopy);
    }
  }

  /**
   * Checks if the given card is in the setAside zone.  Then it
   * removes one instance of that card from the setAside zone
   * and adds it to the library zone.
   * @param card - The given card.
   */
  topDeckFromSetAside(card: string): void {
    if (this.debug) console.info(`Top decking ${card} from setAside.`);
    const index = this.setAside.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in setAside.`);
    } else {
      const libraryCopy = this.library.slice();
      const setAsideCopy = this.setAside.slice();
      libraryCopy.push(card);
      setAsideCopy.splice(index, 1);
      this.setLibrary(libraryCopy);
      this.setSetAside(setAsideCopy);
    }
  }

  /**
   * Topdecks card from the previous line if it's a Crystal Ball look that
   * did not play, trash, or discard the looked at card.
   */
  topDeckLookedAtCardIfNeeded() {
    if (
      this.latestAction === "Crystal Ball" &&
      this.checkForLook(this.lastEntryProcessed, "Crystal Ball")
    ) {
      const gameLogElement = Array.from(getLogScrollContainerLogLines());
      const currentLine = gameLogElement[this.logArchive.length];
      const prevLine = gameLogElement[this.logArchive.length - 1];
      const currentPadding = parseInt(
        currentLine!.style.paddingLeft.slice(
          0,
          currentLine!.style.paddingLeft.length - 1
        )
      );
      const previousPadding = parseInt(
        prevLine!.style.paddingLeft.slice(
          0,
          prevLine!.style.paddingLeft.length - 1
        )
      );
      if (currentPadding < previousPadding) {
        this.topdeckCardFromPreviousLine();
      }
    }
    this.setWaitToTopdeckCrystalBallLook(false);
  }

  /**
   * Checks hand field array to see if given card is there.  If yes,
   * removes an instance of that card from the hand field array and,
   * adds an instance of that card to the trash field array.
   * @param card - The given card.
   */
  trashFromHand(card: string): void {
    if (this.debug) console.info(`Trashing ${card} from hand.`);
    const index = this.hand.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in hand.`);
    } else {
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
   * Checks inPlay field to see if the given card is there.  If so,
   * removes an instance of that card from the inPlay field and adds
   * an instance to the trash field.
   * @param card - The given card.
   */
  trashFromInPlay(card: string) {
    if (this.debug) console.info(`Trashing ${card} from inPlay.`);
    const index = this.inPlay.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in play.`);
    } else {
      const trashCopy = this.trash.slice();
      const inPlayCopy = this.inPlay.slice();
      trashCopy.push(card);
      inPlayCopy.splice(index, 1);
      this.setTrash(trashCopy);
      this.setInPlay(inPlayCopy);
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
    if (this.debug) console.info(`Trashing ${card} from library.`);
    const index = this.library.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in library.`);
    } else {
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
    if (this.debug) console.info(`Trashing ${card} from setAside.`);
    const index = this.setAside.indexOf(card);
    if (index < 0) {
      throw new Error(`No ${card} in setAside.`);
    } else {
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
    // let lineIsCausedByDuration: boolean = false;
    log.forEach((line) => {
      if (this.debug) console.group(line);

      // const lineSource = this.lineSource();
      // lineIsCausedByDuration = lineSource
      //   ? lineSource.match(`${this.playerNick} starts their turn.`) !== null
      //   : false;
      // const lineIsDurationResolution = this.isDurationResolutionLine(line);
      // if (lineIsCausedByDuration && !lineIsDurationResolution) {
      //   console.log("Duration Processing");
      //   // Here, instead of processing the log, we temporarily store the log to be processed later,
      //   // when we have the required context information, namely, which duration is causing the logs.
      //   const durationLogsCopy = this.durationLogs.slice();
      //   durationLogsCopy.push(line);
      //   this.setDurationLogs(durationLogsCopy);
      // } else if (lineIsCausedByDuration && lineIsDurationResolution) {
      //   // Here we process the delayed Duration logs
      //   const durationLogsCopy = this.durationLogs.slice();
      //   durationLogsCopy.push(line);
      //   this.setDurationLogs(durationLogsCopy);
      //   console.log("line is a duration resolution");
      //   this.durationLogs.forEach((line) => {
      //     const { act, cards, numberOfCards } = this.getActCardsAndCounts(line);
      //     if (this.isConsecutiveMerchantBonus(line)) {
      //       this.handleConsecutiveMerchantBonus();
      //     }
      //     if (this.logEntryAppliesToThisDeck(line)) {
      //       this.shuffleAndCleanUpIfNeeded(line);
      //       this.drawLookedAtCardIfNeeded(act);
      //       this.processDeckChanges(line, act, cards, numberOfCards);
      //     } else {
      //       this.processOpponentLog(line, act, cards, numberOfCards);
      //     }
      //     console.log("processing is complete for duration effects.");
      //     this.setDurationLogs([]);
      //   });
      // } else
      {
        const { act, cards, numberOfCards } = this.getActCardsAndCounts(line);
        if (this.isConsecutiveMerchantBonus(line)) {
          this.handleConsecutiveMerchantBonus();
        }
        if (this.logEntryAppliesToThisDeck(line)) {
          //If throneRoomActive is true, compare the current padding
          // with the mother value.  If it's less than or equal to the mother value
          // switch throneRoomActive off, and increment ThroneID
          this.throneRoomTerminator(this.logArchive);

          // If it's a throne room play and throneRoomActive is false,
          // collect the paddingLeft from the current line, and switch throneRoomActive on.
          this.throneRoomInitializer(
            line,
            act,
            cards,
            numberOfCards,
            this.logArchive
          );
          //need a function that checks
          this.shuffleAndCleanUpIfNeeded(line);
          this.assignBargeLifespanIfNeeded(act);
          this.topDeckLookedAtCardIfNeeded();
          this.drawLookedAtCardIfNeeded(act);
          this.processDeckChanges(line, act, cards, numberOfCards);
        } else {
          this.processOpponentLog(line, act, cards, numberOfCards);
        }
        this.updateArchives(line);
        this.updateVP();
        this.setLatestAction(this.getMostRecentAction(this.logArchive));
        this.setLatestPlay(this.getMostRecentPlay(this.logArchive));
        // Check for logArchive Accuracy
      }
      if (this.debug) console.groupEnd();
    });
    if (
      // lineIsCausedByDuration &&
      this
        .checkLogAccuracy
        // lineIsCausedByDuration
        ()
    ) {
      store.dispatch(setError(null));
    } else {
      console.error("logArchive and gameLog lengths differ");
      store.dispatch(setError("logArchive and gameLog lengths differ"));
    }
  }
}
