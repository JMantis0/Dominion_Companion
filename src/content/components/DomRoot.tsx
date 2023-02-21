import React from "react";
import DiscardHover from "./DiscardHover";
import LibraryHover from "./LibraryHover";
import LogContainerCover from "./LogContainerCover";

const DomRoot = () => {
  return (
    <div id="domRoot">
      <DiscardHover />
      <LibraryHover />
      <LogContainerCover />
    </div>
  );
};

export default DomRoot;
