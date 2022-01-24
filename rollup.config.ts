import typescript from "@rollup/plugin-typescript";

const servConfig = {
  input: `tests/serv.ts`,
  output: {
    dir: "build",
    format: "cjs",
  },

  plugins: [typescript({ lib: ["es6"], target: "es6" })],
};

const pluginConfig = {
  input: `src/index.ts`,
  output: {
    dir: "build",
    format: "cjs",
  },

  plugins: [typescript({ lib: ["es6"], target: "es6" })],
};

export default [pluginConfig, servConfig];
