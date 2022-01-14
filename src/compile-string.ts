import parse from "./parse";
import compile from "compile";
import { getInclusionPath, readFile } from "file-utils";
/* TYPES */

import type { AstObject } from "./parse";
/* END TYPES */

/**
 * Compiles a template string to a function string. Most often users just use `compile()`, which calls `compileToString` and creates a new function using the result
 *
 * **Example**
 *
 * ```js
 * compileToString("Hi <%= it.user %>", eta.config)
 * // "var tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR"
 * ```
 */

export default function compileToString(
  str: string,
  config: Record<string, any>
): string {
  const buffer: Array<AstObject> = parse(str, config);

  let res =
    "let tR='',__l,__lP" +
    "\nfunction layout(p,d){__l=p;__lP=d}\n" +
    (config.useWith ? "with(" + config.varName + "||{}){" : "") +
    compileScope(buffer, config) +
    (config.includeFile
      ? "if(__l)tR=" +
        (config.async ? "await " : "") +
        `includeFile(__l,Object.assign(${config.varName},{body:tR},__lP))\n`
      : config.include
      ? "if(__l)tR=" +
        (config.async ? "await " : "") +
        `include(__l,Object.assign(${config.varName},{body:tR},__lP))\n`
      : "") +
    "return tR" +
    (config.useWith ? "}" : "");
  return res;
}

function compileScope(buff: Array<AstObject>, config: Record<string, any>) {
  let i = 0;
  const buffLength = buff.length;
  let returnStr = "";

  for (i; i < buffLength; i++) {
    const currentBlock = buff[i];
    if (typeof currentBlock === "string") {
      const str = currentBlock;

      // we know string exists
      returnStr += "tR+='" + str + "'\n";
    } else {
      const type = currentBlock.t;
      let content = currentBlock.val || "";

      if (type === "r") {
        // raw

        if (config.filter) {
          content = "E.filter(" + content + ")";
        }

        returnStr += "tR+=" + content + "\n";
      } else if (type === "i") {
        // interpolate

        if (config.filter) {
          content = "E.filter(" + content + ")";
        }

        if (config.autoEscape) {
          content = "E.e(" + content + ")";
        }
        returnStr += "tR+=" + content + "\n";
        // reference
      } else if (type === "inc") {
        const match = content.match(/\s*(\w+)\s*,\s*({.+})/);
        const inclusionName = match?.[1] || "";
        const inclusionArgs = match?.[2];

        const filePath = getInclusionPath(inclusionName);
        const fileTemplate = readFile(filePath);

        content = `(${compile(fileTemplate)})(${inclusionArgs})`;
        returnStr += "tR+=" + content + "\n";
      } else if (type === "e") {
        // execute
        returnStr += content + "\n"; // you need a \n in case you have <% } %>
      }
    }
  }

  return returnStr;
}
