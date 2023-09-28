import React, { FunctionComponent, useEffect, useState } from "react";
import { OpponentStoreDeck } from "../../../../../model/opponentStoreDeck";
import { StoreDeck } from "../../../../../model/storeDeck";

type NameAndResultProps = {
  playerName: string;
  gameResult: "Victory" | "Defeat" | "Tie" | "Unfinished";
  deck: StoreDeck | OpponentStoreDeck;
};
const NameAndResult: FunctionComponent<NameAndResultProps> = ({
  playerName,
  gameResult,
  deck,
}) => {
  const [resultBlurb, setResultBlurb] = useState<string>("");
  useEffect(() => {
    switch (gameResult) {
      case "Victory":
        setResultBlurb("was Victorious");
        break;
      case "Defeat":
        setResultBlurb("was Defeated");
        break;
      case "Tie":
        setResultBlurb("tied");
        break;
      case "Unfinished":
        setResultBlurb("did not finish this game.");
        break;
      default:
        break;
    }
  }, [deck]);
  return (
    <React.Fragment>
      <div>
        {playerName} {resultBlurb}
      </div>
    </React.Fragment>
  );
};

export default NameAndResult;
