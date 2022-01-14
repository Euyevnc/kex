import { existsSync, readFileSync } from "fs";

import { defineConfig } from "rollup";

function getInclusionPath(name: string, config?: Record<string, any>): string {
  const options = config || defineConfig;
  const path = `${options.inclusionsPath}/${name}/index.kex`;

  return path;
}

function getLayoutPath(name: string, config?: Record<string, any>): string {
  const options = config || defineConfig;
  const path = `${options.layoutPath}/${name}/index.kex`;

  return path;
}

function readFile(filePath: string): string {
  try {
    return readFileSync(filePath).toString();
  } catch {
    throw new Error("Failed to read template at '" + filePath + "'");
  }
}

export { getLayoutPath, getInclusionPath, readFile };
