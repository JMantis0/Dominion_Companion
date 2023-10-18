import { describe, it, expect, jest } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function processLooksAtLine", () => {
  it("should take no action if the look was not cause by a Library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Sentry.",
      "pNick draws a Silver.",
      "pNick gets +1 Action.",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested
    const line = "pNick looks at a Copper and a Gold.";
    const cards = ["Copper", "Gold"];
    const numberOfCards = [1, 1];

    // Mock function dependencies
    const checkForLibraryLook = jest.spyOn(
      Deck.prototype,
      "checkForLibraryLook"
    );
    const draw = jest.spyOn(Deck.prototype, "draw");
    const setWaitToDrawLibraryLook = jest.spyOn(
      Deck.prototype,
      "setWaitToDrawLibraryLook"
    );

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(line, cards, numberOfCards);

    // Assert
    expect(checkForLibraryLook).toBeCalledTimes(1);
    expect(checkForLibraryLook.mock.results[0].value).toBe(false);
    expect(draw).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });

  it("should draw certain cards immediately if they are looked at by a Library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const library = ["Gold"];
    const logArchive = [
      "pNick plays a Sentry.",
      "pNick draws a Silver.",
      "pNick gets +1 Action.",
      "pNick looks at a Copper and a Gold.",
      "pNick trashes a Copper.",
      "pNick topdecks a Gold.",
      "pNick plays a Library.",
    ];
    deck.setLogArchive(logArchive);
    deck.setLibrary(library);

    // Arguments for function being tested
    const line = "pNick looks at a Gold.";
    const cards = ["Gold"];
    const numberOfCards = [1];

    // Mock function dependencies
    const checkForLibraryLook = jest.spyOn(
      Deck.prototype,
      "checkForLibraryLook"
    );
    const draw = jest.spyOn(Deck.prototype, "draw");
    const setWaitToDrawLibraryLook = jest.spyOn(
      Deck.prototype,
      "setWaitToDrawLibraryLook"
    );

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(line, cards, numberOfCards);

    // Assert
    expect(checkForLibraryLook).toBeCalledTimes(1);
    expect(checkForLibraryLook).toBeCalledWith(line);
    expect(checkForLibraryLook.mock.results[0].value).toBe(true);
    expect(draw).toBeCalledTimes(1);
    expect(draw).toBeCalledWith("Gold");
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });
  
  it("should set class field waitToDrawLibraryLook to true for certain cards that are looked at by a Library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Sentry.",
      "pNick draws a Silver.",
      "pNick gets +1 Action.",
      "pNick looks at a Copper and a Gold.",
      "pNick trashes a Copper.",
      "pNick topdecks a Gold.",
      "pNick plays a Library.",
      "pNick looks at a Gold.",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested
    const line = "pNick looks at a Mine.";
    const cards = ["Mine"];
    const numberOfCards = [1];

    // Mock function dependencies
    const checkForLibraryLook = jest.spyOn(
      Deck.prototype,
      "checkForLibraryLook"
    );
    const draw = jest.spyOn(Deck.prototype, "draw");
    const setWaitToDrawLibraryLook = jest.spyOn(
      Deck.prototype,
      "setWaitToDrawLibraryLook"
    );

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(line, cards, numberOfCards);

    // Assert
    expect(checkForLibraryLook).toBeCalledTimes(1);
    expect(checkForLibraryLook).toBeCalledWith(line);
    expect(checkForLibraryLook.mock.results[0].value).toBe(true);
    expect(deck.waitToDrawLibraryLook).toBe(true);
    expect(setWaitToDrawLibraryLook).toHaveBeenCalledTimes(1);
    expect(setWaitToDrawLibraryLook).toHaveBeenCalledWith(true);
    expect(draw).not.toBeCalled();
  });
});
