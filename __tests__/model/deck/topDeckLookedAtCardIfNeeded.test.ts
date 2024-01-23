/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("topDeckLookedAtCardIfNeeded", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", ["Crystal Ball", "Copper"]);
    document.body.innerHTML = "";
  });
  it(
    "should topdeck cards looked at by a Crystal Ball if the look log-line after the Crystal Ball " +
      "play has greater leftPadding than the log-line after that",
    () => {
      // Arrange
      const log = [
        "Turn 6 - Player",
        "P plays a Crystal Ball.",
        "P looks at a Copper.",
        "P plays a Copper. (+$1)", // Was this copper played by Crystal Ball, or from hand?  Use paddingLeft to find out.
        "Random log that has no deck effect.",
        "Random log that has no deck effect.",
        "Random log that has no deck effect.",
        "Random log that has no deck effect.",
      ];
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line'>Turn 6 - Player</div>" +
        "<div class='log-line' id='source-line'>P plays a Crystal Ball.</div>" +
        "<div class='log-line' id='look-line'>P looks at a Copper.</div>" +
        "<div class='log-line' id='next-line'>P plays a Copper. (+$1)</div>" +
        "<div class='log-line'>Random log that has no deck effect.</div>" +
        "<div class='log-line'>Random log that has no deck effect.</div>" +
        "<div class='log-line'>Random log that has no deck effect.</div>" +
        "<div class='log-line'>Random log that has no deck effect.</div>" +
        "</div>";
      // Get the elements and assign paddings as they would be in a Client game-log
      const sourceLine = document.getElementById("source-line");
      if (sourceLine !== null) {
        sourceLine.style.paddingLeft = "0%";
      } else {
        throw Error("sourceLine is null");
      }
      const lookLine = document.getElementById("look-line");
      if (lookLine !== null) {
        lookLine.style.paddingLeft = "4%";
      } else {
        throw Error("lookLine is null");
      }
      const nextLine = document.getElementById("next-line");
      if (nextLine !== null) {
        nextLine.style.paddingLeft = "0%";
      } else {
        throw Error("nextLine is null");
      }
      deck.hand = ["Crystal Ball", "Copper"];
      deck.library = ["Copper"];
      // Act
      deck.update(log);
      // Assert - Verify the Copper was topdecked, and the Copper play came from hand.
      expect(deck.library).toStrictEqual(["Copper"]);
      expect(deck.hand).toStrictEqual([]);
    }
  );

  it(
    "should not topdeck cards looked at by a Crystal Ball if the look log-line after the Crystal Ball " +
      "play has the same or greater leftPadding than the log-line after that",
    () => {
      // Arrange
      const log = [
        "Turn 6 - Player",
        "P plays a Crystal Ball.",
        "P looks at a Copper.",
        "P plays a Copper. (+$1)", // Was this copper played by Crystal Ball, or from hand?  Use paddingLeft to find out.
        "Random log that has no deck effect.",
        "Random log that has no deck effect.",
        "Random log that has no deck effect.",
        "Random log that has no deck effect.",
      ];
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line'>Turn 6 - Player</div>" +
        "<div class='log-line' id='source-line'>P plays a Crystal Ball.</div>" +
        "<div class='log-line' id='look-line'>P looks at a Copper.</div>" +
        "<div class='log-line' id='next-line'>P plays a Copper. (+$1)</div>" +
        "<div class='log-line'>Random log that has no deck effect.</div>" +
        "<div class='log-line'>Random log that has no deck effect.</div>" +
        "<div class='log-line'>Random log that has no deck effect.</div>" +
        "<div class='log-line'>Random log that has no deck effect.</div>" +
        "</div>";
      // Get the elements and assign paddings as they would be in a Client game-log
      const sourceLine = document.getElementById("source-line");
      if (sourceLine !== null) {
        sourceLine.style.paddingLeft = "0%";
      } else {
        throw Error("sourceLine is null");
      }
      const lookLine = document.getElementById("look-line");
      if (lookLine !== null) {
        lookLine.style.paddingLeft = "4%";
      } else {
        throw Error("lookLine is null");
      }
      const nextLine = document.getElementById("next-line");
      if (nextLine !== null) {
        nextLine.style.paddingLeft = "4%";
      } else {
        throw Error("nextLine is null");
      }
      deck.hand = ["Crystal Ball", "Copper"];
      deck.library = ["Copper"];
      // Act
      deck.update(log);
      // Assert - Verify the Copper was played from Library/SetAside, not hand.
      expect(deck.library).toStrictEqual([]);
      expect(deck.hand).toStrictEqual(["Copper"]);
    }
  );
});
