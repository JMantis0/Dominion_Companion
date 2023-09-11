import React, { FunctionComponent, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const LogViewer: FunctionComponent = ({}) => {
  const logHtml = useSelector((state: RootState) => state.options.logHtml);
  const createMarkup = (html: string) => {
    const parsedHtml = html
      .replace(/<div class="log-line-block"/g, "<span")
      .replace(/<\/span><\/div>/g, "</span></span>");
    console.log(parsedHtml);
    return {
      __html: parsedHtml,
    };
  };

  const logDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("LogHTML changed");
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
