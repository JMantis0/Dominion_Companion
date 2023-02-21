import React, { useState } from "react";

const Accordion = () => {
  const [isActive, setIsActive] = useState(false);

  const accordionData = {
    title: "Section 1",
    content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
      laborum cupiditate possimus labore, hic temporibus velit dicta earum
      suscipit commodi eum enim atque at? Et perspiciatis dolore iure
      voluptatem.`,
  };

  const { title, content } = accordionData;

  return (
    <React.Fragment>
        <div id="accordion" className="accordion">
          <div className="accordion-item">
            <div
              className="accordion-title"
              onClick={() => setIsActive(!isActive)}
            >
              <div>Deck</div>
              <div>{isActive ? "^" : "v"}</div>
            </div>
            {isActive && <div className="accordion-content">{content}</div>}
          </div>
        </div>
    </React.Fragment>
  );
};

export default Accordion;
