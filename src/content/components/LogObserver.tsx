import React, { FunctionComponent, useEffect } from "react";
import { Deck } from "../../model/deck";
import {
  areNewLogsToSend,
  getGameLog,
  getUndispatchedLogs,
} from "../contentFunctions";
import { setPlayerDeck } from "../../redux/contentSlice";
import { useDispatch } from "react-redux";
import { ContentProps } from "../DomRoot";

const LogObserver: FunctionComponent<ContentProps> = ({
  playerName,
  decks: d,
  gameLog: g,
  logsProcessed: lp,
}) => {
  const dispatch = useDispatch();
  let logsProcessed: string = lp;
  let gameLog: string = g;
  let decks: Map<string, Deck> = d;

  const observerFunc: MutationCallback = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        const addedNodes = mutation.addedNodes;
        if (addedNodes.length > 0) {
          const lastAddedNode: HTMLElement = addedNodes[
            addedNodes.length - 1
          ] as HTMLElement;
          const lastAddedNodeText = lastAddedNode.innerText;
          if (lastAddedNodeText.length > 0) {
            if (areNewLogsToSend(logsProcessed, getGameLog())) {
              gameLog = getGameLog();
              const newLogsToDispatch = getUndispatchedLogs(
                logsProcessed,
                gameLog
              )
                .split("\n")
                .slice();
              decks.get(playerName)?.update(newLogsToDispatch);
              dispatch(
                setPlayerDeck(JSON.parse(JSON.stringify(decks.get(playerName))))
              );
              logsProcessed = gameLog;
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    const mo = new MutationObserver(observerFunc);
    const gameLogElement = document.getElementsByClassName("game-log")[0];
    mo.observe(gameLogElement, {
      childList: true,
      subtree: true,
    });
    if (areNewLogsToSend(logsProcessed, getGameLog())) {
      gameLog = getGameLog();
      const newLogsToDispatch = getUndispatchedLogs(logsProcessed, gameLog)
        .split("\n")
        .slice();
      decks.get(playerName)?.update(newLogsToDispatch);
    }
    dispatch(setPlayerDeck(JSON.parse(JSON.stringify(decks.get(playerName)))));
    return () => {
      mo.disconnect();
    };
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          console.log("gameLog", gameLog.split("\n"));
          console.log("logsProcessed", logsProcessed.split("\n"));
        }}
      >
        show gameLog /logsProcessed
      </button>
    </div>
  );
};

export default LogObserver;
