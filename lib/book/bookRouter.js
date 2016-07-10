var md5Str = require('../utils/hash.js').md5Str;

var join = require('path').join;

function NameHash(Spath){
    return md5Str(Spath).slice(-8)+'.html'
}

exports = module.exports = NameHash;
