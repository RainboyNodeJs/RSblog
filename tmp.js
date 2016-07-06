var fs =require('./rexofs.js');
var front_parse = require('./myf.js');
var pathFn = require('path');

var join = pathFn.join;
var listDir = fs.listDir;

listDir('E:/MY_code/Git files/Rainboy/source/_posts').then(function(data){

    for(var i= 0;i<data.length;i++){
        var str = fs.readFileSync(join('E:/MY_code/Git files/Rainboy/source/_posts',data[i]));
        var ans = front_parse(str);
    }
	
        /*
        if(!isExist(ans.title)){
            // 存入 
            Post.create(ans,function(err,res){
                    console.log(res);
                    console.log(ans);
            });
        }
        */

});
