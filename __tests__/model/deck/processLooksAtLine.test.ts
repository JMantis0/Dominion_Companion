import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processLooksAtLine", () => {
  // Instantiate deck object
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on function dependencies
  const checkForLibraryLook = jest.spyOn(Deck.prototype, "checkForLibraryLook");
  const draw = jest.spyOn(Deck.prototype, "draw");
  const setWaitToDrawLibraryLook = jest.spyOn(
    Deck.prototype,
    "setWaitToDrawLibraryLook"
  );
  const setAsideWithLibrary = jest
    .spyOn(Deck.prototype, "setAsideWithLibrary")
    .mockImplementation(() => null);
  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should take no action if the look was not cause by a Library", () => {
    // Arrange
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

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(line, cards, numberOfCards);

    // Assert
    expect(checkForLibraryLook).toBeCalledTimes(1);
    expect(checkForLibraryLook.mock.results[0].value).toBe(false);
    expect(draw).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });

  it("should move the cards to setAside if look is caused by a Sentry", () => {
    const logArchive = [
      "pNick plays a Laboratory.",
      "pNick draws a Silver and a Province.",
      "pNick gets +1 Action.",
      "pNick plays a Sentry.",
      "pNick draws a Merchant.",
      "pNick gets +1 Action.",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested
    const line = "pNick looks at a Copper and a Province.";
    const cards = ["Copper", "Province"];
    const numberOfCards = [1, 1];

    // Act - Simulate looking at a Copper and Province with a Sentry
    deck.processLooksAtLine(line, cards, numberOfCards);

    expect(checkForLibraryLook).toBeCalledTimes(1);
    expect(checkForLibraryLook.mock.results[0].value).toBe(false);
    expect(setAsideWithLibrary).toBeCalledTimes(2);
    expect(setAsideWithLibrary).nthCalledWith(1, "Copper");
    expect(setAsideWithLibrary).nthCalledWith(2, "Province");
    expect(draw).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });

  it("should draw certain cards immediately if they are looked at by a Library", () => {
    // Arrange
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
