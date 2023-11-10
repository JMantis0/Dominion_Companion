import { BaseDeck } from "./baseDeck";

/**
 * Class for a Deck object used to track a
 * player's Deck state.
 */
export class OpponentDeck extends BaseDeck {
  constructor(
    gameTitle: string,
    ratedGame: boolean,
    rating: string,
    playerName: string,
    playerNick: string,
    kingdom: Array<string>
  ) {
    super(gameTitle, ratedGame, rating, playerName, playerNick, kingdom);
    this.setDebug(false);
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
      case "gains":
        this.processGainsLine(line, cards, numberOfCards);
        break;
      case "trashes":
        this.processTrashesLine(cards, numberOfCards);
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
        const buyAndGain = this.checkForBuyAndGain(line, cards[i]);
        if (buyAndGain) {
          const lastLineBuy = this.checkPreviousLineProcessedForCurrentCardBuy(
            cards[i]
          );
          if (lastLineBuy) {
            // keep the logArchive from accumulating duplicates.
            this.popLastLogArchiveEntry(this.logArchive);
          }
        }
        this.addCardToEntireDeck(cards[i]);
      }
    }
  }

  /**
   * Update function. Trashes cards according the provided information.
   * @param cards - Array of the cards names to trash.
   * @param numberOfCards - Array of the amount of each card to trash.
   */
  processTrashesLine(cards: string[], numberOfCards: number[]) {
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < numberOfCards[i]; j++) {
        const trashCopy = this.trash.slice();
        trashCopy.push(cards[i]);
        this.setTrash(trashCopy);
        this.removeCardFromEntireDeck(cards[i]);
      }
    }
  }

  /**
   * Updates the deck state based on log entries from the client game log.
   * @param log - array of log lines from the DOM Clients
   */
  update(log: Array<string>) {
    log.forEach((line) => {
      if (this.debug) console.group(line);
      this.setTreasurePopped(false);
      const { act, cards, numberOfCards } = this.getActCardsAndCounts(line);
      if (this.logEntryAppliesToThisDeck(line)) {
        this.processDeckChanges(line, act, cards, numberOfCards);
      }
      this.updateArchives(line);
      this.updateVP();
      if (this.debug) console.groupEnd();
    });
  }
}
