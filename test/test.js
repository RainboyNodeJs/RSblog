/* 
 *  生成各种东西
 *  blog -- > book ---> ojtm
 *
 * */

/* 
 *  1. 读取config.yaml
 * */

var DB = require('../lib/Db/index.js');
var blog = require('../lib/blog/index.js');
var book = require('../lib/book/index.js');
var ojtm = require('../lib/OJTM/index.js');
var argv= require('yargs').argv;


if(argv._.indexOf('ojtm') !== -1){
    console.log('=================== 开始 process ojtm ===================');

    DB.DataToDb('OJTM').then(function(){
        return ojtm.index();
    }).then(function(){
        return ojtm.post();
    });

}

if(argv._.indexOf('noipbook') !== -1){
    console.log('=================== 开始 process noipbook ===================');

    var bookName = 'NoipBook';
//    book.index(bookName).then(function(){
//        return book.post(bookName);
//    });
    
    //先存入书和
    DB.DataToDb('book',bookName).then(function(){
                return book.index(bookName);
    })
    .then(function(){
        return book.post(bookName);
    });
}

if(argv._.indexOf('blog') !== -1){
    console.log('=================== 开始 process blog ===================');

    DB.DataToDb('blog').then(function(){
        return blog.postCard();
    }).then(function(){
        return blog.post();
    });

}

/* 渲染book测试 */

