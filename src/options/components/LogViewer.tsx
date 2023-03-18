import React, { FunctionComponent } from "react";

type LogViewerProps = {
  logHtml: string;
};

const LogViewer: FunctionComponent<LogViewerProps> = ({ logHtml }) => {
  const createMarkup = (html: string) => {
    const parsedHtml = html
      .replace(/<div class="log-line-block"/g, "<span")
      .replace(/<\/span><\/div>/g, "</span></span>");
    console.log(parsedHtml);
    return {
      __html: parsedHtml,
    };
  };

  return (
    <div
      className={`text-white`}
      dangerouslySetInnerHTML={createMarkup(logHtml)}
    ></div>
  );
};

export default LogViewer;
