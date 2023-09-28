import React, { FunctionComponent, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const LogViewer: FunctionComponent = ({}) => {
  const logHtml = useSelector((state: RootState) => state.options.logHtml);
  const createMarkup = (html: string) => {
    const parsedHtml = html
      .replace(/<div class="log-line-block"/g, "<span")
      .replace(/<\/span><\/div>/g, "</span></span>");
    return {
      __html: parsedHtml,
    };
  };

  // logDiv ref and following useEffect resets the scroll bar of the Log back to the top when a new log is rendered.
  const logDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logDiv.current!.scrollTop = 0;
  }, [logHtml]);

  return (
    <div
      className={`h-full text-white overflow-y-scroll`}
      ref={logDiv}
      dangerouslySetInnerHTML={createMarkup(logHtml)}
    ></div>
  );
};

export default LogViewer;
