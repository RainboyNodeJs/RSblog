/* 
 * 输出路径:bookName +index.html
 * */

var Promise = require('bluebird');
var DB = require('../Db/index.js');
var TaskQueue = require('../utils/TaskQueue.js');
var render = require('../render/index.js');
var PathFn = require('path');
var DataFormat = require('../utils/time.js').DataFormat;
var marko = require('../utils/marko.js');
var fs = require('../utils/rexofs.js');
var bookRouter = require('./bookRouter.js');

var join = PathFn.join;

function _bookIndex(bookName){
    return DB.find('book',{
            condition:{bookName:bookName},
            select:'data source outPath'
        })
        .then(function(data){
            return data[0];
        }).then(function(bookData){
                fs.mkdirsSync(bookData.outPath);
                var outPath = join(bookData.outPath,'index.html');
                for(var i =0;i < bookData.data.length;i++){
                    bookData.data[i].outName = bookRouter(bookData.data[i].path);
                }
                return render('bookIndex',{
                    title:bookName,
                    items:bookData.data
                },outPath);
        });
}





function bookIndex(bookName){
    return DB.dataToDB('book',bookName).then(function(){
        return _bookIndex(bookName);
    });
}


_bookIndex('NoipBook');
exports = module.exports = bookIndex;
