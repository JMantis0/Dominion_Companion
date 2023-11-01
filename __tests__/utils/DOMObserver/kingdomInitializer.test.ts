/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { setBaseOnly as setBaseOnlyRedux } from "../../../src/redux/contentSlice";
describe("playersInitializer", () => {
  // Mock dependencies
  const isKingdomElementPresent = jest.spyOn(
    DOMObserver,
    "isKingdomElementPresent"
  );
  const getClientKingdom = jest.spyOn(DOMObserver, "getClientKingdom");
  const baseKingdomCardCheck = jest.spyOn(DOMObserver, "baseKingdomCardCheck");
  const dispatch = jest.spyOn(DOMObserver, "dispatch");
  const setKingdom = jest.spyOn(DOMObserver, "setKingdom");
  const setBaseOnly = jest.spyOn(DOMObserver, "setBaseOnly");
  const setKingdomInitialized = jest.spyOn(
    DOMObserver,
    "setKingdomInitialized"
  );

  

  it("should initialize the kingdom and baseOnly fields, and dispatch the redux action for baseOnly if the kingdom element is present in the DOM (Case: base kingdom)", () => {
    // Arrange a scenario where the kingdom element is present in the DOM and the kingdom contains only base cards.
    isKingdomElementPresent.mockImplementation(() => true);
    const mockKingdom = ["Card1", "Card2"];
    getClientKingdom.mockImplementation(() => mockKingdom);
    baseKingdomCardCheck.mockImplementation(() => true);

    // Act - Simulate calling the kingdomInitializer when the kingdom element is present and it is a base kingdom.
    DOMObserver.kingdomInitializer();

    expect(isKingdomElementPresent).toBeCalledTimes(1);
    expect(isKingdomElementPresent.mock.results[0].value).toBe(true);
    expect(getClientKingdom).toBeCalledTimes(1);
    expect(getClientKingdom.mock.results[0].value).toBe(mockKingdom);
    expect(baseKingdomCardCheck).toBeCalledTimes(1);
    expect(baseKingdomCardCheck).toBeCalledWith(mockKingdom);
    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch).toBeCalledWith(setBaseOnlyRedux(true));
    expect(setKingdom).toBeCalledTimes(1);
    expect(setKingdom).toBeCalledWith(mockKingdom);
    expect(setBaseOnly).toBeCalledTimes(1);
    expect(setBaseOnly).toBeCalledWith(true);
    expect(setKingdomInitialized).toBeCalledTimes(1);
    expect(setKingdomInitialized).toBeCalledWith(true);
  });

  it("should initialize the kingdom and baseOnly fields, and dispatch the redux action for baseOnly if the kingdom element is present in the DOM (Case: non-base kingdom)", () => {
    // Arrange a scenario where the kingdom element is present in the DOM and the kingdom contains non-base cards.
    isKingdomElementPresent.mockImplementation(() => true);
    const mockKingdom = ["Card1", "Card2", "Non-base Card"];
    getClientKingdom.mockImplementation(() => mockKingdom);
    baseKingdomCardCheck.mockImplementation(() => false);

    // Act - Simulate calling the kingdomInitializer when the kingdom element is present and it is a base kingdom.
    DOMObserver.kingdomInitializer();

    // Assert
    expect(isKingdomElementPresent).toBeCalledTimes(1);
    expect(isKingdomElementPresent.mock.results[0].value).toBe(true);
    expect(getClientKingdom).toBeCalledTimes(1);
    expect(getClientKingdom.mock.results[0].value).toBe(mockKingdom);
    expect(baseKingdomCardCheck).toBeCalledTimes(1);
    expect(baseKingdomCardCheck).toBeCalledWith(mockKingdom);
    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch).toBeCalledWith(setBaseOnlyRedux(false));
    expect(setKingdom).toBeCalledTimes(1);
    expect(setKingdom).toBeCalledWith(mockKingdom);
    expect(setBaseOnly).toBeCalledTimes(1);
    expect(setBaseOnly).toBeCalledWith(false);
    expect(setKingdomInitialized).toBeCalledTimes(1);
    expect(setKingdomInitialized).toBeCalledWith(true);
  });

  it("Should not initialize the kingdom and baseOnly fields if the kingdom element is not present in the DOM.", () => {
    // Arrange scenario where the kingdom element is not present in the Client DOM.
    isKingdomElementPresent.mockImplementation(() => false);

    // Act - Simulate calling the kingdomInitializer when the kingdom element is not present in the DOM.
    DOMObserver.kingdomInitializer();

    // Assert
    expect(isKingdomElementPresent).toBeCalledTimes(1);
    expect(isKingdomElementPresent.mock.results[0].value).toBe(false);
    expect(getClientKingdom).not.toBeCalled();
    expect(baseKingdomCardCheck).not.toBeCalled();
    expect(dispatch).not.toBeCalled();
    expect(setKingdom).not.toBeCalled();
    expect(setBaseOnly).not.toBeCalled();
    expect(setKingdomInitialized).not.toBeCalled();
  });
});
