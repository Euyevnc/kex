const showdown = require("showdown");

const parseMarkdown = ({ markdown }: { markdown: string }): string => {
  const converter = new showdown.Converter({
    tables: true,
    tasklist: true,
    strikethrough: true,
    underline: true,
  });
  return converter.makeHtml(markdown);
};

export { parseMarkdown };
