'use strict';

const requireDirectory = require('require-directory');

// An idex files for handlers, replacing the '-handler' portion of the file
module.exports = requireDirectory(module, {rename: name => name.replace('-handler','')});