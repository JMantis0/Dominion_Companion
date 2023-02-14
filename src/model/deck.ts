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

    const handleTreasureLine = (
      line: string,
      idx: number,
      array: Array<string>
    ): Array<number> => {
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
        numberOfCards = handleTreasureLine(line, idx, array);
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
            const banditDiscard = this.checkForBanditDiscard(line);
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
            const banditTrash = this.checkForBanditTrash(line);
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

  // State change functions
  draw(card: string) {
    const index = this.library.indexOf(card);
    if (index > -1) {
      ////console.log(`action Drawing ${card} from library into hand`);
      this.library.splice(index, 1);
      this.hand.push(card);
    } else {
      console.log(`No ${card} in deck`);
    }
  }

  play(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      ////console.log(`action Playing ${card} from hand into play`);
      this.hand.splice(index, 1);
      this.inPlay.push(card);
    } else {
      console.log(`No ${card} in hand`);
    }
  }

  addCardToEntireDeck(card: string) {
    this.entireDeck.push(card);
  }

  removeCardFromEntireDeck(card: string) {
    const index = this.entireDeck.indexOf(card);
    if (index > -1) {
      this.entireDeck.splice(index, 1);
    } else {
      console.log`No ${card} in the decklist`;
    }
  }

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

  topDeckFromGraveyard(card: string) {
    const index = this.graveyard.indexOf(card);
    if (index > -1) {
      this.graveyard.splice(index, 1);
      this.library.push(card);
      //////console.log(`action Topdeck ${card} from discard`);
    } else {
      console.log(`No ${card} in discard`);
    }
  }

  playFromDiscard(card: string) {
    const index = this.graveyard.indexOf(card);
    if (index > -1) {
      //////console.log(`action Playing ${card} from discard`);
      this.inPlay.push(card);
      this.graveyard.splice(index, 1);
    } else {
      console.log(`No ${card} in discard pile`);
    }
  }

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

  gain(card: string) {
    ////console.log(`action Gaining ${card} into discard`);
    this.graveyard.push(card);
  }

  gainIntoHand(card: string) {
    ////console.log(`action Gaining ${card} into hand`);
    this.hand.push(card);
  }

  topDeckCardFromHand(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      ////console.log(`action Topdecking ${this.hand[index]}`);
      this.library.push(this.hand[index]);
      this.hand.splice(index, 1);
    } else {
      console.log(`No ${card} in hand`);
    }
  }

  discard(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      console.log(
        `ACTION Discarding ${this.hand[index]} from hand into discard}`
      );
      this.graveyard.push(this.hand[index]);
      this.hand.splice(index, 1);
    } else {
      console.log(`No ${card} in hand.`);
    }
  }

  discardFromLibrary(card: string) {
    const index = this.library.indexOf(card);
    if (index > -1) {
      console.log(
        `ACTION dDscarding ${this.library[index]} from library into discard}`
      );
      this.graveyard.push(this.library[index]);
      this.library.splice(index, 1);
    } else {
      console.log(`No ${card} in library.`);
    }
  }

  trashFromHand(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      console.log(`Trashing ${this.hand[index]} from hand}`);
      this.trash.push(this.hand[index]);
      this.hand.splice(index, 1);
    } else {
      console.log(`No ${card} in hand.`);
    }
  }

  trashFromLibrary(card: string) {
    const index = this.library.indexOf(card);
    if (index > -1) {
      console.log(`Trashing ${this.library[index]} from library`);
      this.trash.push(this.library[index]);
      this.library.splice(index, 1);
    } else {
      console.log(`No ${card} in library`);
    }
  }

  //Check Functions
  checkForMineGain() {
    let len = this.logArchive.length;
    return this.logArchive[len - 2].match(" plays a Mine");
  }

  checkForCleanUp = (line: string) => {
    let needCleanUp = false;
    // need a cleanup detector
    // if there are exactly 5 draws in the next entry then a cleanup MAY be required before drawing.
    let drawCount = 0;
    if (this.abbrvName.match(/\ban?\b/g)) {
      drawCount -= this.abbrvName.match(/\ban?\b/g)!.length;
    }
    if (line.match(/\ban?\b/g)) {
      drawCount += line.match(/\ban?\b/g)!.length;
    }
    (line.match(/\d/g) || []).forEach((n) => {
      drawCount += parseInt(n);
    });
    if (drawCount == 5) {
      needCleanUp = true;
    }
    return needCleanUp;
  };

  checkForShuffle = (line: string) => {
    return line.match("shuffles their deck");
  };

  checkForCellarDraw = () => {
    let cellarDraws = false;
    if (
      this.logArchive.length > 3 &&
      this.logArchive[this.logArchive.length - 3].match(" plays a Cellar")
    ) {
      cellarDraws = true;
    }
    return cellarDraws;
  };

  checkForHarbingerTopDeck() {
    const len = this.logArchive.length;
    return (
      this.logArchive[len - 4].match(" plays a Harbinger") ||
      (this.logArchive[len - 5].match(" plays a Harbinger") &&
        this.logArchive[len - 4].match(" shuffles their deck"))
    );
  }

  checkForSentryDiscard() {
    const len = this.logArchive.length;
    return (
      this.logArchive[len - 4].match(" plays a Sentry") ||
      this.logArchive[len - 5].match(" plays a Sentry") ||
      (this.logArchive[len - 6].match(" plays a Sentry") &&
        this.logArchive[len - 5].match(" shuffles their deck"))
    );
  }

  checkForSentryTrash() {
    const len = this.logArchive.length;
    console.log("Logarchive length should be above 3", len);
    return (
      this.logArchive[len - 3].match(" plays a Sentry") ||
      this.logArchive[len - 4].match(" plays a Sentry") ||
      (this.logArchive[len - 5].match(" plays a Sentry") &&
        this.logArchive[len - 4].match(" shuffles their deck"))
    );
  }

  checkForBanditTrash = (line: string) => {
    let banditTrash = false;
    let len = this.logArchive.length;
    if (this.logArchive[len - 1].match(" reveals ")) {
      banditTrash = true;
    }
    return banditTrash;
  };

  checkForBanditDiscard = (line: string) => {
    let banditDiscard = false;
    let len = this.logArchive.length;
    if (
      (this.logArchive[len - 1].match(" trashes ") &&
        this.logArchive[len - 2].match(" reveals ")) ||
      this.logArchive[len - 1].match(" reveals ")
    ) {
      banditDiscard = true;
    } else {
      console.log("not a bandit Discard");
    }
    return banditDiscard;
  };

  checkForVassalPlay() {
    let vassalPlay: boolean | null = false;
    if (this.logArchive.length > 3) {
      vassalPlay =
        this.logArchive[this.logArchive.length - 3].match(" plays a Vassal") !==
        null;
    }
    return vassalPlay;
  }

  checkForVassalDiscard() {
    return this.logArchive[this.logArchive.length - 2].match(" plays a Vassal");
  }
}
