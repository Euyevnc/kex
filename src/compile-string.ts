import parse from "./parse";
import compile from "compile";
import { getInclusionPath, getLayoutPath, readFile } from "file-utils";

/* TYPES */
import type { AstObject } from "./parse";
import type { Config } from "config";
/* END TYPES */

export default function compileToString(
  str: string,
  config: Config,
  cache?: { declarations: string; [index: string]: boolean | string }
): string {
  const compileCache = cache || { declarations: "" };
  const buffer: Array<AstObject> = parse(str, config);
  let res =
    "let tR=''\n" +
    (config.useWith ? "with(" + config.varName + "||{}){" : "") +
    compileScope(buffer, config, compileCache) +
    "return tR" +
    (config.useWith ? "}" : "");

  if (cache) return res;
  return compileCache.declarations + res;
}

function compileScope(
  buff: Array<AstObject>,
  config: Config,
  cache: { declarations: string; [index: string]: boolean | string }
) {
  let i = 0;
  const buffLength = buff.length;
  let returnStr = "";
  let layoutContent = "";
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
        const escapeIsExist = cache.escape;
        if (!escapeIsExist) {
          cache.escape = true;
          cache.declarations =
            cache.declarations +
            `function escape(string){ return ${config.e.toString()}(string) }\n`;
        }

        if (config.autoEscape) {
          content = `escape(${content})`;
        }
        returnStr += "tR+=" + content + "\n";
        // reference
      } else if (type === "inc") {
        const match = content.match(/\s*(\w+)\s*,\s*({.+})/);
        const inclusionName = match?.[1] || "";
        const inclusionArgs = match?.[2];

        const inclusionAreCached = cache.hasOwnProperty(inclusionName);

        if (!inclusionAreCached) {
          const fileTemplate = readFile(
            getInclusionPath(inclusionName, config)
          );
          cache[inclusionName] = true;
          const includeFunctionDec =
            `function ${inclusionName}(${config.varName})` +
            `{${compileToString(fileTemplate, config, cache)}}\n`;
          cache.declarations = cache.declarations + includeFunctionDec;
        }

        content = `${inclusionName}(${inclusionArgs})`;
        returnStr += "tR+=" + content + "\n";
      } else if (type === "lay") {
        layoutContent = content;
      } else if (type === "e") {
        // execute
        returnStr += content + "\n"; // you need a \n in case you have <% } %>
      }
    }
  }

  if (layoutContent) {
    const match = layoutContent.match(/\s*(\w+)\s*,\s*({.+})?/);
    const layoutName = match?.[1] || "";
    const layoutArgs = match?.[2];

    const fileTemplate = readFile(getLayoutPath(layoutName, config));

    returnStr += `tR = (${compile(fileTemplate, config)})(Object.assign(${
      config.varName
    }, {body: tR}, ${layoutArgs}))\n`;
  }

  return returnStr;
}
