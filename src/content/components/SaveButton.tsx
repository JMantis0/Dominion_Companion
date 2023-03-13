import React from "react";

const SaveButton = () => {
  /**
   *
   * Save game to chrome storage
   *  use Game number as key
   */
  const saveGameToStorage = () => {};
  return (
    <button className={`text-xs text-white`} onClick={saveGameToStorage}>
      SaveButton
    </button>
  );
};

export default SaveButton;
