
var myDate = function(){

};

myDate.prototype.format =function(format){


};



var DatefromStr = function(Str){
    //'yyyy-MM-dd h:m:s'
    //var regx1 = /\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}/;
    return  new Date(Str.replace(/-/g,'/'));
};


//console.log(DatefromStr('2015-10-16 17:01'));

exports = module.exports = DatefromStr;
