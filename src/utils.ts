import { trimLeft, trimRight } from "./polyfills";

/* TYPES */
import type { Config } from "config";

interface EscapeMap {
  "&": "&amp;";
  "<": "&lt;";
  ">": "&gt;";
  '"': "&quot;";
  "'": "&#39;";
  [index: string]: string;
}
/* END TYPES */

export function hasOwnProp(obj: object, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function copyProps<T>(toObj: T, fromObj: T): T {
  for (const key in fromObj) {
    if (hasOwnProp(fromObj as unknown as object, key)) {
      toObj[key] = fromObj[key];
    }
  }
  return toObj;
}

function trimWS(
  str: string,
  config: Config,
  wsLeft: string | false,
  wsRight?: string | false
): string {
  let leftTrim;
  let rightTrim;

  if (Array.isArray(config.autoTrim)) {
    leftTrim = config.autoTrim[1];
    rightTrim = config.autoTrim[0];
  } else {
    leftTrim = rightTrim = config.autoTrim;
  }

  if (wsLeft || wsLeft === false) {
    leftTrim = wsLeft;
  }

  if (wsRight || wsRight === false) {
    rightTrim = wsRight;
  }

  if (!rightTrim && !leftTrim) {
    return str;
  }

  if (leftTrim === "slurp" && rightTrim === "slurp") {
    return str.trim();
  }

  if (leftTrim === "_" || leftTrim === "slurp") {
    str = trimLeft(str);
  } else if (leftTrim === "-" || leftTrim === "nl") {
    str = str.replace(/^(?:\r\n|\n|\r)/, "");
  }

  if (rightTrim === "_" || rightTrim === "slurp") {
    // full slurp
    str = trimRight(str);
  } else if (rightTrim === "-" || rightTrim === "nl") {
    // nl trim
    str = str.replace(/(?:\r\n|\n|\r)$/, ""); // TODO: make sure this gets \r\n
  }

  return str;
}

/**
 * A map of special HTML characters to their XML-escaped equivalents
 */

const escMap: EscapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function replaceChar(s: string): string {
  return escMap[s];
}

/**
 * XML-escapes an input value after converting it to a string
 *
 * @param str - Input value (usually a string)
 * @returns XML-escaped string
 */

function XMLEscape(str: any): string {
  const newStr = String(str);
  if (/[&<>"']/.test(newStr)) {
    return newStr.replace(/[&<>"']/g, replaceChar);
  } else {
    return newStr;
  }
}

export { trimWS, XMLEscape };
