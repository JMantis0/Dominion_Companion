import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processRevealsLine()", () => {
  let deck = new Deck("", false, "", "pName", "pNick", []);
  const setAsideFromLibrary = jest
    .spyOn(Deck.prototype, "setAsideFromLibrary")
    .mockImplementation(() => null);
  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });
  it("should move cards revealed by a Bandit play to from library to setAside", () => {
    deck.latestPlay = "Bandit";

    deck.processRevealsLine(["Gold", "Silver"], [1, 1]);

    expect(setAsideFromLibrary).toBeCalledTimes(2);
    expect(setAsideFromLibrary).nthCalledWith(1, "Gold");
    expect(setAsideFromLibrary).nthCalledWith(2, "Silver");
  });
});
