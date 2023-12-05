/**
 * @jest-environment jsdom
 */
import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("checkForCourierPlay", () => {
  // Declare Deck reference.
  let deck: Deck;
  // Declare elements to simulate Client DOM
  let logLineContainer: HTMLElement;
  let logLine1Element: HTMLElement;
  let logLine2Element: HTMLElement;
  let logLine3Element: HTMLElement;
  let logLine4Element: HTMLElement;
  let logLine5Element: HTMLElement;
  let logLine6Element: HTMLElement;

  // Arrange DOM before each test
  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    document.body.innerHTML = "";
    /** The document body innerHTML:
   *
  <div class="log-scroll-container">
    <div class="log-line">pNick plays a Throne Room.</div>
    <div class="log-line">pNick plays a Courier.</div>
    <div class="log-line">pNick gets +$1.</div>
    <div class="log-line" style="padding-left: 8%;">
      pNick discards a Copper.
    </div>
    <div class="log-line" style="padding-left: 8%;">
      pNick plays a Copper.
      </div>
      </div>;
      */
    logLineContainer = document.createElement("div");
    logLine1Element = document.createElement("div");
    logLine2Element = document.createElement("div");
    logLine3Element = document.createElement("div");
    logLine4Element = document.createElement("div");
    logLine5Element = document.createElement("div");
    logLine6Element = document.createElement("div");
    logLine1Element.setAttribute("class", "log-line");
    logLine1Element.innerHTML = "pNick plays a Throne Room.";
    logLine2Element.setAttribute("class", "log-line");
    logLine2Element.innerHTML = "pNick plays a Courier.";
    logLine3Element.innerHTML = "pNick gets +$1.";
    logLine3Element.setAttribute("class", "log-line");
    logLine4Element.innerHTML = "pNick discards a Copper.";
    logLine4Element.setAttribute("class", "log-line");
    logLine4Element.style.paddingLeft = "8%";
    logLine5Element.innerHTML = "pNick looks at a Copper and an Estate"; // Function checks the padding of this element
    logLine5Element.setAttribute("class", "log-line");
    logLine5Element.style.paddingLeft = "8%";
    logLine6Element.innerHTML = "pNick plays a Copper."; // Function checks padding of this element
    logLine6Element.setAttribute("class", "log-line");
    logLine6Element.style.paddingLeft = "8%";
    logLineContainer.setAttribute("class", "log-scroll-container");
    logLineContainer.appendChild(logLine1Element);
    logLineContainer.appendChild(logLine2Element);
    logLineContainer.appendChild(logLine3Element);
    logLineContainer.appendChild(logLine4Element);
    logLineContainer.appendChild(logLine5Element);
    logLineContainer.appendChild(logLine6Element);
    document.body.appendChild(logLineContainer);
  });

  it("should return true if the most recent play was a Courier whose div element has equal left padding to the current div element", () => {
    //  Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Courier.",
      "pNick gets +$1.",
      "pNick discards a Copper.",
      "pNick looks at a Copper and an Estate.",
    ];
    deck.latestAction = "Courier";
    deck.latestPlay = "Courier";

    // Act
    const result = deck.checkForCourierPlay();

    // Assert
    expect(result).toBe(true);
  });

  it("should return false if the most recent action was a Courier whose div element has equal left padding to the current div element", () => {
    //  Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Courier.",
      "pNick gets +$1.",
      "pNick discards a Copper.",
      "pNick looks at a Copper and an Estate.",
    ];
    deck.latestAction = "Courier";
    deck.latestPlay = "Courier";

    // Make padding of element of the card being played less the padding of the preceding element
    logLine6Element.style.paddingLeft = "0%";

    // Act
    const result = deck.checkForCourierPlay();

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when the most recent action in the logArchive is not a Courier", () => {
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
    deck.latestAction = "Sentry"; // Not a Courier

    // Act
    const result = deck.checkForCourierPlay();

    // Assert
    expect(result).toBe(false);
  });

  it(
    "should return false when the most recent action in the logArchive is a Courier " +
      "but the most recent play is not a Courier (such as a consecutive treasure plays occurring after a Courier play",
    () => {
      const copperPlayedByCourier = document.createElement("div");
      copperPlayedByCourier.innerHTML = "pNick plays a Copper. (+$1)";
      copperPlayedByCourier.setAttribute("class", "log-line");
      copperPlayedByCourier.style.paddingLeft = "8%";
      const coppersPlayedFromHand = document.createElement("div");
      coppersPlayedFromHand.innerHTML = "pNick plays 2 Copper. (+$2)";
      coppersPlayedFromHand.setAttribute("class", "log-line");
      coppersPlayedFromHand.style.paddingLeft = "0%";
      logLineContainer.appendChild(copperPlayedByCourier);
      logLineContainer.appendChild(coppersPlayedFromHand);
      // Arrange
      deck.logArchive = [
        "pNick plays a Throne Room.",
        "pNick plays a Courier.",
        "pNick gets +$1.",
        "pNick discards a Copper.",
        "pNick looks at a Copper and an Estate.",
        "pNick plays a Copper.",
      ];
      // Here we pop off the logArchive entry, simulating a consecutive treasure play...
      deck.logArchive.pop();
      deck.latestPlay = "Copper"; // Not a Courier
      deck.latestAction = "Courier";

      // Act
      const result = deck.checkForCourierPlay();

      // Assert
      expect(result).toBe(false);
    }
  );

  it("should throw an error if the element for the current line paddingLeft property values to not end in a '%' character", () => {
    //  Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Courier.",
      "pNick gets +$1.",
      "pNick discards a Copper.",
      "pNick looks at a Copper and an Estate.",
    ];
    deck.latestAction = "Courier";
    deck.latestPlay = "Courier";

    // Make padding of element of the card being played less the padding of the preceding element
    logLine6Element.style.paddingLeft = "0";

    // Act and Assert
    expect(() => deck.checkForCourierPlay()).toThrowError(
      "Current line paddingLeft property does not end with %."
    );
  });

  it("should throw an error if the element for the previous line paddingLeft property values to not end in a '%' character", () => {
    //  Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Courier.",
      "pNick gets +$1.",
      "pNick discards a Copper.",
      "pNick looks at a Copper and an Estate.",
    ];
    deck.latestAction = "Courier";
    deck.latestPlay = "Courier";
    // Make padding of element of the card being played less the padding of the preceding element
    logLine5Element.style.paddingLeft = "0";

    // Act and Assert
    expect(() => deck.checkForCourierPlay()).toThrowError(
      "Previous line paddingLeft property does not end with %."
    );
  });
});
