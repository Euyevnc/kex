import compile from "compile";
import render from "render";
import { getViewPath, readFile } from "file-utils";
import defaultConfig from "config";

/* TYPES */
import type { Config, PartialConfig } from "config";
export type { PartialConfig, Config };
/* END TYPES */

export default class Kex {
  private config: Config;
  constructor(option?: PartialConfig) {
    this.config = option ? { ...defaultConfig, ...option } : defaultConfig;
  }

  getConfig = () => {
    return this.config;
  };

  setConfig = (newParams: PartialConfig) => {
    this.config = { ...this.config, ...newParams };
  };

  compileString = (template: string) => {
    return compile(template, this.config);
  };

  compileView = (viewName: string) => {
    const viewTemplate = readFile(getViewPath(viewName, this.config));
    return compile(viewTemplate, this.config);
  };

  renderString = (tempalte: string, data: Record<string, any>) => {
    return render(tempalte, data, this.config);
  };

  renderView = (viewName: string, data: Record<string, any>) => {
    const viewTemplate = readFile(getViewPath(viewName, this.config));
    return render(viewTemplate, data, this.config);
  };
}
