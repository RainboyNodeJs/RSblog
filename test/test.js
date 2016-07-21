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

/* 渲染blog 测试 */


/* 存入OK */
/*
DB.DataToDb('blog').then(function(){
   return blog.postCard();
}).then(function(){
    return blog.post();
});
*/



/* 渲染book测试 */

/*
var bookName = 'NoipBook';
book.index(bookName).then(function(){
    return book.post(bookName);
});
*/

/* 渲染 ojtm */
DB.DataToDb('OJTM').then(function(){
    return ojtm.index();
}).then(function(){
    return ojtm.post();
});
