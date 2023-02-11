/*
Used to check if the current dom has a log present.  If not, the player isn't in a game.
*/
const isGameLogPresent = (): boolean => {
  const gameLogElementCollection = document.getElementsByClassName("game-log");
  const gameLogElementCount = gameLogElementCollection.length;
  const gameLogPresent = gameLogElementCount > 0;
  return gameLogPresent;
};

/*
Used to extract the entire game log from the dom and returns it as a string
*/
const getGameLog = (): string => {
  const gameLogElement = document.getElementsByClassName(
    "game-log"
  )[0] as HTMLElement;
  const gameLog = gameLogElement.innerText;
  return gameLog;
};

const arePlayerInfoElementsPresent = (): boolean => {
  const playerElements = document.getElementsByTagName(
    "player-info-name"
  ) as HTMLCollectionOf<HTMLElement>;
  const playerElementsPresent = playerElements.length > 0;
  return playerElementsPresent;
};

const getPlayerInfoElements = (): HTMLCollectionOf<HTMLElement> => {
  const playerInfoElements: HTMLCollectionOf<HTMLElement> =
    document.getElementsByTagName(
      "player-info"
    ) as HTMLCollectionOf<HTMLElement>;

  return playerInfoElements;
};

const getPlayerInfoNameElements = (): HTMLCollectionOf<HTMLElement> => {
  let playerInfoNameElements: HTMLCollectionOf<HTMLElement>;
  playerInfoNameElements = document.getElementsByTagName(
    "player-info-name"
  ) as HTMLCollectionOf<HTMLElement>;

  return playerInfoNameElements;
};

const getPlayerAndOpponentNameByComparingElementPosition = (
  playerInfoElements: HTMLCollectionOf<HTMLElement>
): Array<string> => {
  let playerName: string;
  let opponentName: string;
  let playerTransformComparison = [];
  for (let element of playerInfoElements) {
    const nameElement = element.getElementsByTagName(
      "player-info-name"
    )[0] as HTMLElement; 
    const nomen = nameElement.innerText;
    const transform = element.style.transform;
    const yTransForm = parseFloat(
      transform.split(" ")[1].replace("translateY(", "").replace("px)", "")
    );
    playerTransformComparison.push([nomen, yTransForm]);
  }
  //  Compare the Ytransform values.  The greatest one gets assigned to player.
  //  The lower one gets assigned to opponent
  const p1TransformValue = playerTransformComparison[0][1];
  const p2TransformValue = playerTransformComparison[1][1];
  const p1Name = playerTransformComparison[0][0];
  const p2Name = playerTransformComparison[1][0];

  if (p1TransformValue > p2TransformValue) {
    // p1 is the player, p2 is the opponent
    playerName = p1Name;
    opponentName = p2Name;
  } else {
    // p2 is the player, p1 is the opponent
    playerName = p2Name;
    opponentName = p1Name;
  }

  return [playerName, opponentName];
};

export {
  isGameLogPresent,
  getGameLog,
  arePlayerInfoElementsPresent,
  getPlayerInfoElements,
  getPlayerInfoNameElements,
  getPlayerAndOpponentNameByComparingElementPosition,
};
