var  crypto =require('crypto');


var md5 = crypto.createHash('md5');


var str = '12334567889';
var str2 = '212334567889';


function md5Str(Str){
    var md5 = crypto.createHash('md5');
    md5.update(Str);
    return md5.digest('hex');
}

console.log(md5Str(str));
console.log(md5Str(str2));
