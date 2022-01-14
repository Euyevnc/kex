export interface Config {
  layoutsPath: string;
  inclusionsPath: string;
  parse: Record<string, string>;
  rmWhitespace: boolean;
  tags: string[];
  useWith: boolean;
  varName: string;
}

export default {
  layoutsPath: "src/layouts",
  inclusionsPath: "src/includes",
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
};
