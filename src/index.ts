import compile from "compile";
import { getViewPath, readFile } from "file-utils";
import Config from "config";

export default class Kex {
  private config: Config;
  constructor(option?: Config) {
    this.config = new Config();
  }

  getConfig = () => {
    return this.config;
  };

  setConfig = (newParams: Config) => {
    this.config = { ...this.config, ...newParams };
  };

  compileString = (template: string) => {
    const { compiled, cache } = compile(template, this.config);
    return (data: Record<string, any>) => compiled(data, cache);
  };

  compileView = (viewName: string) => {
    const viewTemplate = readFile(getViewPath(viewName, this.config));
    const { compiled, cache } = compile(viewTemplate, this.config);
    console.log(compiled.toString());
    return (data: Record<string, any>) => compiled(data, cache);
  };

  renderString = (tempalte: string, data: Record<string, any>) => {
    const { compiled, cache } = compile(tempalte, this.config);
    return compiled(data, cache);
  };

  renderView = (viewName: string, data: Record<string, any>) => {
    const { compiled, cache } = compile(viewName, this.config);
    return compiled(data, cache);
  };
}
