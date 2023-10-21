import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function trashFromLibrary() ", () => {
  let deck = new Deck("", false, "", "pName", "pNick", []);
  const setLibrary = jest.spyOn(Deck.prototype, "setLibrary");
  const setTrash = jest.spyOn(Deck.prototype, "setTrash");
  const removeCardFromEntireDeck = jest.spyOn(
    Deck.prototype,
    "removeCardFromEntireDeck"
  );
  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });
  it("should remove an instance of the provided card from library, and add it to trash", () => {
    // Arrange
    deck.entireDeck = ["Harbinger", "Chapel", "Estate", "Silver", "Cellar"];
    deck.library = ["Harbinger", "Chapel", "Estate", "Silver"];
    deck.trash = ["Sentry", "Vassal"];

    // Act
    deck.trashFromLibrary("Harbinger");

    // Assert
    expect(setLibrary).toBeCalledTimes(1);
    expect(setLibrary).toBeCalledWith(["Chapel", "Estate", "Silver"]);
    expect(setTrash).toBeCalledTimes(1);
    expect(setTrash).toBeCalledWith(["Sentry", "Vassal", "Harbinger"]);
    expect(removeCardFromEntireDeck).toBeCalledTimes(1);
    expect(removeCardFromEntireDeck).toBeCalledWith("Harbinger");
  });

  it("should throw an error if the provided card is not in library", () => {
    // Arrange
    deck.library = ["Harbinger", "Chapel", "Estate", "Silver"];

    // Act and Assert
    expect(() => deck.trashFromLibrary("Pot of Greed")).toThrowError(
      "No Pot of Greed in library."
    );
  });
});
