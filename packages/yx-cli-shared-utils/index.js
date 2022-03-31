exports.chalk = require('chalk');
exports.execa = require('execa');
[
  'module',
  'pluginResolution'
].forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})
// exports.a = 'yx'