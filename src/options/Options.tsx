import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import HistoryViewer from "./HistoryViewer/HistoryViewer";

const options = () => {
  useEffect(() => {
    document.title = "Dominion Game History";
  });
  return (
    <React.Fragment>
      <Provider store={store}>
        <HistoryViewer />
      </Provider>
    </React.Fragment>
  );
};

export default options;
