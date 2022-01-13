import { path, existsSync, readFileSync } from './file-methods';

function getComponentPath(name: string, config: Record<string, unknown>): string {
    const path = `${config.componentsPath}/${name}/index.kex` 
    return path
}

function getLayoutPath(name: string, config: Record<string, unknown>): string {
    const path = `${config.layoutPath}/${name}/index.kex` 
    return path
}

function readFile(filePath: string): string {
    try {
      return readFileSync(filePath).toString()
    } catch {
      throw new Error("Failed to read template at '" + filePath + "'")
    }
  }
  
export { getComponentPath, getLayoutPath, readFile }