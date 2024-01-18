/**
 * @jest-environment jsdom
 */

import { describe, it, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("throneRoomInitializer", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
    document.body.innerHTML;
  });
  it(
    "should switch throneRoomActive field on and set throneMotherPadding to the padding of the current log line if it's" +
      "a mother Throne Room play",
    () => {
      // Arrange
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line' id='mother'>P plays a Throne Room.</div>" +
        "</div>";
      const motherEl = document.getElementById("mother");
      if (motherEl === undefined || motherEl === null) {
        console.log(motherEl);
        throw Error("motherEl not found");
      } else {
        motherEl.style.paddingLeft = "5%";
      }
      deck.throneRoomActive = false;
      deck.logArchive = [];
      const line = "P plays a Throne Room.";
      const act = "plays";
      const cards = ["Throne Room"];
      const numberOfCards = [1];
      // ActT
      deck.throneRoomInitializer(
        line,
        act,
        cards,
        numberOfCards,
        deck.logArchive
      );
      // Assert
      expect(deck.throneRoomActive).toBe(true);
      expect(deck.throneMotherPadding).toBe(5);
    }
  );
  it("should not perform any checks if throneRoomActive is true", () => {});
});
