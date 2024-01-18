/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("throneRoomTerminator", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
    document.body.innerHTML;
  });
  it(
    "should set throneRoomActive field to false and increment throneID field if the " +
      "current log-line paddingLeft is less than or equal to the throneMother paddlingLeft.",
    () => {
      // Arrange -
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line' id='mother'>P plays a Throne Room.</div>" +
        "<div class='row1 log-line'>P plays a Throne Room.</div>" +
        "<div class='row2 log-line'>P plays a Barge.</div>" +
        "<div class='row3 log-line'>P draws 2 Coppers and an Estate.</div>" +
        "<div class='row3 log-line'>P gets +1 Buy.</div>" +
        "<div class='row2 log-line'>P plays a Barge again.</div>" +
        "<div class='row3 log-line'>P draws an Estate, a Merchant, and a Throne Room.</div>" +
        "<div class='row3 log-line'>P gets +1 Buy.</div>" +
        "<div class='row1 log-line'>P plays a Throne Room again.</div>" +
        "<div class='row2 log-line'>P plays a Throne Room.</div>" +
        "<div class='row3 log-line'>P plays a Barge.</div>" +
        "<div class='row3 log-line'>P plays a Barge again.</div>" +
        "<div class='row2 log-line'>P plays a Throne Room again.</div>" +
        "<div class='row3 log-line'>P plays a Merchant.</div>" +
        "<div class='row4 log-line'>P draws a Copper.</div>" +
        "<div class='row4 log-line'>P gets +1 Action.</div>" +
        "<div class='row3 log-line'>P plays a Merchant again.</div>" +
        "<div class='row4 log-line'>P shuffles their deck.</div>" +
        "<div class='row4 log-line'>P draws a Copper.</div>" +
        "<div class='row4 log-line'>P gets +1 Action.</div>" +
        "<div id='terminate' class='log-line'>P plays 5 Coppers and a Silver. (+$7)</div>" +
        "</div>";
      // set the paddingLefts
      const row4Elements = document.getElementsByClassName(
        "row1"
      ) as HTMLCollectionOf<HTMLElement>;
      if (row4Elements === undefined || row4Elements === null) {
        throw Error("row4Elements not found");
      }
      Array.from(row4Elements).forEach((el) => (el.style.padding = "4.4%"));
      const row3Elements = document.getElementsByClassName(
        "row1"
      ) as HTMLCollectionOf<HTMLElement>;
      if (row3Elements === undefined || row3Elements === null) {
        throw Error("row3Elements not found");
      }
      Array.from(row3Elements).forEach((el) => (el.style.padding = "3.3%"));
      const row2Elements = document.getElementsByClassName(
        "row1"
      ) as HTMLCollectionOf<HTMLElement>;
      if (row2Elements === undefined || row2Elements === null) {
        throw Error("row2Elements not found");
      }
      Array.from(row2Elements).forEach((el) => (el.style.padding = "2.2%"));
      const row1Elements = document.getElementsByClassName(
        "row1"
      ) as HTMLCollectionOf<HTMLElement>;
      if (row1Elements === undefined || row1Elements === null) {
        throw Error("row1Elements not found");
      }
      Array.from(row1Elements).forEach((el) => (el.style.padding = "1.1%"));
      const motherEl = document.getElementById("mother");
      if (motherEl === undefined || motherEl === null) {
        console.log(motherEl);
        throw Error("motherEl not found");
      } else {
        motherEl.style.paddingLeft = "0%";
      }
      const terminateEl = document.getElementById("terminate");
      if (terminateEl === undefined || terminateEl === null) {
        throw Error("terminateEl not found");
      } else {
        terminateEl.style.paddingLeft = "0%";
      }
      deck.logArchive = [
        "P plays a Throne Room.",
        "P plays a Throne Room.",
        "P plays a Barge.",
        "P draws 2 Coppers and an Estate.",
        "P gets +1 Buy.",
        "P plays a Barge again.",
        "P draws an Estate, a Merchant, and a Throne Room.",
        "P gets +1 Buy.",
        "P plays a Throne Room again.",
        "P plays a Throne Room.",
        "P plays a Barge.",
        "P plays a Barge again.",
        "P plays a Throne Room again.",
        "P plays a Merchant.",
        "P draws a Copper.",
        "P gets +1 Action.",
        "P plays a Merchant again.",
        "P shuffles their deck.",
        "P draws a Copper.",
        "P gets +1 Action.",
      ];
      deck.throneRoomActive = true;
      deck.throneMotherPadding = 0;
      deck.throneID = 0;

      // Act - Simulate running the terminator method.
      deck.throneRoomTerminator(deck.logArchive);
      // Assert
      expect(deck.throneRoomActive).toBe(false);
      expect(deck.throneID).toBe(1);
    }
  );

  it(
    "should not set throneRoomActive field or increment throneID field if the " +
      "current log-line paddingLeft greater than the throneMother paddlingLeft.",
    () => {
      // Arrange -
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line' id='mother'>P plays a Throne Room.</div>" +
        "<div class='row1 log-line'>P plays a Throne Room.</div>" +
        "<div class='row2 log-line'>P plays a Barge.</div>" +
        "<div class='row3 log-line'>P draws 2 Coppers and an Estate.</div>" +
        "<div class='row3 log-line'>P gets +1 Buy.</div>" +
        "<div class='row2 log-line'>P plays a Barge again.</div>" +
        "<div class='row3 log-line'>P draws an Estate, a Merchant, and a Throne Room.</div>" +
        "<div class='row3 log-line'>P gets +1 Buy.</div>" +
        "<div class='row1 log-line'>P plays a Throne Room again.</div>" +
        "<div class='row2 log-line'>P plays a Throne Room.</div>" +
        "<div class='row3 log-line'>P plays a Barge.</div>" +
        "<div class='row3 log-line'>P plays a Barge again.</div>" +
        "<div class='row2 log-line'>P plays a Throne Room again.</div>" +
        "<div class='row3 log-line'>P plays a Merchant.</div>" +
        "<div class='row4 log-line'>P draws a Copper.</div>" +
        "<div class='row4 log-line'>P gets +1 Action.</div>" +
        "<div class='row3 log-line'>P plays a Merchant again.</div>" +
        "<div class='row4 log-line'>P shuffles their deck.</div>" +
        "<div class='row4 log-line'>P draws a Copper.</div>" +
        "<div class='row4 log-line'>P gets +1 Action.</div>" +
        "<div id='terminate' class='log-line'>P plays 5 Coppers and a Silver. (+$7)</div>" +
        "</div>";
      // set the paddingLefts
      const row4Elements = document.getElementsByClassName(
        "row4"
      ) as HTMLCollectionOf<HTMLElement>;
      if (row4Elements === undefined || row4Elements === null) {
        throw Error("row4Elements not found");
      }
      Array.from(row4Elements).forEach((el) => (el.style.padding = "4.4%"));
      const row3Elements = document.getElementsByClassName(
        "row3"
      ) as HTMLCollectionOf<HTMLElement>;
      if (row3Elements === undefined || row3Elements === null) {
        throw Error("row3Elements not found");
      }
      Array.from(row3Elements).forEach((el) => (el.style.padding = "3.3%"));
      const row2Elements = document.getElementsByClassName(
        "row2"
      ) as HTMLCollectionOf<HTMLElement>;
      if (row2Elements === undefined || row2Elements === null) {
        throw Error("row2Elements not found");
      }
      Array.from(row2Elements).forEach((el) => (el.style.padding = "2.2%"));
      const row1Elements = document.getElementsByClassName(
        "row1"
      ) as HTMLCollectionOf<HTMLElement>;
      if (row1Elements === undefined || row1Elements === null) {
        throw Error("row1Elements not found");
      }
      Array.from(row1Elements).forEach((el) => (el.style.padding = "1.1%"));
      const motherEl = document.getElementById("mother");
      if (motherEl === undefined || motherEl === null) {
        throw Error("motherEl not found");
      } else {
        motherEl.style.paddingLeft = "0%";
      }
      const terminateEl = document.getElementById("terminate");
      if (terminateEl === undefined || terminateEl === null) {
        throw Error("terminateEl not found");
      } else {
        terminateEl.style.paddingLeft = "0%";
      }
      deck.logArchive = [
        "P plays a Throne Room.",
        "P plays a Throne Room.",
        "P plays a Barge.",
        "P draws 2 Coppers and an Estate.",
        "P gets +1 Buy.",
        "P plays a Barge again.",
        "P draws an Estate, a Merchant, and a Throne Room.",
        "P gets +1 Buy.",
        "P plays a Throne Room again.",
        "P plays a Throne Room.",
        "P plays a Barge.",
        "P plays a Barge again.",
        "P plays a Throne Room again.",
        "P plays a Merchant.",
        "P draws a Copper.",
        "P gets +1 Action.",
        "P plays a Merchant again.",
        "P shuffles their deck.",
        "P draws a Copper.",
      ];
      deck.throneRoomActive = true;
      deck.throneMotherPadding = 0;
      deck.throneID = 0;

      // Act - Simulate running the terminator method.
      deck.throneRoomTerminator(deck.logArchive);
      // Assert
      expect(deck.throneRoomActive).toBe(true);
      expect(deck.throneID).toBe(0);
    }
  );
});
