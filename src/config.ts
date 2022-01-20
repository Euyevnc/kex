import { XMLEscape } from "./utils";

/* TYPES */
type trimConfig = "nl" | "slurp" | false;
/* END TYPES */

class Config {
  autoEscape: boolean;
  autoTrim: trimConfig | [trimConfig, trimConfig];
  parse: Record<string, string>;
  rmWhitespace: boolean;
  tags: string[];
  useWith: boolean;
  varName: string;

  layoutsPath: string;
  inclusionsPath: string;
  viewsPath: string;

  escape = XMLEscape;

  constructor(props?: Config) {
    this.autoEscape = true;
    this.autoTrim = [false, "nl"];
    this.parse = {
      exec: "",
      interpolate: "=",
      raw: "~",
      include: "+",
      layout: "#",
    };
    this.rmWhitespace = false;
    this.tags = ["<%", "%>"];
    this.useWith = false;
    this.varName = "it";

    this.layoutsPath = "src/layouts";
    this.inclusionsPath = "src/includes";
    this.viewsPath = "src/views";
  }
}

export default Config;
