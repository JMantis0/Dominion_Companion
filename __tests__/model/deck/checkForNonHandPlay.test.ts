/**
 * @jest-environment jsdom
 */
import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("checkForNonHandPlay", () => {
  // Declare Deck reference.
  let deck: Deck;

  // Arrange DOM before each test
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
    document.body.innerHTML = "";
  });

  // Vassal Case
  // Is a played by Vassal
  it("should return Vassal when the play on the current line is caused by a Vassal", () => {
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line'>P plays a Vassal.</div>" +
      "<div class='log-line'>P gets +$2.</div>" +
      "<div class='log-line' id='previousLine'>" +
      "P discards a Vassal." +
      "</div>" +
      "<div class='log-line' id='currentLine'>" +
      "P plays a Vassal." +
      "</div>" +
      "</div>";

    // Get the elements to be checked.
    const previousLineElement = document.getElementById("previousLine");
    const currentLineElement = document.getElementById("currentLine");
    // Assign equal paddingLefts
    if (previousLineElement) {
      previousLineElement.style.paddingLeft = "8%";
      previousLineElement.innerHTML = "P discards a Vassal.";
    } else throw new Error("previousLineElement is undefined");
    if (currentLineElement) currentLineElement.style.paddingLeft = "8%";
    else throw new Error("currentLineElement is undefined");


    deck.latestAction = "Vassal";
    deck.latestPlay = "Vassal";
    deck.logArchive = [
      "P plays a Vassal.",
      "P gets +$2.",
      "P discards a Vassal.",
    ];
    expect(previousLineElement?.innerHTML).toBe("P discards a Vassal.");
    expect(currentLineElement?.innerHTML).toBe("P plays a Vassal.");

    // Act and Assert - Verify the check returns 'Vassal'
    expect(deck.checkForNonHandPlay()).toBe("Vassal");
  });

  // Is a hand play immediately after a Vassal play
  it("should return 'None' when the play on the current line is played from hand, played immediately after a Vassal.", () => {
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line'>P plays a Vassal.</div>" +
      "<div class='log-line'>P gets +$2.</div>" +
      "<div class='log-line' id='previousLine'>" +
      "P discards a Vassal." +
      "</div>" +
      "<div class='log-line' id='currentLine'>" +
      "P plays a Vassal." +
      "</div>" +
      "</div>";

    // Get the elements to be checked.
    const previousLineElement = document.getElementById("previousLine");
    const currentLineElement = document.getElementById("currentLine");

    // Set the current line's paddingLeft to be less than the previous line's paddingLeft.
    if (previousLineElement) previousLineElement.style.paddingLeft = "8%";
    else throw new Error("previousLineElement is undefined");
    if (currentLineElement) currentLineElement.style.paddingLeft = "0%";
    else throw new Error("currentLineElement is undefined");

    deck.latestAction = "Vassal";
    deck.latestPlay = "Vassal";
    deck.logArchive = [
      "P plays a Vassal.",
      "P gets +$2.",
      "P discards a Vassal.",
    ];

    expect(previousLineElement?.innerHTML).toBe("P discards a Vassal.");
    expect(currentLineElement?.innerHTML).toBe("P plays a Vassal.");

    // Act and Assert
    expect(deck.checkForNonHandPlay()).toBe("None");
  });

  // Courier Case: Card played by Courier
  it("should return 'Courier' when the play on the current line is caused by a Courier", () => {
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line'>P plays a Courier.</div>" +
      "<div class='log-line'>P gets +$1.</div>" +
      "<div class='log-line'>P discards a Copper.</div>" +
      "<div class='log-line' id='previousLine'>P looks at a Copper.</div>" +
      "<div class='log-line' id='currentLine'>P plays a Copper. (+$1)</div>" +
      "</div>";

    // Get the elements to be checked
    const previousLineElement = document.getElementById("previousLine");
    const currentLineElement = document.getElementById("currentLine");
    // Assign equal paddingLefts
    if (previousLineElement) previousLineElement.style.paddingLeft = "8%";
    else throw new Error("previousLineElement is undefined");
    if (currentLineElement) currentLineElement.style.paddingLeft = "8%";
    else throw new Error("currentLineElement is undefined");

    deck.latestAction = "Courier";
    deck.latestPlay = "Courier";
    deck.logArchive = [
      "P plays a Courier.",
      "P gets +$1.",
      "P discards a Copper.",
      "P looks at a Copper.",
    ];

    expect(previousLineElement?.innerHTML).toBe("P looks at a Copper.");
    expect(currentLineElement?.innerHTML).toBe("P plays a Copper. (+$1)");

    // Act
    expect(deck.checkForNonHandPlay()).toBe("Courier");
  });

  // Courier Case: Is a hand play immediately after a Courier play
  it("should return 'None' when the play on the current line is played from hand, played immediately after a Courier.", () => {
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line'>P plays a Courier.</div>" +
      "<div class='log-line'>P gets +$1.</div>" +
      "<div class='log-line'>P discards a Copper.</div>" +
      "<div class='log-line' id='previousLine'>P looks at a Copper.</div>" +
      "<div class='log-line' id='currentLine'>P plays a Copper. (+$1)</div>" +
      "</div>";

    const previousLineElement = document.getElementById("previousLine");
    const currentLineElement = document.getElementById("currentLine");
    // Set the current line's paddingLeft to be less than the previous line's paddingLeft.
    if (previousLineElement) previousLineElement.style.paddingLeft = "8%";
    else throw new Error("previousLineElement is undefined");
    if (currentLineElement) currentLineElement.style.paddingLeft = "0%";
    else throw new Error("currentLineElement is undefined");

    deck.latestAction = "Courier";
    deck.latestPlay = "Courier";
    deck.logArchive = [
      "P plays a Courier.",
      "P gets +$1.",
      "P discards a Copper.",
      "P looks at a Copper.",
    ];

    expect(previousLineElement?.innerHTML).toBe("P looks at a Copper.");
    expect(currentLineElement?.innerHTML).toBe("P plays a Copper. (+$1)");
    // Act
    expect(deck.checkForNonHandPlay()).toBe("None");
  });
  // Is a Courier play
  // Is not a Courier play

  // Fortune Hunter Case
  // Is a Fortune Hunter play
  it("should return 'Fortune Hunter' when the play on the current line is caused by a Fortune Hunter", () => {
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line'>P plays a Fortune Hunter.</div>" +
      "<div class='log-line'>P gets +$2.</div>" +
      "<div class='log-line' id='previousLine'>P looks at 3 Coppers.</div>" +
      "<div class='log-line' id='currentLine'>P plays a Copper. (+$1)" +
      "</div>";

    const previousLineElement = document.getElementById("previousLine");
    const currentLineElement = document.getElementById("currentLine");
    // Set the current line's paddingLeft to be less than the previous line's paddingLeft.
    if (previousLineElement) previousLineElement.style.paddingLeft = "8%";
    else throw new Error("previousLineElement is undefined");
    if (currentLineElement) currentLineElement.style.paddingLeft = "8%";
    else throw new Error("currentLineElement is undefined");

    deck.latestAction = "Fortune Hunter";
    deck.latestPlay = "Fortune Hunter";
    deck.logArchive = [
      "P plays a Fortune Hunter.",
      "P gets +$2.",
      "P looks at 3 Coppers.",
    ];
    expect(deck.checkForNonHandPlay()).toBe("Fortune Hunter");
  });
  // Is a hand play immediately after a Fortune Hunter play
  it("should return 'None' when the play on the current line is played from hand, played immediately after a Fortune Hunter.", () => {
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line'>P plays a Fortune Hunter.</div>" +
      "<div class='log-line'>P gets +$2.</div>" +
      "<div class='log-line'>P looks at 3 Coppers.</div>" +
      "<div class='log-line' id='previousLine'>P topdecks 3 Coppers." +
      "<div class='log-line' id='currentLine'>P plays a Silver. (+$2)" +
      "</div>";

    const previousLineElement = document.getElementById("previousLine");
    const currentLineElement = document.getElementById("currentLine");
    // Set the current line's paddingLeft to be less than the previous line's paddingLeft.
    if (previousLineElement) previousLineElement.style.paddingLeft = "8%";
    else throw new Error("previousLineElement is undefined");
    if (currentLineElement) currentLineElement.style.paddingLeft = "0%";
    else throw new Error("currentLineElement is undefined");

    deck.latestAction = "Fortune Hunter";
    deck.latestPlay = "Fortune Hunter";
    deck.logArchive = [
      "P plays a Fortune Hunter.",
      "P gets +$2.",
      "P looks at 3 Coppers.",
      "P topdecks 3 Coppers.",
    ];
    // Act and Assert
    expect(deck.checkForNonHandPlay()).toBe("None");
  });
});
