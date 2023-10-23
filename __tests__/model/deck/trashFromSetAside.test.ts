import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method trashFromSetAside", () => {
  // Instantiate deck object
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies
  const setTrash = jest
    .spyOn(Deck.prototype, "setTrash")
    .mockImplementation(() => null);
  const removeCardFromEntireDeck = jest
    .spyOn(Deck.prototype, "removeCardFromEntireDeck")
    .mockImplementation(() => null);
  const setSetAside = jest.spyOn(Deck.prototype, "setSetAside");
  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should add the given card to trash and remove it from the entireDeck", () => {
    //Arrange
    deck.trash = ["Trash1", "Trash2"];
    deck.entireDeck = ["Card1", "Card2", "Copper"];
    deck.setAside = ["Copper", "Estate"];

    // Act - simulate trashing Copper from setAside
    deck.trashFromSetAside("Copper");

    // Assert
    expect(setTrash).toBeCalledTimes(1);
    expect(setTrash).toBeCalledWith(["Trash1", "Trash2", "Copper"]); //Add Copper to trash
    expect(removeCardFromEntireDeck).toBeCalledTimes(1);
    expect(removeCardFromEntireDeck).toBeCalledWith("Copper"); //Remove Copper from entireDeck
    expect(setSetAside).toBeCalledTimes(1);
    expect(setSetAside).toBeCalledWith(["Estate"]); // Remove Copper from setAside
  });

  it("should throw an error if the given card is not in setAside=", () => {
    // Arrange
    deck.trash = ["Trash1", "Trash2"];
    deck.entireDeck = ["Card1", "Card2", "Copper", "Pot of Greed"]; // Card in entireDeck, but not setAside
    deck.setAside = ["Copper", "Estate"];

    // Act and Assert - simulate trashing a card from setAside that is not in the entireDeck
    expect(() => deck.trashFromSetAside("Pot of Greed")).toThrowError(
      "No Pot of Greed in setAside."
    );
  });
});
