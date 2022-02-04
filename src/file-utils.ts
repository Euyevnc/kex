import { readFileSync } from "fs";

/* TYPES */
import type { ConfigT } from "./config";
/* END TYPES */

function getInclusionPath(name: string, config: ConfigT): string {
  const options = config;
  const path = `${options.inclusionsPath}/${name}/index.kex`;

  return path;
}

function getLayoutPath(name: string, config: ConfigT): string {
  const options = config;
  const path = `${options.layoutsPath}/${name}/index.kex`;

  return path;
}

function getViewPath(name: string, config: ConfigT): string {
  const options = config;
  const path = `${options.viewsPath}/${name}/index.kex`;

  return path;
}

function readFile(filePath: string): string {
  try {
    return readFileSync(filePath).toString();
  } catch {
    throw new Error("Failed to read template at '" + filePath + "'");
  }
}

export { getLayoutPath, getInclusionPath, getViewPath, readFile };
