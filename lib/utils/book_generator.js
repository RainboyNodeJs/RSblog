#!/usr/bin/env node
//根据SUMMARY.md 来创建没有的书
/* 
 *   - 解析SUMMARY.md
 *   - 生成LS目录下的所有文件
 *   - 每个文件forEach对应查找
 *   - 没有找到就创建文件
 * */

var fs =require('./rexofs.js');
var SC = require('./SummaryConvert.js');
var pathFn = require('path');

var join = pathFn.join;

/*
SC('/home/rainboy/mycode/gitfiles/noipbook/SUMMARY.md')
.then(function(ans){
    console.log(ans);
});
*/

function file_find(str,files){
    var len = files.length;
    for(var i=0;i<len;i++)
        if( str === files[i])
            return true;
    return false;
}



var options ={
    ignorePattern:/(images[\S\s]*)|(pdf[\S\s]*)|(SUMMARY.md)|(README.md)/
}

var book_path = '/home/rainboy/mycode/gitfiles/noipbook';

fs.listDirSync(book_path,options).
then(function(filesArray){


    SC(book_path+'/'+'SUMMARY.md').then(function(contentArray){
        var len = contentArray.length;

        var total=0,total_f=0,total_l=0;
        for(var i=0;i<len;i++)
            if( file_find(contentArray[i].path,filesArray))
                total_f++;
                //console.log("找到:"+contentArray[i].path),total_f++;
            else{
                console.log("没有找到:"+contentArray[i].path),total_l++;

                var t_path = join(book_path,contentArray[i].path);
                var p_t_path = pathFn.dirname(t_path);

                fs.mkdirsSync(p_t_path);

                fs.writeFileSync(t_path,"# "+contentArray[i].name,{encoding:'UTF-8'});

                console.log("创建:"+contentArray[i].path+" 成功!");
                //写下创建的代码ok

            }

        console.log('最终\n找到:%d\n没有找到:%d\n',total_f,total_l);

    });

});
