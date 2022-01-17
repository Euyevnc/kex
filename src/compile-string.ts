import parse from "./parse";
import compile from "compile";
import { getInclusionPath, getLayoutPath, readFile } from "file-utils";

/* TYPES */
import type { AstObject } from "./parse";
import type { Config } from "config";
/* END TYPES */

export default function compileToString(str: string, config: Config): string {
  const buffer: Array<AstObject> = parse(str, config);

  let res =
    "let tR=''\n" +
    (config.useWith ? "with(" + config.varName + "||{}){" : "") +
    compileScope(buffer, config) +
    "return tR" +
    (config.useWith ? "}" : "");
  return res;
}

function compileScope(buff: Array<AstObject>, config: Config) {
  let i = 0;
  const buffLength = buff.length;
  let returnStr = "";
  let layoutCall = "";
  for (i; i < buffLength; i++) {
    const currentBlock = buff[i];
    if (typeof currentBlock === "string") {
      const str = currentBlock;

      returnStr += "tR+='" + str + "'\n";
    } else {
      const type = currentBlock.t;
      let content = currentBlock.val || "";

      if (type === "r") {
        returnStr += "tR+=" + content + "\n";
      } else if (type === "i") {
        if (config.autoEscape) {
          content = config.e.toString() + `(${content})`;
        }
        returnStr += "tR+=" + content + "\n";
        // reference
      } else if (type === "inc") {
        const match = content.match(/\s*(\w+)\s*,\s*({.+})/);
        const inclusionName = match?.[1] || "";
        const inclusionArgs = match?.[2];

        const fileTemplate = readFile(getInclusionPath(inclusionName, config));

        content = `(${compile(fileTemplate, config)})(${inclusionArgs})`;
        returnStr += "tR+=" + content + "\n";
      } else if (type === "lay") {
        layoutCall = content;
      } else if (type === "e") {
        // execute
        returnStr += content + "\n"; // you need a \n in case you have <% } %>
      }
    }
  }

  if (layoutCall) {
    const match = layoutCall.match(/\s*(\w+)\s*,\s*({.+})?/);
    const layoutName = match?.[1] || "";
    const layoutArgs = match?.[2];

    const fileTemplate = readFile(getLayoutPath(layoutName, config));

    returnStr += `tR = (${compile(fileTemplate, config)})(Object.assign(${
      config.varName
    }, {body: tR}, ${layoutArgs}))\n`;
  }

  return returnStr;
}
