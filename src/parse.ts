import { ParseErr } from "./err";
import { trimWS } from "./utils";

/* TYPES */
import type { ConfigT } from "./config";

export interface TemplateObject {
  type: string;
  value: string;
}

/* END TYPES */

const templateLitReg =
  /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;

const singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;

const doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;

function escapeRegExp(string: string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export default function parse(
  str: string,
  config: ConfigT
): Array<TemplateObject> {
  const buffer: Array<TemplateObject> = [];
  let trimLeftOfNextStr: string | false = false;
  let lastIndex = 0;
  const parseOptions = config.customParse;

  if (config.rmWhitespace) {
    // Code taken directly from EJS
    // Have to use two separate replaces here as `^` and `$` operators don't
    // work well with `\r` and empty lines don't work well with the `m` flag.
    // Essentially, this replaces the whitespace at the beginning and end of
    // each line and removes multiple newlines.
    str = str.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
  }

  templateLitReg.lastIndex = 0;
  singleQuoteReg.lastIndex = 0;
  doubleQuoteReg.lastIndex = 0;

  function pushString(strng: string, shouldTrimRightOfString?: string | false) {
    if (strng) {
      strng = trimWS(
        strng,
        config,
        trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
        shouldTrimRightOfString
      );

      if (strng) {
        // replace \ with \\, ' with \'
        // we're going to convert all CRLF to LF so it doesn't take more than one replace

        strng = strng.replace(/\\|'/g, "\\$&").replace(/\r\n|\n|\r/g, "\\n");

        buffer.push({ type: "string", value: strng });
      }
    }
  }

  const prefixes = Object.values(parseOptions).map((option) => option.prefix);

  const prefixesRegExp = prefixes.reduce(function (accumulator, prefix) {
    if (accumulator && prefix) {
      return accumulator + "|" + escapeRegExp(prefix);
    } else if (prefix) {
      // accumulator is falsy
      return escapeRegExp(prefix);
    } else {
      // prefix and accumulator are both falsy
      return accumulator;
    }
  }, "");

  const parseOpenReg = new RegExp(
    "([^]*?)" +
      escapeRegExp(config.tags[0]) +
      "(-|_)?\\s*(" +
      prefixesRegExp +
      ")?\\s*",
    "g"
  );

  const parseCloseReg = new RegExp(
    "'|\"|`|\\/\\*|(\\s*(-|_)?" + escapeRegExp(config.tags[1]) + ")",
    "g"
  );

  let m;

  while ((m = parseOpenReg.exec(str))) {
    lastIndex = m[0].length + m.index;

    const precedingString = m[1];
    const wsLeft = m[2];
    const prefix = m[3] || "";

    pushString(precedingString, wsLeft);

    parseCloseReg.lastIndex = lastIndex;
    let closeTag;
    let currentObj: TemplateObject | false = false;

    while ((closeTag = parseCloseReg.exec(str))) {
      if (closeTag[1]) {
        const content = str.slice(lastIndex, closeTag.index);

        parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;

        trimLeftOfNextStr = closeTag[2];

        const currentType = Object.keys(parseOptions)[prefixes.indexOf(prefix)];

        if (currentType) currentObj = { type: currentType, value: content };
        break;
      } else {
        const char = closeTag[0];
        if (char === "/*") {
          const commentCloseInd = str.indexOf("*/", parseCloseReg.lastIndex);

          if (commentCloseInd === -1) {
            ParseErr("unclosed comment", str, closeTag.index);
          }
          parseCloseReg.lastIndex = commentCloseInd;
        } else if (char === "'") {
          singleQuoteReg.lastIndex = closeTag.index;

          const singleQuoteMatch = singleQuoteReg.exec(str);
          if (singleQuoteMatch) {
            parseCloseReg.lastIndex = singleQuoteReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        } else if (char === '"') {
          doubleQuoteReg.lastIndex = closeTag.index;
          const doubleQuoteMatch = doubleQuoteReg.exec(str);

          if (doubleQuoteMatch) {
            parseCloseReg.lastIndex = doubleQuoteReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        } else if (char === "`") {
          templateLitReg.lastIndex = closeTag.index;
          const templateLitMatch = templateLitReg.exec(str);
          if (templateLitMatch) {
            parseCloseReg.lastIndex = templateLitReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        }
      }
    }
    if (currentObj) {
      buffer.push(currentObj);
    } else {
      ParseErr("unclosed tag", str, m.index + precedingString.length);
    }
  }

  pushString(str.slice(lastIndex, str.length), false);

  return buffer;
}
