/**
 * @jest-environment jsdom
 */
import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("checkForVassalPlay", () => {
  // Declare Deck reference.
  let deck: Deck;
  // Declare elements to simulate Client DOM
  let logLineContainer: HTMLElement;
  let logLine1Element: HTMLElement;
  let logLine2Element: HTMLElement;
  let logLine3Element: HTMLElement;
  let logLine4Element: HTMLElement;
  let logLine5Element: HTMLElement;

  // Arrange DOM before each test
  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    document.body.innerHTML = "";
    /** The document body innerHTML:
   *
  <div class="log-scroll-container">
    <div class="log-line">pNick plays a Throne Room.</div>
    <div class="log-line">pNick plays a Vassal.</div>
    <div class="log-line">pNick gets +$2.</div>
    <div class="log-line" style="padding-left: 8%;">
      pNick discards a Vassal.
    </div>
    <div class="log-line" style="padding-left: 8%;">
      pNick plays a Vassal.
      </div>
      </div>;
      */
    logLineContainer = document.createElement("div");
    logLine1Element = document.createElement("div");
    logLine2Element = document.createElement("div");
    logLine3Element = document.createElement("div");
    logLine4Element = document.createElement("div");
    logLine5Element = document.createElement("div");
    logLine1Element.setAttribute("class", "log-line");
    logLine1Element.innerHTML = "pNick plays a Throne Room.";
    logLine2Element.setAttribute("class", "log-line");
    logLine2Element.innerHTML = "pNick plays a Vassal.";
    logLine3Element.innerHTML = "pNick gets +$2.";
    logLine3Element.setAttribute("class", "log-line");
    logLine4Element.innerHTML = "pNick discards a Vassal."; // Function checks the padding of this element
    logLine4Element.setAttribute("class", "log-line");
    logLine4Element.style.paddingLeft = "8%";
    logLine5Element.innerHTML = "pNick plays a Vassal."; // Function checks padding of this element
    logLine5Element.setAttribute("class", "log-line");
    logLine5Element.style.paddingLeft = "8%";
    logLineContainer.setAttribute("class", "log-scroll-container");
    logLineContainer.appendChild(logLine1Element);
    logLineContainer.appendChild(logLine2Element);
    logLineContainer.appendChild(logLine3Element);
    logLineContainer.appendChild(logLine4Element);
    logLineContainer.appendChild(logLine5Element);
    document.body.appendChild(logLineContainer);
  });

  it("should return true if the most recent play was a Vassal whose div element has equal left padding to the current div element", () => {
    //  Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Vassal.",
    ];
    deck.latestAction = "Vassal";

    // Act
    const result = deck.checkForVassalPlay();

    // Assert
    expect(result).toBe(true);
  });

  it("should return false if the most recent play was a Vassal whose div element has equal left padding to the current div element", () => {
    //  Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Vassal.",
    ];
    deck.latestAction = "Vassal";

    // Make padding of element of the card being played less the padding of the preceding element
    logLine5Element.style.paddingLeft = "0%";

    // Act
    const result = deck.checkForVassalPlay();

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when the most recent play in the logArchive is not a Vassal", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Sentry.",
      "pNick draws a Gold.",
      "pNick gets +1 Action.",
      "pNick looks at a Copper and an Estate.",
      "pNick trashes a Copper and an Estate.",
      "pNick plays a Sentry again.",
      "pNick draws a Gold.",
      "pNick gets +1 Action.",
      "pNick looks at a Copper and a Silver.",
      "pNick trashes a Copper.",
      "pNick topdecks a Silver.",
    ];
    deck.latestAction = "Sentry";

    // Act
    const result = deck.checkForVassalPlay();

    // Assert
    expect(result).toBe(false);
  });

  it("should throw an error if the element for the current line paddingLeft property values to not end in a '%' character", () => {
    //  Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Vassal.",
    ];
    deck.latestAction = "Vassal";

    // Make padding of element of the card being played less the padding of the preceding element
    logLine5Element.style.paddingLeft = "0";

    // Act and Assert
    expect(() => deck.checkForVassalPlay()).toThrowError(
      "Current line paddingLeft property does not end with %."
    );
  });

  it("should throw an error if the element for the previous line paddingLeft property values to not end in a '%' character", () => {
    //  Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Vassal.",
    ];
    deck.latestAction = "Vassal";

    // Make padding of element of the card being played less the padding of the preceding element
    logLine4Element.style.paddingLeft = "0";

    // Act and Assert
    expect(() => deck.checkForVassalPlay()).toThrowError(
      "Previous line paddingLeft property does not end with %."
    );
  });
});
