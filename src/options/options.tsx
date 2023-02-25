import React, { useEffect } from "react";
import DataInterface from "./components/DataInterface";

const Options = () => {
  useEffect(() => {
    console.log("From the Options component.js");

    return () => {};
  }, []);
  return (
    <div>
      <h1 className="text-4xl text-green-500">Dom View</h1>
      <ul>
        <li>
          <a href="#/">Full List</a>
        </li>
        <li>
          <a href="#/currentGame">Current Game</a>
        </li>
      </ul>
      <DataInterface />
    </div>
  );
};

export default Options;
