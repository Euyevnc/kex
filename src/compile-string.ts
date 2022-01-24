import parse from "parse";
import compile from "compile";
import { getInclusionPath, getLayoutPath, readFile } from "file-utils";

/* TYPES */
import type { AstObject } from "./parse";
import type Config from "config";
import type { Cache } from "compile";
/* END TYPES */

export default function compileToString(
  str: string,
  config: Config,
  cache: Cache
): string {
  const buffer: Array<AstObject> = parse(str, config);
  let res =
    "let tR=''\n" +
    (config.useWith ? "with(" + config.varName + "||{}){" : "") +
    compileScope(buffer, config, cache) +
    "return tR" +
    (config.useWith ? "}" : "");

  if (cache) return res;
  return res;
}

function compileScope(buff: Array<AstObject>, config: Config, cache: Cache) {
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
        if (config.autoEscape) {
          const fnIsCached = cache.checkCache("escape");
          if (!fnIsCached) {
            cache.addToCache("escape", () => config.escape);
          }
          content = `cache.escape(${content})`;
        }
        returnStr += "tR+=" + content + "\n";
        // reference
      } else if (type === "inc") {
        const match = content.match(/\s*([\w-]+)\s*(,\s*({.+}))?/);
        const inclusionName = match?.[1] || "";
        const inclusionArgs = match?.[3];

        const fnIsCached = cache.checkCache(inclusionName);

        if (!fnIsCached)
          cache.addToCache(
            inclusionName,
            () =>
              compile(
                readFile(getInclusionPath(inclusionName, config)),
                config,
                cache
              ).compiled
          );
        console.log(inclusionName, inclusionArgs);
        content = `cache["${inclusionName}"](${inclusionArgs}, cache)`;
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
    const match = layoutContent.match(/\s*([\w-]+)\s*(,\s*({.+}))?/);
    const layoutName = match?.[1] || "";
    const layoutArgs = match?.[3];

    const fnIsCached = cache.checkCache(layoutName);

    if (!fnIsCached)
      cache.addToCache(
        layoutName,
        () =>
          compile(readFile(getLayoutPath(layoutName, config)), config, cache)
            .compiled
      );

    returnStr += `tR = cache["${layoutName}"](Object.assign(${config.varName}, {body: tR}, ${layoutArgs}), cache)\n`;
  }

  return returnStr;
}
