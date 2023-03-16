import React, { useEffect, useState } from "react";

const options = () => {
  const [chromeStorage, setChromeStorage] = useState();
  useEffect(() => {
    chrome.storage.local.get(null, (items: any) => {
      console.log(items);
    });
  }, []);
  return <div>options</div>;
};

export default options;
