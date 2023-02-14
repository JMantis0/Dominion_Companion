import { Deck } from "../../model/deck";
import { resetGame } from "../content";

export type ErrorWithMessage = {
  message: string;
};

export const isErrorWithMessage = (
  error: unknown
): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

export const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
};

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};

export const appendElements = (
  logInitialized: boolean,
  kingdomInitialized: boolean,
  playersInitialized: boolean,
  playerDeckInitialized: boolean,
  logsProcessed: string,
  gameLog: string,
  playerNames: Array<string>,
  playerAbbreviatedNames: Array<string>,
  decks: Map<string, Deck>,
  kingdom: Array<string>,
  treasureLine: boolean,
  observerOn: boolean
) => {
  const mydiv = $("<div>").attr("id", "dev-btns").text("Dev-Buttons");
  $(".chat-display").append(mydiv);
  mydiv.append($("<button>").attr("id", "statebutton").text("LOG DECK STATE"));
  mydiv.append(
    $("<button>")
      .text("Reset")
      .on("click", () => {
        resetGame();
      })
  );
  mydiv.append(
    $("<button>")
      .attr("id", "newLogsButton")
      .text("Console Log Globals")
      .on("click", () => {
        console.log("logInitialized: ", logInitialized);
        console.log("kingdomInitialized: ", kingdomInitialized);
        console.log("playersInitialized: ", playersInitialized);
        console.log("playerDeckInitialized: ", playerDeckInitialized);
        console.group("LogsProcessed Array");
        console.log("logsProcessed: ", logsProcessed.split("\n"));
        console.groupEnd();
        console.group("gameLog Array");
        console.log("gameLog: ", gameLog.split("\n"));
        console.groupEnd();
        console.log("playerNames: ", playerNames);
        console.log("playerAbbreviatedNames: ", playerAbbreviatedNames);
        console.log("decks: ", decks);
        console.log("kingdom: ", kingdom);
        console.log("treasureLine: ", treasureLine);
        console.log("observerOn: ", observerOn);
      })
  );
};
