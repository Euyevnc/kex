const logs = (template, data, config) => {
  const render = require('../build/index.js').render;
  console.log("render log:", render(template, data, config))
}

exports.logs = logs