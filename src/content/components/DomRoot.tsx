import React from "react";
import DiscardHover from "./DiscardHover";
import LibraryHover from "./LibraryHover";
import LogContainerCover from "./LogContainerCover";
import Accordion from "./Accordion";
const DomRoot = () => {
  return (
    <div id="domRoot">
      <DiscardHover />
      <LibraryHover />
      <LogContainerCover />
      <Accordion />
    </div>
  );
};

export default DomRoot;
