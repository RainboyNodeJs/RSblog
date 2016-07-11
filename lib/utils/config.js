var yaml = require('js-yaml');
var fs = require('fs');
var pathFn = require('path');

var join = pathFn.join;

//var ConfigPath = 'E:/MY_code/Git files/RSblog/startup/config.yaml';
var ConfigPath = join(process.cwd(),'config.yaml');

function parseConfig(path, options){
  var result = yaml.load(fs.readFileSync(path), options);
  if (typeof result !== 'object') return;

  return result;
}

exports = module.exports = parseConfig(ConfigPath);