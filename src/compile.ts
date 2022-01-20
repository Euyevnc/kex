import compileToString from "./compile-string";
import Config from "config";
import EtaErr from "./err";

/* TYPES */
export type TemplateFunction = (cach: CacheStore, data?: any) => string;
export type CacheStore = Record<string, TemplateFunction | boolean>;
/* END TYPES */

export default function compile(
  str: string,
  config: Config,
  cache: Cache
): TemplateFunction {
  try {
    return new Function(
      "cache",
      config.varName,
      compileToString(str, config, cache)
    ) as TemplateFunction;
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw EtaErr(
        "Bad template syntax\n\n" +
          e.message +
          "\n" +
          Array(e.message.length + 1).join("=") +
          "\n" +
          compileToString(str, config, cache) +
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
    this.store[name] = true;
    this.store[name] = fnMaker();
  };

  checkCache = (name: string) => this.store.hasOwnProperty(name);

  getStore = () => this.store;
}
