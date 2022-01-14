import compileToString from "./compile-string";
import defaultConfig, { Config } from "./config";
import EtaErr from "./err";

/* TYPES */

export type TemplateFunction = (data: object) => string;

/* END TYPES */

export default function compile(
  str: string,
  config?: Config
): TemplateFunction {
  const options: Config = config || defaultConfig;

  try {
    return new Function(
      options.varName,
      "E", // Config
      compileToString(str, options)
    ) as TemplateFunction; // eslint-disable-line no-new-func
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw EtaErr(
        "Bad template syntax\n\n" +
          e.message +
          "\n" +
          Array(e.message.length + 1).join("=") +
          "\n" +
          compileToString(str, options) +
          "\n" // This will put an extra newline before the callstack for extra readability
      );
    } else {
      throw e;
    }
  }
}
