import { XMLEscape } from "./utils";
import compile from "./compile";
import { getInclusionPath, getLayoutPath, readFile } from "./file-utils";

/* TYPES */
import type { Cache } from "./compile";
type TrimConfig = "nl" | "slurp" | false;
export type TagHandler = (
  content: string,
  config: ConfigT,
  cache: Cache
) => string;
type TagConfig = { prefix: string; handler: TagHandler };

export type ConfigT = {
  autoEscape: boolean;
  autoTrim: TrimConfig | [TrimConfig, TrimConfig];
  stringParser: TagHandler;
  customParse: Record<string, TagConfig>;
  rmWhitespace: boolean;
  tags: string[];
  useWith: boolean;
  varName: string;

  layoutsPath: string;
  inclusionsPath: string;
  viewsPath: string;

  escape: (str: any) => string;
};
/* END TYPES */

const defaultConfig: ConfigT = {
  autoEscape: true,
  autoTrim: [false, "nl"],
  stringParser: defaultStringHandler,
  customParse: {
    execute: { prefix: "", handler: defaultExecutionHandler },
    interpolate: { prefix: "=", handler: defaultInterpolationHandler },
    insert: { prefix: "~", handler: defaultInsertionHandler },
    include: { prefix: "+", handler: defaultInclusionHandler },
    layon: { prefix: "#", handler: defaultLayoutHandler },
  },
  rmWhitespace: false,
  tags: ["<%", "%>"],
  useWith: false,
  varName: "it",

  layoutsPath: "src/layouts",
  inclusionsPath: "src/inclusions",
  viewsPath: "src/views",
  escape: XMLEscape,
};

function defaultStringHandler(content: string) {
  const minifiedContent = content
    .replace(/(\\n|\s)+</g, "<")
    .replace(/>(\\n|\s)+/g, ">")
    .replace(/\s*(\\n)+\s*/g, "");
  if (!minifiedContent) return "";
  return "tR+='" + minifiedContent + "'\n";
}

function defaultInsertionHandler(content: string) {
  return "tR+=" + content + "\n";
}

function defaultInterpolationHandler(
  content: string,
  config: ConfigT,
  cache: Cache
) {
  if (config.autoEscape) {
    const fnIsCached = cache.checkCache("escape");
    if (!fnIsCached) {
      cache.addToCache("escape", () => config.escape);
    }
    content = `cache.escape(${content})`;
  }
  return "tR+=" + content + "\n";
}

function defaultInclusionHandler(
  content: string,
  config: ConfigT,
  cache: Cache
) {
  const match = content.match(/\s*([\w-]+)\s*(,\s*({.*}))?/);
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
  content = `cache["${inclusionName}"](${inclusionArgs}, cache)`;
  return "tR+=" + content + "\n";
}

function defaultLayoutHandler(content: string, config: ConfigT, cache: Cache) {
  const match = content.match(/\s*([\w-]+)\s*(,\s*({.*}))?/);
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

  return `tR = cache["${layoutName}"](Object.assign({body: tR}, ${layoutArgs}), cache)\n`;
}

function defaultExecutionHandler(
  content: string,
  config: ConfigT,
  cache: Cache
) {
  function nestStringHandler(nestContent: string) {
    return "tR+='" + nestContent + "'\n";
  }

  function nestInclusionHandler(nestContent: string) {
    const match = nestContent.match(/\s*([\w-]+)\s*(,\s*({.*}))?/);
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
    nestContent = `'cache["${inclusionName}"](${inclusionArgs}, cache)'`;
    return "tR+=" + nestContent + "\n";
  }

  const newConfig: ConfigT = {
    ...config,
    tags: ["<|", "|>"],
    stringParser: nestStringHandler,
    customParse: {
      include: { prefix: "+", handler: nestInclusionHandler },
    },
  };

  const { compiled } = compile(content, newConfig, cache);
  return compiled(undefined, cache.getStore()) + "\n";
}

export default defaultConfig;
