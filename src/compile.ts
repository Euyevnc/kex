import compileToString from "./compile-string";
import Config from "config";
import EtaErr from "./err";

/* TYPES */
export type TemplateFunction = (data?: any, cache?: CacheStore) => string;
export type CacheStore = Record<string, TemplateFunction>;
/* END TYPES */

export default function compile(
  str: string,
  config: Config,
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
      throw EtaErr(
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

  addToCache = (name: string, fnMaker: () => (it: any) => string) => {
    this.store[name] = () => "";
    this.store[name] = fnMaker();
  };

  checkCache = (name: string) => this.store.hasOwnProperty(name);

  getStore = () => this.store;
}
