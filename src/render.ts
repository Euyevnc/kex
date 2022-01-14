import { Config } from "config";
import compile from "./compile";

/* TYPES */

// import type { EtaConfig, PartialConfig } from './config'

/* END TYPES */

export default function render(
  template: string,
  data: object,
  config?: Config
): string | Promise<string> | void {
  return compile(template, config)(data);
}
