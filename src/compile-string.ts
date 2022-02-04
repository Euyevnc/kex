import parse from "./parse";

/* TYPES */
import type { TemplateObject } from "./parse";
import type { ConfigT } from "./config";
import type { Cache } from "./compile";
/* END TYPES */

export default function compileToString(
  str: string,
  config: ConfigT,
  cache: Cache
): string {
  const buffer: Array<TemplateObject> = parse(str, config);
  const res =
    "let tR=''\n" +
    (config.useWith ? "with(" + config.varName + "||{}){" : "") +
    compileScope(buffer, config, cache) +
    "return tR" +
    (config.useWith ? "}" : "");

  if (cache) return res;
  return res;
}

function compileScope(
  buff: Array<TemplateObject>,
  config: ConfigT,
  cache: Cache
) {
  let i = 0;
  const buffLength = buff.length;
  const { stringParser, customParse } = config;
  let returnStr = "";
  for (i; i < buffLength; i++) {
    const currentBlock = buff[i];

    const type = currentBlock.type;
    const content = currentBlock.value || "";
    const parser = type === "string" ? stringParser : customParse[type].handler;
    returnStr += parser(content, config, cache);
  }

  return returnStr;
}
