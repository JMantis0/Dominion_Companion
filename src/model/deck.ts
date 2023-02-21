import { getLogScrollContainerLogLines } from "../content/contentFunctions";

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
  setAside: Array<string> = [];
  waitToShuffle: boolean = false;

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

  update(log: Array<string>) {
    // console.group("Deck Update Log for " + this.playerName);

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
          // const removed = this.logArchive.pop(); // !!!important.  Much work was done to achieve this, to keep the archivelog accurate.
          // To account for 2 digit numbers
          // console.error("popping log off", removed);
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

      const removed = this.logArchive.pop(); // keep duplicate entries out.
      console.error("popping log off", removed);
      return amountsToPlay;
    };

    const handleRepeatBuyGain = (
      currentLine: string
      // , card: string
    ): number => {
      let ammendedGainAmount: number;
      const prevLine = this.logArchive.slice().pop();
      const lastSpaceIndex = prevLine?.lastIndexOf(" ");
      const secondLastSpaceIndex = prevLine
        ?.slice(0, lastSpaceIndex)
        .lastIndexOf(" ");

      const lsi = currentLine.lastIndexOf(" ");
      const slsi = currentLine.slice(0, lsi).lastIndexOf(" ");

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

      if (currentLine.substring(slsi + 1, lsi).match(/\ban?\b/) !== null) {
        currCount = 1;
      } else {
        currCount = parseInt(currentLine.substring(slsi + 1, lsi));
      }

      ammendedGainAmount = currCount - prevCount;
      return ammendedGainAmount;
    };

    log.forEach((line, idx, array) => {
      if (
        // Filters out opponent logs that dont need to be processed
        line.slice(0, this.abbrvName.length) === this.abbrvName ||
        line.match(this.playerName) !== null
      ) {
        // If previous line was shuffle this section performs a
        // cleanup if necessary before the shuffle occurs.
        if (this.waitToShuffle) {
          const cleanUp = this.checkForCleanUp(line);
          console.log("shuffle occuring.  cleanup needed is :", cleanUp);
          const cellarDraws = this.checkForCellarDraw();
          if (cleanUp && !cellarDraws) this.cleanup();
          this.shuffleGraveYardIntoLibrary();
          this.waitToShuffle = false;
        }

        console.group(line);
        let act = "";
        let cards: Array<string> = [];
        let numberOfCards: Array<number> = [];

        if (
          this.lastEntryProcessed.match("plays") &&
          this.lastEntryProcessed.match(/Coppers?|Silvers?|Golds?/) &&
          line.match("plays") &&
          line.match(/Coppers?|Silvers?|Golds?/)
        ) {
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
              pluralVariantBoolean
                ? line.match(pluralVariant)
                : line.match(card)
            ) {
              const twoDigits: number = (
                pluralVariantBoolean
                  ? line[line.indexOf(pluralVariant) - 3].match(/\d/) !== null
                  : line[line.indexOf(card) - 3].match(/\d/) !== null
              )
                ? 1
                : 0;
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

          // Section for handling repeat buys and avoiding overgaining
          if (act === "gains" && cards.length === 1) {
            const thisLineBuyAndGains = this.checkForBuyAndGain(line, cards[0]);
            const lastLineBuyAndGains = this.checkForBuyAndGain(
              this.logArchive[this.logArchive.length - 1],
              cards[0]
            );
            if (lastLineBuyAndGains && thisLineBuyAndGains)
              numberOfCards[0] = handleRepeatBuyGain(line);
          }
        }
        if (this.logArchive.length >= 1) {
          const len = this.logArchive.length;
          const prevLineLibraryLook = this.checkForLibraryLook(
            this.logArchive[len - 1]
          );
          if (prevLineLibraryLook && act !== "aside with Library") {
            const prevLine = this.logArchive[len - 1];
            const prevLineCard = prevLine.substring(
              prevLine.lastIndexOf(" ") + 1,
              prevLine.length - 1
            );
            console.log(
              "Previous line was a library look.  This line is not a set aside."
            );
            console.log("Drawing previous line's card", prevLineCard);
            this.draw(prevLineCard);
          }
        }

        switch (act) {
          case "shuffles their deck":
            {
              this.waitToShuffle = true;
            }

            break;
          case "gains":
            {
              const artisanGain = this.checkForArtisanGain();
              const mineGain = this.checkForMineGain();
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  if (mineGain || artisanGain) {
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
                        console.error(
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
              const fiveDrawsOccured = this.checkForCleanUp(line);
              const shuffleOccured = this.checkForShuffle(
                this.lastEntryProcessed
              );
              const cellarDraws = this.checkForCellarDraw();
              if (fiveDrawsOccured && !shuffleOccured && !cellarDraws) {
                this.cleanup();
              } else {
                if (cellarDraws)
                  console.log("5 draws came from a cellar, dont clean up.");
                if (shuffleOccured)
                  // 5 draws were from cellar, not from an end of turn.
                  // 5 draws took place this line, but last line was a shuffle, and cleanup already occured.
                  null;
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
              const libraryDiscard = this.checkForLibraryDiscard(line);
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  if (libraryDiscard) {
                    this.discardFromLibrary(cards[i]);
                    const setAsideIdx = this.setAside.indexOf(cards[i]);
                    this.setAside.splice(setAsideIdx, 1);
                  } else if (sentryDiscard || banditDiscard || vassalDiscard) {
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
              const artisanTopDeck = this.checkForArtisanTopDeck();
              const harbingerTopDeck = this.checkForHarbingerTopDeck();
              for (let i = 0; i < cards.length; i++) {
                for (let j = 0; j < numberOfCards[i]; j++) {
                  if (harbingerTopDeck) {
                    this.topDeckFromGraveyard(cards[i]);
                  } else if (artisanTopDeck) {
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
                console.log("It's a library look");
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
      } else {
        null;
        //  Opponent log entryies fall here
        if (
          this.lastEntryProcessed.match("plays") &&
          this.lastEntryProcessed.match(/Coppers?|Silvers?|Golds?/) &&
          line.match("plays") &&
          line.match(/Coppers?|Silvers?|Golds?/)
        ) {
          //  If playing with no animations, need this to pop off opponent treasure plays.
          handleTreasureLine(line);
        }
      }

      this.lastEntryProcessed = line;
      if (line !== "Between Turns") {
        this.logArchive.push(line);
      }
      console.groupEnd();
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
      console.info(`Drawing ${card} from library into hand.`);
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
      console.info(`Playing ${card} from hand into play.`);
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
      throw new Error(`No ${card} in the decklist`);
    }
  }

  /**
   * Randomizes the order of the library array field.
   * Might be obsolete.  Shuffling is a superficiality.
   */
  shuffle() {
    console.info("Shuffling library into a random order.");
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
      console.info(`Top decking ${card} from discard pile.`);
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
    console.group("Cleaning up:");
    let i = this.inPlay.length - 1;
    let j = this.hand.length - 1;
    for (i; i >= 0; i--) {
      console.info(
        `Moving ${this.inPlay[i]} from in play into into discard pile.`
      );
      this.graveyard.push(this.inPlay[i]);
      this.inPlay.splice(i, 1);
    }
    for (j; j >= 0; j--) {
      console.info(`Moving ${this.hand[j]} from hand into discard pile.`);
      this.graveyard.push(this.hand[j]);
      this.hand.splice(j, 1);
    }
    console.groupEnd();
  }

  /**
   * Takes a card and pushes it to the graveyard field array.
   * @param card = The given card.
   */
  gain(card: string) {
    console.info(`Gaining ${card} into discard pile.`);
    this.graveyard.push(card);
  }

  /**
   * Takes a card and pushes it to the hand field array.
   * @param card - The given card.
   */
  gainIntoHand(card: string) {
    console.info(`Gaining ${card} into hand.`);
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
   * Checks hand field array to see if given card is there.  If yes,
   * remvoes an instance of that card from the hand field array and,
   * addes an instance of that card tothe trash field array.
   * @param card - The given card.
   */
  trashFromHand(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      console.info(`Trashing ${this.hand[index]} from hand.`);
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
      console.info(`Trashing ${this.library[index]} from library.`);
      this.trash.push(this.library[index]);
      this.library.splice(index, 1);
    } else {
      throw new Error(`No ${card} in library`);
    }
  }

  setAsideWithLibrary(card: string) {
    console.info(`Setting aside a ${card} with Library`);
    this.setAside.push(card);
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
    if (drawCount == 5) {
      needCleanUp = true;
    }
    console.log("Checking for cleanup.  DrawCount = ", drawCount);
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
  checkForSentryDiscard(): boolean {
    let isSentryDiscard: boolean = false;
    const len = this.logArchive.length;

    if (len >= 6) {
      // test case 4 ( yes trash and shuffle )
      if (
        this.logArchive[len - 6].match(" plays a Sentry") !== null &&
        this.logArchive[len - 5].match(" shuffles their deck") !== null &&
        this.logArchive[len - 1].match(" trashes ") !== null
      ) {
        isSentryDiscard = true;
      }
    }
    if (len >= 5) {
      if (
        // test case 2 (no trashes yes shuffle)
        (this.logArchive[len - 5].match(" plays a Sentry") !== null &&
          this.logArchive[len - 4].match(" shuffles their deck") !== null) ||
        //  test case 3 (yes trash with no shuffle)
        (this.logArchive[len - 5].match(" plays a Sentry") !== null &&
          this.logArchive[len - 1].match(" trashes ") !== null) ||
        // test case 5 shuffle after draw but before lookat, no trash.
        (this.logArchive[len - 5].match(" plays a Sentry") !== null &&
          this.logArchive[len - 2].match(" shuffles their deck") !== null &&
          this.logArchive[len - 1].match(" looks at ") !== null)
      ) {
        isSentryDiscard = true;
      }
    }
    if (len >= 4) {
      if (this.logArchive[len - 4].match(" plays a Sentry") !== null) {
        isSentryDiscard = true;
      }
    }

    return isSentryDiscard;
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
    const len = this.logArchive.length;
    if (len > 3) {
      vassalPlay =
        (this.logArchive[len - 3].match(" plays a Vassal") !== null &&
          this.logArchive[len - 1].match(" discards a ") !== null) ||
        (this.logArchive[len - 4].match(" plays a Vassal") !== null &&
          this.logArchive[len - 2].match(" shuffles their deck") !== null &&
          this.logArchive[len - 1].match(" discards a ") !== null);
    }
    if (vassalPlay) {
      let logScrollElement = getLogScrollContainerLogLines();
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

      if (currentLinePaddingNumber < previousLinePaddingNumber) {
        vassalPlay = false;
      } else {
      }
    }
    console.groupEnd();
    return vassalPlay;
  }

  /**
   * Checks to see if the current line's discard activity was
   * triggered by a Vassal.
   * Purpose: To determine which field array to discard card from.
   * @returns - Boolean for whether the current line discard activity is triggered by a Vassal.
   */
  checkForVassalDiscard() {
    let vassalDiscard: boolean;
    let len = this.logArchive.length;
    if (
      this.logArchive[len - 2].match(" plays a Vassal") !== null ||
      (this.logArchive[len - 3].match(" plays a Vassal") !== null &&
        this.logArchive[len - 1].match(" shuffles their deck") !== null)
    ) {
      vassalDiscard = true;
    } else vassalDiscard = false;

    return vassalDiscard;
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
      line.match(` ${card.substring(0, card.length - 1)}`)
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
    if (this.logArchive.slice().pop()?.match(` buys a ${currentCard}`)) {
      previousLineBoughtCurrentLineCard = true;
    } else {
      previousLineBoughtCurrentLineCard = false;
    }
    return previousLineBoughtCurrentLineCard;
  };

  /**
   * Checks the logArchive to determine if the current line gain activity
   * was triggered by an Artisan.
   * @returns Boolean for whether the urrent line gain activity
   * was triggered by an Artisan
   */
  checkForArtisanGain = (): boolean => {
    let isArtisanGain: boolean;
    if (this.logArchive.slice().pop()?.match(" plays an Artisan") !== null)
      isArtisanGain = true;
    else isArtisanGain = false;
    return isArtisanGain;
  };

  /**
   * Checks the logArchive to determine if the current line top deck activity
   * was triggered by an Artisan.
   * @returns Boolean for whether the urrent line top deck activity.
   */
  checkForArtisanTopDeck = (): boolean => {
    let artisanTopDeck: boolean;
    const len = this.logArchive.length;
    if (this.logArchive[len - 2].match(" plays an Artisan") !== null) {
      artisanTopDeck = true;
    } else artisanTopDeck = false;
    return artisanTopDeck;
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
      let playFound: boolean = false;
      for (let i = this.logArchive.length - 1; i >= 0; i--) {
        let logEntry = this.logArchive[i];
        if (logEntry.match(" plays a ") !== null) {
          playFound = true;
          if (logEntry.match(" plays a Library") !== null) {
            libraryLook = true;
          } else {
            libraryLook = false;
          }
        }
        if (playFound) {
          break;
        }
      }
      if (!playFound) {
        throw new Error(
          "All log archive entries checked and no entry containing the substring ' play a ' found."
        );
      }
    } else {
      libraryLook = false;
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
      let playFound: boolean = false;
      for (let i = this.logArchive.length - 1; i >= 0; i--) {
        let currentLine = this.logArchive[i];
        if (currentLine.match(" plays a ") !== null) {
          playFound = true;
          if (currentLine.match(" plays a Library") !== null) {
            libraryDiscard = true;
          } else {
            libraryDiscard = false;
          }
        }
        if (playFound) {
          break;
        }
      }
      if (!playFound) {
        throw new Error(
          "All log archive entries checked and no entry containing the substring ' play a ' found."
        );
      }
    } else {
      libraryDiscard = false;
      throw new Error("Current line is not a discard line.");
    }
    return libraryDiscard;
  }

  checkForPoacherDiscard() {}
}
