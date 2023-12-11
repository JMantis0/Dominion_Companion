/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("lineSource", () => {
  // Declare Deck reference.
  let deck: Deck;

  // Arrange DOM before each test
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
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

  it("should return last log-line if it has no cause", () => {
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
});
