import { XMLEscape } from "./utils";

/* TYPES */
type trimConfig = "nl" | "slurp" | false;

export type Config = {
  autoEscape: boolean;
  autoTrim: trimConfig | [trimConfig, trimConfig];
  e: (str: string) => string;
  parse: Record<string, string>;
  rmWhitespace: boolean;
  tags: string[];
  useWith: boolean;
  varName: string;

  layoutsPath: string;
  inclusionsPath: string;
  viewsPath: string;
};

export type PartialConfig = Partial<Config>;
/* END TYPES */

const defaultConfig: Config = {
  autoEscape: true,
  autoTrim: [false, "nl"],
  e: XMLEscape,

  parse: {
    exec: "",
    interpolate: "=",
    raw: "~",
    include: "+",
    layout: "#",
  },
  rmWhitespace: false,
  tags: ["<%", "%>"],
  useWith: false,
  varName: "it",

  layoutsPath: "src/layouts",
  inclusionsPath: "src/includes",
  viewsPath: "src/views",
};
export default defaultConfig;
