import { sortMainViewer } from "../../src/utils/utils";
import { describe, it, expect } from "@jest/globals";
import { CardCounts, SortCategory, StoreDeck } from "../../src/utils";
import { getMapArray } from "../testUtilFuncs";



describe("sortMainViewer", () => {
  // Following 4 cases are for sortParam "probability" and sortTpe "ascending".
  // In this case, the function first sorts by the comparing the amounts of the two cards the library (zoneCount).
  // If the two zoneCounts are equal, the function will then sort by the hypergeometric probabilities of drawing the two cards, using the arguments passed into the function.
  // In the event both of the compared zoneCounts are equal, and both of the compared probabilities are equal, the sort function will sort using the total number of those cards in the entireDeckList (entireDeckCount).
  // If it should happen that the numbers in the library (zoneCount) being compared are equal, the probabilities of two cards are equal, and the number owned (entireDeckCount) are equal, and then the function will sort by cardName.
  // The following for tests cases confirm the function is sorting according to this setup correctly.

  // Case 1
  it("should sort by probability correctly by sorting according to zoneCount in ascending order", () => {
    //Probability ascending. This case has all unequal zoneCounts.

    // Arrange
    const sortParam: SortCategory = "probability";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: [],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 2
  it("should sort by probability correctly in ascending order by sorting according to hypergeometric probability if any two zoneCounts are equal", () => {
    // Case with equal zoneCount that should then sort by hypergeometric instead.  No equal hypergeometrics.

    // Arrange
    const sortParam: SortCategory = "probability";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }], //  2 CardF added to the above case, 0 in library, 1 in graveyard, 1 in inPlay.
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }], //  2 CardE added to the above case, 0 in library 2 in graveyard.
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: ["CardE", "CardF", "CardF"],
      inPlay: ["CardE"], // Placing 1 card E in inPlay.  This card will not be considered in the hypergeometric probability because the parameter for turn is "Current".
      hand: [],
      trash: [],
      setAside: [],
    };
    // topCardsLookAmount set greater than library size but less than library size + graveyard size
    //  to make CardE and CardF have nonzero probabilities.  If this were less than 11 or greater
    // than 12 the hypergeometrics for card E and F would be equal (0% probability if topCardsLookAmount <=10, 100% if topCardsLookAmount >= 13)
    const topCardsLookAmount = 11;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }], // Equal zoneCount to CardE, but should sort using greater hyperGeometric than CardF (2 in graveyard vs 1)
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 3
  it("should sort by probability correctly in ascending order and then by Hypergeometric if zone count equal and then sort by entireDeckCount if hyperGeometric is equal", () => {
    // Case with equal zoneCounts that also have equal hypergeometric should then sort by entireDeckCount instead.  No equal entireDeckCount.

    // Arrange
    const sortParam: SortCategory = "probability";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardG", { entireDeckCount: 3, zoneCount: 0 }], // 3 CardG added to the case above (2 to graveyard, 1 to inPlay).  zoneCount and hypergeometric probability is equal to cardF, so should sort by entireDeckCount
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: ["CardE", "CardF", "CardF", "CardG", "CardG"],
      inPlay: ["CardG", "CardE"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 11; //Similar to above, setting topCardsLookAmount to one greater than the library size.
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardG", { entireDeckCount: 3, zoneCount: 0 }], //Equal hyperGeometric to CardF, but greater entireDeckCount
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 4
  it("should sort by probability correctly in ascending order and then by Hypergeometric if zone count equal and then sort by entireDeckCount if hyperGeometric is equal, and THEN by cardName if the entireDeckCounts are equal", () => {
    // Case with equal zoneCounts that also have equal hypergeometric that also have equal entireDeckCount should sort by cardName.

    // Arrange
    const sortParam: SortCategory = "probability";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardH", { entireDeckCount: 3, zoneCount: 0 }], // Adding 3 CardH to the case above, with equal zoneCount, hypergeometric probability, and entireDeck count to CardG, so it should be sorted by cardName compared to CardG
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardG", { entireDeckCount: 3, zoneCount: 0 }],
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardH",
        "CardH",
        "CardH",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: [
        "CardE",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardH",
        "CardH",
      ],
      inPlay: ["CardG", "CardE", "CardH"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 11;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardG", { entireDeckCount: 3, zoneCount: 0 }],
      ["CardH", { entireDeckCount: 3, zoneCount: 0 }], // Adding 3 CardH to the case above, with equal zoneCount, hypergeometric probability, and entireDeck count to CardG, so it should be sorted by cardName compared to CardG
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // descending
  // Case 5
  it("should sort by probability correctly in descending order", () => {
    // simple descending.  If equal zoneCounts should sort by hyperGeometric.  if equal hyperGeometric should sort by
    // entireDeckCount.  If entireDeckCount equal should sort by card name.  This case has all unequal zoneCounts.

    // Arrange
    const sortParam: SortCategory = "probability";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
    ]);
    const sortType = "descending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
      ],
      library: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
      ],
      graveyard: [],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 6
  it("should sort by probability correctly in descending order by sorting according to hypergeometric probability if any two zoneCounts are equal", () => {
    // Case with equal zoneCount that should then sort by hypergeometric instead.  No equal hypergeometrics.

    // Arrange
    const sortParam: SortCategory = "probability";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }], //  2 CardF added to the above case, 0 in library, 1 in graveyard, 1 in inPlay.
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }], //  2 CardE added to the above case, 0 in library 2 in graveyard.
    ]);
    const sortType = "descending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: ["CardE", "CardF", "CardF"],
      inPlay: ["CardE"], // Placing 1 card E in inPlay.  This card will not be considered in the hypergeometric probability because the parameter for turn is "Current".
      hand: [],
      trash: [],
      setAside: [],
    };
    // topCardsLookAmount set greater than library size but less than library size + graveyard size
    //  to make CardE and CardF have nonzero probabilities.  If this were less than 11 or greater
    // than 12 the hypergeometrics for card E and F would be equal (0% probability if topCardsLookAmount <=10, 100% if topCardsLookAmount >= 13)
    const topCardsLookAmount = 11;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }], // Equal zoneCount to CardE, but should sort using greater hyperGeometric than CardF (2 in graveyard vs 1)
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 7
  it("should sort by probability correctly in descending order and then by Hypergeometric if zone count equal and then sort by entireDeckCount if hyperGeometric is equal", () => {
    // Case with equal zoneCounts that also have equal hypergeometric should then sort by entireDeckCount instead.  No equal entireDeckCount.

    // Arrange
    const sortParam: SortCategory = "probability";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardG", { entireDeckCount: 3, zoneCount: 0 }], // 3 CardG added to the case above (2 to graveyard, 1 to inPlay).  zoneCount and hypergeometric probability is equal to cardF, so should sort by entireDeckCount
    ]);
    const sortType = "descending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: ["CardE", "CardF", "CardF", "CardG", "CardG"],
      inPlay: ["CardG", "CardE"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 11; //Similar to above, setting topCardsLookAmount to one greater than the library size.
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardG", { entireDeckCount: 3, zoneCount: 0 }], //Equal hyperGeometric to CardF, but greater entireDeckCount
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 8
  it("should sort by probability correctly in descending order and then by Hypergeometric if zone count equal and then sort by entireDeckCount if hyperGeometric is equal, and THEN by cardName if the entireDeckCounts are equal", () => {
    // Case with equal zoneCounts that also have equal hypergeometric that also have equal entireDeckCount should sort by cardName.

    // Arrange
    const sortParam: SortCategory = "probability";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardH", { entireDeckCount: 3, zoneCount: 0 }], // Adding 3 CardH to the case above, with equal zoneCount, hypergeometric probability, and entireDeck count to CardG, so it should be sorted by cardName compared to CardG
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardG", { entireDeckCount: 3, zoneCount: 0 }],
    ]);
    const sortType = "descending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardH",
        "CardH",
        "CardH",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: [
        "CardE",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardH",
        "CardH",
      ],
      inPlay: ["CardG", "CardE", "CardH"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 11;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardE", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardF", { entireDeckCount: 2, zoneCount: 0 }],
      ["CardH", { entireDeckCount: 3, zoneCount: 0 }], // Adding 3 CardH to the case above, with equal zoneCount, hypergeometric probability, and entireDeck count to CardG, so it should be sorted by cardName compared to CardG
      ["CardG", { entireDeckCount: 3, zoneCount: 0 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 9
  it("should sort by 'owned' correctly in ascending order", () => {
    // sort by amount owned ascending with no equal owned amounts.

    // Arrange
    const sortParam: SortCategory = "owned";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: [],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 10
  it("should sort by 'owned' correctly in ascending order and then by zoneCount if owned count equal.", () => {
    // sort by amount owned ascending with no some equal owned amounts.

    // Arrange
    const sortParam: SortCategory = "owned";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }], // Adding 3 CardE to the Case 9 above. (2 to library, 1 to graveyard.)  Since owned count is the same as CardC, it should be sorted by zoneCount.
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardE",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
      ],
      graveyard: ["CardE"],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }], // CardE has equal entireDeck count to CardC, so it should be sorted by zoneCount.
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 11
  it("should sort by 'owned' correctly in ascending order and then by zoneCount if owned count equal, and then by hyperGeometric if zoneCount equal", () => {
    // sort by amount owned ascending with no some equal owned amounts, and zone counts
    // Arrange
    const sortParam: SortCategory = "owned";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardF", { entireDeckCount: 4, zoneCount: 0 }], // Adding 4 CardF to Case10 from above ( 1 to inPlay, 3 to graveyard).
      ["CardG", { entireDeckCount: 4, zoneCount: 0 }], // Adding 4 CardG to Case10 from above (4 to graveyard).  since it has equal owned count and equal zoneCount to cardF, it should sort by the hypergeometric probability.
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardG",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
      ],
      graveyard: [
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardG",
      ],
      inPlay: ["CardF"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 13; // Setting topCardsLookAmount to 13 (library size + 1) to ensure that hypergeometric probability for drawing CardF and CardG are not equal;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardG", { entireDeckCount: 4, zoneCount: 0 }], // CardG and CardF should be sorted by probability, because they have equal owned count and equal zoneCount.  CardG has greater probability.
      ["CardF", { entireDeckCount: 4, zoneCount: 0 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 12
  it("should sort by 'owned' correctly in ascending order and then by zoneCount if owned count equal, and then by hyperGeometric if zoneCount equal, and if those are equal, sort by cardName", () => {
    // sort by amount owned ascending with no some equal owned amounts, zone counts, and probability.

    // For this case all that is needed to test is to change the topCardsLookAmount to 1.  Then the probabilities for CardF and CardG are equal, as well as their owned count and zone count, so
    // they should be sorted by cardName

    // Arrange
    const sortParam: SortCategory = "owned";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardG", { entireDeckCount: 4, zoneCount: 0 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardF", { entireDeckCount: 4, zoneCount: 0 }],
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardG",
        "CardB2",
        "CardB2",
        "CardB2",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardB2",
        "CardB2",
        "CardB2",
      ],
      graveyard: [
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardG",
      ],
      inPlay: ["CardF"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1; // Setting topCardsLookAmount to 1
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardF", { entireDeckCount: 4, zoneCount: 0 }],
      ["CardG", { entireDeckCount: 4, zoneCount: 0 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 13
  it("should sort by 'owned' in descending order", () => {
    // sort by amount owned descending with no equal owned amounts.

    // Arrange
    const sortParam: SortCategory = "owned";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
    ]);
    const sortType = "descending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: [],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 14
  it("should sort by 'owned' correctly in descending order and then by zoneCount if owned count equal.", () => {
    // sort by amount owned descending with some equal owned amounts.

    // Arrange
    const sortParam: SortCategory = "owned";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }], // Adding 3 CardE to the Case 9 above. (2 to library, 1 to graveyard.)  Since owned count is the same as CardC, it should be sorted by zoneCount.
    ]);
    const sortType = "descending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardE",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
      ],
      graveyard: ["CardE"],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }], // CardE has equal entireDeck count to CardC, so it should be sorted by zoneCount.
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 15
  it("should sort by 'owned' correctly in descending order and then by zoneCount if owned count equal, and then by hyperGeometric if zoneCount equal", () => {
    // sort by amount owned descending with some equal owned amounts and equal zoneCounts.

    // Arrange
    const sortParam: SortCategory = "owned";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardF", { entireDeckCount: 4, zoneCount: 0 }], // Adding 4 CardF to Case10 from above ( 1 to inPlay, 3 to graveyard).
      ["CardG", { entireDeckCount: 4, zoneCount: 0 }], // Adding 4 CardG to Case10 from above (4 to graveyard).  since it has equal owned count and equal zoneCount to cardF, it should sort by the hypergeometric probability.
    ]);
    const sortType = "descending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardG",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
      ],
      graveyard: [
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardG",
      ],
      inPlay: ["CardF"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 13; // Setting topCardsLookAmount to 13 (library size + 1) to ensure that hypergeometric probability for drawing CardF and CardG are not equal;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardF", { entireDeckCount: 4, zoneCount: 0 }],
      ["CardG", { entireDeckCount: 4, zoneCount: 0 }], // CardG and CardF should be sorted by probability, because they have equal owned count and equal zoneCount.  CardG has greater probability.
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 16
  it("should sort by 'owned' correctly in descending order and then by zoneCount if owned count equal, and then by hyperGeometric if zoneCount equal, and if those are equal, sort by cardName", () => {
    // sort by amount owned descending with equal owned amounts, equal zoneCount and equal probability.

    // For this case all that is needed to test is to change the topCardsLookAmount to 1.  Then the probabilities for CardF and CardG are equal, as well as their owned count and zone count, so
    // they should be sorted by cardName

    // Arrange
    const sortParam: SortCategory = "owned";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardG", { entireDeckCount: 4, zoneCount: 0 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardF", { entireDeckCount: 4, zoneCount: 0 }],
    ]);
    const sortType = "descending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardG",
        "CardB2",
        "CardB2",
        "CardB2",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
        "CardE",
        "CardE",
        "CardB2",
        "CardB2",
        "CardB2",
      ],
      graveyard: [
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardG",
      ],
      inPlay: ["CardF"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1; // Setting topCardsLookAmount to 1
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardE", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardG", { entireDeckCount: 4, zoneCount: 0 }], // CardG and CardF have same ownedCount, zoneCount, and probabilities, so they should be sorted by cardName
      ["CardF", { entireDeckCount: 4, zoneCount: 0 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 17
  it("should sort by amount in library (zone) correctly in ascending order", () => {
    //  Sort ascending by zoneCount with no equal zoneCounts
    // Arrange
    const sortParam: SortCategory = "zone";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
      ],
      library: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
      ],
      graveyard: [],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 18
  it("should sort by amount in library (zone) correctly in ascending order, and if equal, sort by amount owned", () => {
   //  Sort ascending by zoneCount with some equal zoneCounts, but no equal owned counts.

    // Arrange
    const sortParam: SortCategory = "zone";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardE", { entireDeckCount: 5, zoneCount: 4 }], //  Adding 5 CardE to the above case, (4 library, 1 graveyard), which will require CardE and CardC to be compared by amount owned.
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
        "CardE",
        "CardE",
        "CardE",
        "CardE",
        "CardE",
      ],
      library: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
        "CardE",
        "CardE",
        "CardE",
        "CardE",
      ],
      graveyard: ["CardE"],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardE", { entireDeckCount: 5, zoneCount: 4 }], //  Amount in library is equal to CardC, so it should be sorted by amount owned
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 19
  it("should sort by amount in library (zone) correctly in ascending order, and if equal, sort by amount owned, and if owned count is equal, sort by hypergeometric probability", () => {
     //  Sort ascending by zoneCount with some equal zoneCounts, and an  equal owned counts, but no equal probabilities.

    // Arrange
    const sortParam: SortCategory = "zone";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardE", { entireDeckCount: 5, zoneCount: 4 }],
      ["CardF", { entireDeckCount: 3, zoneCount: 2 }],  // Adding 3 CardF to the case from above (2 library, 1 graveyard). 
      ["CardG", { entireDeckCount: 3, zoneCount: 2 }],  // Adding 3 CardG to the case from above (2 library, 1 inPlay).  This will require CardF and CardG to be compared by probability
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
        "CardE",
        "CardE",
        "CardE",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
      ],
      library: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
        "CardE",
        "CardE",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
      ],
      graveyard: ["CardE", "CardF"],
      inPlay: ["CardG"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 19;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardE", { entireDeckCount: 5, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardF", { entireDeckCount: 3, zoneCount: 2 }], //  Equal zone count and total count than CardG,but greater hypergeometric probability
      ["CardG", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 20
  it("should sort by amount in library (zone) correctly in ascending order, and if equal, sort by amount owned, and if owned count is equal, sort by hypergeometric probability, and if hyperGeometric is equal, should sort by cardName", () => {
    //  Sort ascending by zoneCount with some equal zoneCounts, and equal owned counts, and equal probabilities.


    // Arrange
    const sortParam: SortCategory = "zone";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardE", { entireDeckCount: 5, zoneCount: 4 }],
      ["CardF", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardG", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardH", { entireDeckCount: 6, zoneCount: 3 }],  //  Adding 6 CardH (3 library, 3 graveyard)
      ["CardI", { entireDeckCount: 6, zoneCount: 3 }],  //  and 6 CardI (3 library, 3 graveyard)  making CardH and CardI have equal zoneCounts, owned counts, and probability, and they should be sorted by name
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
        "CardE",
        "CardE",
        "CardE",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardG",
        "CardH",
        "CardH",
        "CardH",
        "CardH",
        "CardH",
        "CardH",
        "CardI",
        "CardI",
        "CardI",
        "CardI",
        "CardI",
        "CardI",
      ],
      library: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
        "CardE",
        "CardE",
        "CardE",
        "CardE",
        "CardF",
        "CardF",
        "CardG",
        "CardG",
        "CardH",
        "CardH",
        "CardH",
        "CardI",
        "CardI",
        "CardI",
      ],
      graveyard: [
        "CardE",
        "CardF",
        "CardH",
        "CardH",
        "CardH",
        "CardI",
        "CardI",
        "CardI",
      ],
      inPlay: ["CardG"],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardE", { entireDeckCount: 5, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardH", { entireDeckCount: 6, zoneCount: 3 }], //  Equal totalCount, libraryCount, and Hypergeometric to I, but greater "CardName"
      ["CardI", { entireDeckCount: 6, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardF", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardG", { entireDeckCount: 3, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
    ]);

    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 21
  it("should sort map by cardName ascending correctly", () => {
    // Arrange
    const sortParam: SortCategory = "card";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
    ]);
    const sortType = "ascending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      library: [
        "CardA",
        "CardB",
        "CardB",
        "CardC",
        "CardC",
        "CardC",
        "CardD",
        "CardD",
        "CardD",
        "CardD",
      ],
      graveyard: [],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected Result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);

    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 22
  it("should sort map by cardName descending correctly", () => {
    // Arrange
    const sortParam: SortCategory = "card";
    const unsortedMap: Map<string, CardCounts> = new Map([
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
    ]);
    const sortType = "descending";
    const pd: StoreDeck = {
      currentVP: 0,
      gameResult: "Unfinished",
      gameTitle: "",
      gameTurn: 0,
      kingdom: [],
      lastEntryProcessed: "",
      logArchive: [],
      playerName: "",
      playerNick: "",
      rating: "",
      treasurePopped: false,
      waitToDrawLibraryLook: false,
      waitToShuffle: false,
      entireDeck: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
      ],
      library: [
        "CardB",
        "CardA",
        "CardA",
        "CardD",
        "CardD",
        "CardD",
        "CardC",
        "CardC",
        "CardC",
        "CardC",
      ],
      graveyard: [],
      inPlay: [],
      hand: [],
      trash: [],
      setAside: [],
    };
    const topCardsLookAmount = 1;
    const turn: "Current" | "Next" = "Current";

    // Act
    const sortedMap: Map<string, CardCounts> = sortMainViewer(
      sortParam,
      unsortedMap,
      sortType,
      pd,
      topCardsLookAmount,
      turn
    );

    // Expected Result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["CardD", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardC", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardB", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardA", { entireDeckCount: 2, zoneCount: 2 }],
    ]);

    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });


  // Could add cases for turn parameter equal to "Next" but it not necessary since that will be tested in the cetCumulativeProbabilityForCard tests.
});
