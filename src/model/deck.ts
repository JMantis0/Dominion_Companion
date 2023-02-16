/**
 * Class for a Deck object used to track a
 * player's Deck state.
 */
export class Deck {
  entireDeck: Array<string> = [];
  playerName: string = "";
  abbrvName: string = "";
  currentVP: number = 3;
  kingdom: Array<string> = [];
  library: Array<string> = [];
  graveyard: Array<string> = [];
  inPlay: Array<string> = [];
  hand: Array<string> = [];
  trash: Array<string> = [];
  lastEntryProcessed: string = "";
  logArchive: Array<string> = [];
  DOMLog: Array<string> = [];

  constructor(playerName: string, abbrvName: string, kingdom: Array<string>) {
    this.playerName = playerName;
    this.kingdom = kingdom;
    this.abbrvName = abbrvName;
    for (let i = 0; i < 7; i++) {
      if (i < 3) {
        this.entireDeck.push("Estate");
        this.library.push("Estate");
      }
      this.entireDeck.push("Copper");
      this.library.push("Copper");
    }
  }
  setPlayerName(name: string) {
    this.playerName = name;
  }
  getPlayerName() {
    return this.playerName;
  }
  setAbbvbName(abbrvName: string) {
    this.abbrvName = abbrvName;
  }
  getAbbrvName() {
    return this.abbrvName;
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

  setDOMlog(DOMlog: Array<string>) {
    this.DOMLog = DOMlog;
  }
  getDOMlog() {
    return this.DOMLog;
  }

  getEntireDeck() {
    return this.entireDeck;
  }

  setEntireDeck(deck: Array<string>) {
    this.entireDeck = deck;
  }

  update(log: Array<string>) {
    console.group("Deck Update Log for " + this.playerName);
    const actionArray = [
      "shuffles their deck",
      "gains",
      "draws",
      "discards",
      "plays",
      "trashes",
      "looks at",
      "topdecks",
    ];
    const pluralVariantCandidates = [
      "Smithy",
      "Sentry",
      "Laboratory",
      "Library",
      "Dutchy",
    ];

    const handleTreasureLine = (line: string): Array<number> => {
      // Inside this if, this means that the player is in a play treasure phase.
      // The two lines must be compared to see how many additional treasures must be
      // processed
      const prevLine = this.lastEntryProcessed;
      const treasures = ["Copper", "Silver", "Gold"];

      // get the total number of each treasure that was played on the last line
      const numberOfPrevCards: Array<number> = [];
      treasures.forEach((treasure) => {
        if (prevLine.match(treasure)) {
          this.logArchive.pop(); // !!!important.  Much work was done to achieve this, to keep the archivelog accurate.
          // To account for 2 digit numbers
          const twoDigits = prevLine[prevLine.indexOf(treasure) - 3].match(/\d/)
            ? 1
            : 0;

          const amountChar = prevLine.substring(
            prevLine.indexOf(treasure) - 2 - twoDigits,
            prevLine.indexOf(treasure) - 1
          );
          let amount = 0;
          if (amountChar == "n" || amountChar == "a") {
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
          // To account for 2 digit numbers
          const twoDigits = 0;
          //  line[line.indexOf(treasure) - 3].match(/\d/)
          //   ? 1
          //   : 0;

          const amountChar = line.substring(
            line.indexOf(treasure) - 2 - twoDigits,
            line.indexOf(treasure) - 1
          );
          let amount = 0;
          if (amountChar == "n" || amountChar == "a") {
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

      console.log("Amounts to play for copper,silver,gold", amountsToPlay);
      return amountsToPlay;
    };

    log.forEach((line, idx, array) => {
      console.log("line being processed: ", line);
      let act = "";
      let cards: Array<string> = [];
      let numberOfCards: Array<number> = [];

      if (
        this.lastEntryProcessed.match("plays") &&
        this.lastEntryProcessed.match(/Coppers?|Silvers?|Golds?|/) &&
        line.match("plays") &&
        line.match(/Coppers?|Silvers?|Golds?|/)
      ) {
        console.log("Handling a treasher line");
        numberOfCards = handleTreasureLine(line);
        act = "plays";
        cards = ["Copper", "Silver", "Gold"];
      } else {
        actionArray.forEach((action) => {
          if (line.match(action)) {
            act = action;
          }
        });

        this.kingdom.forEach((card) => {
          let pluralVariant = "";
          let pluralVariantBoolean = false;
          if (pluralVariantCandidates.indexOf(card) >= 0) {
            pluralVariant = card.substring(0, card.length - 1) + "ies";
            if (line.match(pluralVariant)) pluralVariantBoolean = true;
          }
          if (
            pluralVariantBoolean ? line.match(pluralVariant) : line.match(card)
          ) {
            const twoDigits = line[line.indexOf(card) - 3].match(/\d/) ? 1 : 0;
            const amountChar = line.substring(
              pluralVariantBoolean
                ? line.indexOf(pluralVariant) - 2 - twoDigits
                : line.indexOf(card) - 2 - twoDigits,
              pluralVariantBoolean
                ? line.indexOf(pluralVariant) - 1
                : line.indexOf(card) - 1
            );
            let amount = 0;
            if (amountChar == "n" || amountChar == "a") {
              amount = 1;
            } else {
              amount = parseInt(amountChar);
            }
            cards.push(card);
            numberOfCards.push(amount);
          }
        });
      }

      switch (act) {
        case "shuffles their deck":
          {
            const cleanUp =
              array.length > idx + 1
                ? this.checkForCleanUp(array[idx + 1])
                : false;
            const cellarDraws = this.checkForCellarDraw();
            if (cleanUp && !cellarDraws) this.cleanup();
            this.shuffleGraveYardIntoLibrary();
          }
          break;
        case "gains":
          {
            const mineGain = this.checkForMineGain();
            for (let i = 0; i < cards.length; i++) {
              for (let j = 0; j < numberOfCards[i]; j++) {
                if (mineGain) {
                  this.gainIntoHand(cards[i]);
                } else {
                  this.gain(cards[i]);
                }
                this.addCardToEntireDeck(cards[i]);
              }
            }
          }
          break;
        case "draws":
          {
            const fiveDrawsOccured = this.checkForCleanUp(line);
            const shuffleOccured = this.checkForShuffle(
              this.lastEntryProcessed
            );
            const cellarDraws = this.checkForCellarDraw();
            if (fiveDrawsOccured && !shuffleOccured && !cellarDraws) {
              console.log(
                "Current line calls for cleanup, and previous line wasnt a shuffle.  Need to clean up before drawing"
              );
              this.cleanup();
            } else {
              if (cellarDraws)
                console.log("five draws occured but iit was from a cellar");
              if (shuffleOccured)
                console.log(
                  "Current line calls for cleanup, but last line was a shuffle, and cleanup already occured."
                );
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
            const sentryDiscard = this.checkForSentryDiscard();
            const banditDiscard = this.checkForBanditDiscard();
            const vassalDiscard = this.checkForVassalDiscard();
            for (let i = 0; i < cards.length; i++) {
              for (let j = 0; j < numberOfCards[i]; j++) {
                if (sentryDiscard || banditDiscard || vassalDiscard) {
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
                  console.log("Throne room play.  No deck change.");
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
            const sentryTrash = this.checkForSentryTrash();
            const banditTrash = this.checkForBanditTrash();
            for (let i = 0; i < cards.length; i++) {
              for (let j = 0; j < numberOfCards[i]; j++) {
                if (sentryTrash || banditTrash) {
                  console.log("Trash from lib");
                  this.trashFromLibrary(cards[i]);
                } else {
                  console.log("Trash from hand");
                  this.trashFromHand(cards[i]);
                }
                this.removeCardFromEntireDeck(cards[i]);
              }
            }
          }
          break;
        case "topdecks":
          {
            const harbingerTopDeck = this.checkForHarbingerTopDeck();
            for (let i = 0; i < cards.length; i++) {
              for (let j = 0; j < numberOfCards[i]; j++) {
                if (harbingerTopDeck) {
                  this.topDeckFromGraveyard(cards[i]);
                }
              }
            }
          }
          break;
        default:
          console.log("no matching action for ", act);
      }
      this.lastEntryProcessed = line;
      this.logArchive.push(line);
    });
    console.groupEnd();
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
      this.library.splice(index, 1);
      this.hand.push(card);
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
      this.hand.splice(index, 1);
      this.inPlay.push(card);
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
      throw new Error("No ${card} in the decklist");
    }
  }

  /**
   * Randomizes the order of the library array field.
   * Might be obsolete.  Shuffling is a superficiality.
   */
  shuffle() {
    //console.log("action Shuffling discard into deck");
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
      this.graveyard.splice(index, 1);
      this.library.push(card);
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
      console.log(
        `ACTION Shuffling ${this.graveyard[i]} from graveyard into library`
      );
      this.library.push(this.graveyard[i]);
      this.graveyard.splice(i, 1);
      this.shuffle();
    }
  }

  /**
   * Iterates over all the card instances in the hand and inPlay field arrays.
   * For each iteration, the card instance is added to the graveyard array and removed
   * from the hand and/or inPlay arrays and added to the graveyard array.
   */
  cleanup() {
    console.log("Cleaning up");
    let i = this.inPlay.length - 1;
    let j = this.hand.length - 1;
    for (i; i >= 0; i--) {
      console.log(
        `ACTION Cleaning ${this.inPlay[i]} from in play into into discard`
      );
      this.graveyard.push(this.inPlay[i]);
      this.inPlay.splice(i, 1);
    }
    for (j; j >= 0; j--) {
      ////console.log(`action Cleaning ${this.hand[j]} from hand into discard`);
      this.graveyard.push(this.hand[j]);
      this.hand.splice(j, 1);
    }
  }

  /**
   * Takes a card and pushes it to the graveyard field array.
   * @param card = The given card.
   */
  gain(card: string) {
    console.log(`action Gaining ${card} into discard`);

    this.graveyard.push(card);
  }

  /**
   * Takes a card and pushes it to the hand field array.
   * @param card - The given card.
   */
  gainIntoHand(card: string) {
    ////console.log(`action Gaining ${card} into hand`);
    this.hand.push(card);
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
      ////console.log(`action Topdecking ${this.hand[index]}`);
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
      console.log(
        `ACTION Discarding ${this.hand[index]} from hand into discard}`
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
      console.log(
        `ACTION dDscarding ${this.library[index]} from library into discard}`
      );
      this.graveyard.push(this.library[index]);
      this.library.splice(index, 1);
    } else {
      throw new Error(`No ${card} in library.`);
    }
  }

  /**
   * Checks hand field array to see if given card is there.  If yes,
   * remvoes an instance of that card from the hand field array and,
   * addes an instance of that card tothe trash field array.
   * @param card - The given card.
   */
  trashFromHand(card: string) {
    console.log(card);
    const index = this.hand.indexOf(card);
    if (index > -1) {
      console.log(`Trashing ${this.hand[index]} from hand}`);
      this.trash.push(this.hand[index]);
      this.hand.splice(index, 1);
    } else {
      throw new Error(`No ${card} in hand.`);
    }
  }

  /**

   * Checks if the given card is in the library field array. If yes,
   * then removes one instance of the card from the library field array
   * and adds one insttance of the card to the trash field array.
   * @param card - The given card.

   */
  trashFromLibrary(card: string) {
    const index = this.library.indexOf(card);
    if (index > -1) {
      console.log(`Trashing ${this.library[index]} from library`);
      this.trash.push(this.library[index]);
      this.library.splice(index, 1);
    } else {
      throw new Error(`No ${card} in library`);
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
    let len = this.logArchive.length;
    return this.logArchive[len - 2].match(" plays a Mine") !== null;
  }
  /**
   * Checks the current line to see if there are exactly five draws
   * occuring on the line.
   * Purpose:  Control flow for updating deck.  5 draws are occuring, it
   * may be necessary to a cleanup before drawing.
   * @param line
   * @returns
   */
  checkForCleanUp = (line: string) => {
    let needCleanUp = false;
    let drawCount = 0;
    const lineCopyWithoutNickname = line.slice(this.getAbbrvName().length);
    if (lineCopyWithoutNickname.match(/\ban?\b/g)) {
      drawCount += lineCopyWithoutNickname.match(/\ban?\b/g)!.length;
    }
    (lineCopyWithoutNickname.match(/\d/g) || []).forEach((n) => {
      drawCount += parseInt(n);
    });
    console.log("drawCount", drawCount);
    if (drawCount == 5) {
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
    const len = this.logArchive.length;
    return (
      (len > 3 &&
        this.logArchive[len - 4].match(" plays a Harbinger") !== null) ||
      (len > 4 &&
        this.logArchive[len - 5].match(" plays a Harbinger") !== null &&
        this.logArchive[len - 4].match(" shuffles their deck") !== null)
    );
  }

  /**
   * Checks the logArchive to see if the current line's discard activity
   * was triggered by a Sentry.
   * Purpose: Control flow of deck updates: discards triggered by Sentry must
   * be discarded from the library field array.
   * @returns - Boolean for whether the current line's discard was triggered by a Sentry.
   */
  checkForSentryDiscard() {
    const len = this.logArchive.length;
    return (
      // test case 1 (no trashes no shuffle)
      this.logArchive[len - 4].match(" plays a Sentry") !== null ||
      // test case 2 (no trashes yes shuffle)
      (this.logArchive[len - 5].match(" plays a Sentry") !== null &&
        this.logArchive[len - 4].match(" shuffles their deck") !== null) ||
      //  test case 3 (yes trash with no shuffle)
      (this.logArchive[len - 5].match(" plays a Sentry") !== null &&
        this.logArchive[len - 1].match(" trashes ") !== null) ||
      // test case 4 ( yes trash and shuffle )
      (this.logArchive[len - 6].match(" plays a Sentry") !== null &&
        this.logArchive[len - 5].match(" shuffles their deck") !== null &&
        this.logArchive[len - 1].match(" trashes ") !== null)
    );
  }

  /**
   * Checks the logArchive to see if the current line's Trash activity
   * was triggered by a Sentry.
   * @returns Boolean for whether the current line's trash was triggered by a Sentry.
   *
   */
  checkForSentryTrash() {
    const len = this.logArchive.length;
    return (
      // case no shuffle
      this.logArchive[len - 4].match(" plays a Sentry") !== null ||
      // case yes shuffle
      (this.logArchive[len - 5].match(" plays a Sentry") !== null &&
        // shuffle occursjust after draw, before looks at
        (this.logArchive[len - 2].match(" shuffles their deck") !== null ||
          //shuffle occurs before draw
          this.logArchive[len - 4].match(" shuffles their deck") !== null))
    );
  }

  /**
   * Checks to see if the trash activity of the current line was triggered
   * by an opponent's Bandit.  Cards trashed in this way must be removed from
   * the library field array.
   * @returns - Boolean for whether the trash activity was triggered by a Bandit.
   */
  checkForBanditTrash = () => {
    let banditTrash = false;
    let len = this.logArchive.length;
    if (this.logArchive[len - 1].match(" reveals ") !== null) {
      banditTrash = true;
    }
    return banditTrash;
  };

  /**
   * Checks to see if the current discard activity of the current line
   * was triggered by an opponent's Bandit. Cards discarded this way must
   * be removed from the library field array.
   * @returns - Boolean for whether the discard activity was triggered by a Bandit.
   */
  checkForBanditDiscard = () => {
    let banditDiscard = false;
    let len = this.logArchive.length;
    if (
      // Case with trash
      (this.logArchive[len - 1].match(" trashes ") !== null &&
        this.logArchive[len - 2].match(" reveals ") !== null) ||
      // Case with no trash
      this.logArchive[len - 1].match(" reveals ") !== null
    ) {
      banditDiscard = true;
    }
    return banditDiscard;
  };

  /**
   * Checks to see if the current line's play activity was
   * triggered by a Vassal.
   * Purpose: To determine which field array to remove card from.
   * @returns - Boolean for whether the current line play activity is triggered by a Vassal.
   */
  checkForVassalPlay() {
    let vassalPlay: boolean = false;
    if (this.logArchive.length > 2) {
      vassalPlay =
        this.logArchive[this.logArchive.length - 3].match(" plays a Vassal") !==
        null;
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
    return this.logArchive[this.logArchive.length - 2].match(" plays a Vassal");
  }
}
