import { merge } from "lodash";
import fs from "fs";

import compile from "./compile";
import { getViewPath, readFile } from "./file-utils";
import Config from "./config";

/* TYPES */
import type { ConfigT } from "./config";
/* END TYPES */

export default class Kex {
  private config: ConfigT;
  constructor(options?: Partial<ConfigT>) {
    this.config = merge(Config, options);
  }

  getConfig = () => {
    return this.config;
  };

  setConfig = (newParams: Partial<ConfigT>) => {
    this.config = merge(this.config, newParams);
  };

  compileString = (template: string) => {
    const { compiled, cache } = compile(template, this.config);
    return (data?: Record<string, unknown>) => compiled(data, cache);
  };

  compileView = (viewName: string) => {
    const viewTemplate = readFile(getViewPath(viewName, this.config));
    const { compiled, cache } = compile(viewTemplate, this.config);
    return (data?: Record<string, unknown>) => compiled(data, cache);
  };

  renderString = (tempalte: string, data?: Record<string, unknown>) => {
    const compiled = this.compileString(tempalte);
    return compiled(data);
  };

  renderView = (viewName: string, data?: Record<string, unknown>) => {
    const compiled = this.compileView(viewName);
    return compiled(data);
  };
}
