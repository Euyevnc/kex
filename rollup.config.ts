import typescript from "@rollup/plugin-typescript";

const pluginConfig = {
  input: `tests/serv.ts`,
  output: {
    dir: "build",
    format: "cjs",
  },

  plugins: [typescript({ lib: ["es6"], target: "es6" })],
};

export default [pluginConfig];
