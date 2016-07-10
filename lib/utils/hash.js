var  crypto =require('crypto');


function md5Str(Str){
    var md5 = crypto.createHash('md5');
    md5.update(Str);
    return md5.digest('hex');
}



exports = module.exports = md5Str;
exports.md5Str =  md5Str;