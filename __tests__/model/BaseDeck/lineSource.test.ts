/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("lineSource", () => {
  // Declare Deck reference.
  let deck: BaseDeck;

  // Arrange DOM before each test
  beforeEach(() => {
    deck = new BaseDeck("", false, "", "Player", "P", []);
    document.body.innerHTML = "";
  });

  it("should return the line that caused the current line, if it has a cause", () => {
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line' id='source'>P plays a Vassal.</div>" +
      "<div class='log-line caused'>P gets +$2.</div>" +
      "<div class='log-line caused' id='previousLine'>" +
      "P discards a Vassal." +
      "</div>" +
      "<div class='log-line caused' id='currentLine'>" +
      "P plays a Vassal." +
      "</div>" +
      "</div>";

    // Set logArchive (needed for length)
    deck.logArchive = [
      "P plays a Vassal",
      "P gets +$2.",
      "P discards a Vassal.",
      "P plays a Vassal",
    ];

    // Set the paddingLefts
    const sourceLine = document.getElementById("source");
    if (sourceLine !== null) sourceLine.style.paddingLeft = "0%";
    const causeLines = document.getElementsByClassName(
      "caused"
    ) as HTMLCollectionOf<HTMLElement>;
    for (const el of causeLines) {
      el.style.paddingLeft = "8%";
      console.log(el.innerHTML);
      console.log(el.style.paddingLeft);
    }
    console.log(sourceLine?.innerHTML);
    console.log(sourceLine?.style.paddingLeft);

    expect(deck.lineSource()).toBe("P plays a Vassal.");
  });

  it("should return None if it has no cause", () => {
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line' id='source'>P plays a Vassal.</div>" +
      "<div class='log-line caused'>P gets +$2.</div>" +
      "<div class='log-line caused'>P discards an Estate.</div>" +
      "<div class='log-line' id='no-cause'>P plays a Sentry.</div>" +
      "</div>";

    // Set logArchive (needed for length)
    deck.logArchive = [
      "P plays a Vassal",
      "P gets +$2.",
      "P discards an Estate.",
      "P plays a Vassal",
    ];
    // Set the paddingLefts
    const sourceLine = document.getElementById("source");
    if (sourceLine !== null) sourceLine.style.paddingLeft = "0%";
    const notCausedLine = document.getElementById("no-cause");
    if (notCausedLine !== null) notCausedLine.style.paddingLeft = "0%";
    const causeLines = document.getElementsByClassName(
      "caused"
    ) as HTMLCollectionOf<HTMLElement>;
    for (const el of causeLines) {
      el.style.paddingLeft = "8%";
      console.log(el.innerHTML);
      console.log(el.style.paddingLeft);
    }
    console.log(sourceLine?.innerHTML);
    console.log(sourceLine?.style.paddingLeft);

    expect(deck.lineSource()).toBe("None");
  });
  it(
    "should return the opponent's province gain line when the last line is" +
      "gaining a gold via Fool's Gold reaction",
    () => {
      // Arrange
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line' id='source'>L buys and gains a Province.</div>" +
        "<div class='log-line caused'>P trashes a Fool's Gold.</div>" +
        "<div class='log-line caused'>P gains a Gold</div>" +
        "<div class='log-line caused'>P trashes a Fool's Gold.</div>" +
        "<div class='log-line caused'>P gains a Gold</div>" +
        "</div>";

      deck.logArchive = [
        "L buys and gains a Province.",
        "P trashes a Fool's Gold.",
        "P gains a Gold.",
        "P trashes a Fool's Gold.",
        "P gains a Gold",
      ];
      // Set the paddingLefts
      const sourceLine = document.getElementById("source");
      if (sourceLine !== null) sourceLine.style.paddingLeft = "0%";
      const causeLines = document.getElementsByClassName(
        "caused"
      ) as HTMLCollectionOf<HTMLElement>;
      for (const el of causeLines) {
        el.style.paddingLeft = "8%";
        console.log(el.innerHTML);
        console.log(el.style.paddingLeft);
      }
      console.log(sourceLine?.innerHTML);
      console.log(sourceLine?.style.paddingLeft);

      expect(deck.lineSource()).toBe("L buys and gains a Province.");
    }
  );

  it(
    "should return  the plays a Royal Galley line when the last line is setting aside" +
      "a card with Royal Galley",
    () => {
      // Arrange
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line' id='source'>P plays a Royal Galley.</div>" +
        "<div class='log-line caused'>P draws a Silver.</div>" +
        "<div class='log-line caused'>P plays a Secret Passage.</div>" +
        "<div class='log-line causedAgain'>P draws an Estate and a Harvest.</div>" +
        "<div class='log-line causedAgain'>P gets +1 Action.</div>" +
        "<div class='log-line causedAgain'>P topdecks a Copper.</div>" +
        "<div class='log-line caused'>P sets a Secret Passage aside.</div>" +
        "</div>";

      deck.logArchive = [
        "P plays a Royal Galley.",
        "P draws a Silver.",
        "P plays a Secret Passage.",
        "P draws an Estate and a Harvest.",
        "P gets +1 Action.",
        "P topdecks a Copper.",
      ];
      // Set the paddingLefts
      const sourceLine = document.getElementById("source");
      if (sourceLine !== null) sourceLine.style.paddingLeft = "0%";
      const causeLines = document.getElementsByClassName(
        "caused"
      ) as HTMLCollectionOf<HTMLElement>;
      for (const el of causeLines) {
        el.style.paddingLeft = "4%";
        console.log(el.innerHTML);
        console.log(el.style.paddingLeft);
      }
      const causedAgainLines = document.getElementsByClassName(
        "causedAgain"
      ) as HTMLCollectionOf<HTMLElement>;
      for (const el of causedAgainLines) {
        el.style.paddingLeft = "8%";
        console.log(el.innerHTML);
        console.log(el.style.paddingLeft);
      }
      console.log(sourceLine?.innerHTML);
      console.log(sourceLine?.style.paddingLeft);

      expect(deck.lineSource()).toBe("P plays a Royal Galley.");
    }
  );
});
