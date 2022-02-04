import compileToString from "./compile-string";
import Err from "./err";

/* TYPES */
export type TemplateFunction = (
  data?: Record<string, unknown>,
  cache?: CacheStore
) => string;
export type CacheStore = Record<string, TemplateFunction>;
import type { ConfigT } from "./config";
/* END TYPES */

export default function compile(
  str: string,
  config: ConfigT,
  cache?: Cache
): {
  compiled: TemplateFunction;
  cache: Record<string, TemplateFunction>;
} {
  const compileCache = cache || new Cache();
  try {
    const compileFn = new Function(
      config.varName,
      "cache",
      compileToString(str, config, compileCache)
    ) as TemplateFunction;
    return { compiled: compileFn, cache: compileCache.getStore() };
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw Err(
        "Bad template syntax\n\n" +
          e.message +
          "\n" +
          Array(e.message.length + 1).join("=") +
          "\n" +
          compileToString(str, config, compileCache) +
          "\n" // This will put an extra newline before the callstack for extra readability
      );
    } else {
      throw e;
    }
  }
}

export class Cache {
  private store: CacheStore;

  constructor() {
    this.store = {};
  }

  addToCache = (name: string, fnMaker: () => TemplateFunction) => {
    this.store[name] = () => "";
    this.store[name] = fnMaker();
  };

  checkCache = (name: string) =>
    Object.prototype.hasOwnProperty.call(this.store, name);

  getStore = () => this.store;
}
