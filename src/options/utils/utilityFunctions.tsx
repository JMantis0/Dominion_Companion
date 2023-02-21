export const getCountsFromArray = (
  decklistArray: Array<string>
): Map<string, number> => {
  const cardCountsMap = new Map<string, number>();
  decklistArray.forEach((card) => {
    if (cardCountsMap.has(card)) {
      cardCountsMap.set(card, cardCountsMap.get(card)! + 1);
    } else {
      cardCountsMap.set(card, 1);
    }
  });
  return cardCountsMap;
};
