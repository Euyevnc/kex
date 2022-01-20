import compile from "compile";
import { getViewPath, readFile } from "file-utils";
import Config from "config";
import { Cache } from "./compile";

/* TYPES */
import type { CacheStore } from "compile";
/* END TYPES */

export default class Kex {
  private config: Config;
  cache: Cache;
  constructor(option?: Config) {
    this.config = new Config();
    this.cache = new Cache();
  }

  getConfig = () => {
    return this.config;
  };

  setConfig = (newParams: Config) => {
    this.config = { ...this.config, ...newParams };
  };

  compileString = (template: string) => {
    const compiledFn = compile(template, this.config, this.cache);
    return (data: any) => compiledFn({}, data);
  };

  compileView = (viewName: string) => {
    const viewTemplate = readFile(getViewPath(viewName, this.config));
    const compiledFn = compile(viewTemplate, this.config, this.cache);
    return (data: any) => compiledFn(this.cache.getStore(), data);
  };

  // renderString = (tempalte: string, data: Record<string, any>) => {
  //   return compile(tempalte, this.config, this.cache)(data);
  // };

  // renderView = (viewName: string, data: Record<string, any>) => {
  //   const viewTemplate = readFile(getViewPath(viewName, this.config));
  //   return compile(viewTemplate, this.config, this.cache)(data);
  // };
}
