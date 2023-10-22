import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processLooksAtLine", () => {
  // Instantiate deck object
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on function dependencies
  const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
  const draw = jest
    .spyOn(Deck.prototype, "draw")
    .mockImplementation(() => null);
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

  it("should take no action if the look was not cause by a Library, Sentry, or Bandit", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Festival.",
      "pNick gets +2 Actions.",
      "pNick gets +1 Buy.",
      "pNick gets +$2.",
      "pNick plays a Harbinger.",
      "pNick draws a Silver.",
      "pNick gets +1 Action.",
    ];

    // Arguments for function being tested
    const cards = ["Copper", "Estate", "Moat", "Poacher"];
    const numberOfCards = [3, 3, 1, 2];

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Harbinger");
    expect(setAsideWithLibrary).not.toBeCalled();
    expect(draw).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });

  it("should move the cards to setAside if look is caused by a Sentry", () => {
    deck.logArchive = [
      "pNick plays a Laboratory.",
      "pNick draws a Silver and a Province.",
      "pNick gets +1 Action.",
      "pNick plays a Sentry.",
      "pNick draws a Merchant.",
      "pNick gets +1 Action.",
    ];

    // Arguments for function being tested
    const cards = ["Copper", "Province"];
    const numberOfCards = [1, 1];

    // Act - Simulate looking at a Copper and Province with a Sentry
    deck.processLooksAtLine(cards, numberOfCards);

    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Sentry");
    expect(setAsideWithLibrary).toBeCalledTimes(2);
    expect(setAsideWithLibrary).nthCalledWith(1, "Copper");
    expect(setAsideWithLibrary).nthCalledWith(2, "Province");
    expect(draw).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });

  it("should move the cards to setAside if look is caused by a Bandit", () => {
    deck.logArchive = [
      "G plays a Poacher.",
      "G draws a Copper.",
      "G gets +1 Action.",
      "G gets +$1.",
      "G plays a Bandit.",
      "G gains a Gold.",
      "L reveals a Gold and a Smithy.",
      "L trashes a Gold.",
    ];

    // Arguments for function being tested
    const cards = ["Smithy"];
    const numberOfCards = [1];

    // Act - Simulate looking at a Copper and Province with a Sentry
    deck.processLooksAtLine(cards, numberOfCards);

    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Bandit");
    expect(setAsideWithLibrary).toBeCalledTimes(1);
    expect(setAsideWithLibrary).toBeCalledWith("Smithy");
    expect(draw).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });

  it("should draw certain cards immediately if they are looked at by a Library", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Sentry.",
      "pNick draws a Silver.",
      "pNick gets +1 Action.",
      "pNick looks at a Copper and a Gold.",
      "pNick trashes a Copper.",
      "pNick topdecks a Gold.",
      "pNick plays a Library.",
    ];

    // Arguments for function being tested
    const cards = ["Gold"];
    const numberOfCards = [1];

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Library");
    expect(draw).toBeCalledTimes(1);
    expect(draw).toBeCalledWith("Gold");
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
    expect(setAsideWithLibrary).not.toBeCalled();
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
    const cards = ["Mine"];
    const numberOfCards = [1];

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Library");
    expect(setWaitToDrawLibraryLook).toHaveBeenCalledTimes(1);
    expect(setWaitToDrawLibraryLook).toHaveBeenCalledWith(true);
    expect(setAsideWithLibrary).not.toBeCalled();
    expect(draw).not.toBeCalled();
  });
});
