import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processLooksAtLine", () => {
  // Instantiate deck object
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies
  const draw = jest
    .spyOn(Deck.prototype, "draw")
    .mockImplementation(() => null);
  const setWaitToDrawLibraryLook = jest.spyOn(
    Deck.prototype,
    "setWaitToDrawLibraryLook"
  );
  const setAsideFromLibrary = jest
    .spyOn(Deck.prototype, "setAsideFromLibrary")
    .mockImplementation(() => null);

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should take no action if the look was not cause by a Library, Sentry, or Bandit", () => {
    // Arrange
    deck.latestPlay = "Harbinger";

    // Arguments for function being tested
    const cards = ["Copper", "Estate", "Moat", "Poacher"];
    const numberOfCards = [3, 3, 1, 2];

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(draw).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });

  it("should move the cards to setAside if look is caused by a Sentry", () => {
    // Arrange
    deck.latestPlay = "Sentry";

    // Arguments for function being tested
    const cards = ["Copper", "Province"];
    const numberOfCards = [1, 1];

    // Act - Simulate looking at a Copper and Province with a Sentry
    deck.processLooksAtLine(cards, numberOfCards);

    expect(setAsideFromLibrary).toBeCalledTimes(2);
    expect(setAsideFromLibrary).nthCalledWith(1, "Copper");
    expect(setAsideFromLibrary).nthCalledWith(2, "Province");
    expect(draw).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });

  it("should move the cards to setAside if look is caused by a Bandit", () => {
    // Arrange
    deck.latestPlay = "Bandit";
    // Arguments for function being tested
    const cards = ["Smithy"];
    const numberOfCards = [1];

    // Act - Simulate looking at a Copper and Province with a Sentry
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert
    expect(setAsideFromLibrary).toBeCalledTimes(1);
    expect(setAsideFromLibrary).toBeCalledWith("Smithy");
    expect(draw).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
  });

  it("should draw certain cards immediately if they are looked at by a Library", () => {
    // Arrange
    deck.latestPlay = "Library";

    // Arguments for function being tested
    const numberOfCards = [1];

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(["Gold"], numberOfCards);
    deck.processLooksAtLine(["Silver"], numberOfCards);
    deck.processLooksAtLine(["Copper"], numberOfCards);
    deck.processLooksAtLine(["Gardens"], numberOfCards);
    deck.processLooksAtLine(["Province"], numberOfCards);
    deck.processLooksAtLine(["Duchy"], numberOfCards);
    deck.processLooksAtLine(["Estate"], numberOfCards);
    deck.processLooksAtLine(["Curse"], numberOfCards);

    // Assert
    expect(draw).toBeCalledTimes(8);
    expect(draw).nthCalledWith(1, "Gold");
    expect(draw).nthCalledWith(2, "Silver");
    expect(draw).nthCalledWith(3, "Copper");
    expect(draw).nthCalledWith(4, "Gardens");
    expect(draw).nthCalledWith(5, "Province");
    expect(draw).nthCalledWith(6, "Duchy");
    expect(draw).nthCalledWith(7, "Estate");
    expect(draw).nthCalledWith(8, "Curse");
    expect(setWaitToDrawLibraryLook).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
  });

  it("should move cards that looked at by a Library, but not drawn immediately to setAside, and waitToDrawLibraryLook should be set to true", () => {
    // Arrange
    deck.latestPlay = "Library";
    // Arguments for function being tested
    const cards = ["Mine"];
    const numberOfCards = [1];

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert
    expect(setWaitToDrawLibraryLook).toHaveBeenCalledTimes(1);
    expect(setWaitToDrawLibraryLook).toHaveBeenCalledWith(true);
    expect(setAsideFromLibrary).toBeCalledTimes(1);
    expect(setAsideFromLibrary).toBeCalledWith("Mine");
    expect(draw).not.toBeCalled();
  });
});
