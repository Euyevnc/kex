const logs = (template, config) => {
  const compile = require('../build/index.js').compile;
  console.log("compile log: ", compile(template, config).toString())
}

exports.logs = logs