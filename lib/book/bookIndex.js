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
var config = require('../utils/config.js');

var join = PathFn.join;

var sitePath  = config.ChildSite;

function _bookIndex(bookName){
    return DB.find('book',{
            condition:{bookName:bookName},
            select:'data source outPath'
        })
        .then(function(data){
            return data[0];
        }).then(function(bookData){
                var outPath = join(sitePath,bookData.outPath,'index.html');
                fs.mkdirsSync(PathFn.dirname(outPath));
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
    return DB.DataToDb('book',bookName).then(function(){
        return _bookIndex(bookName);
    });
}


exports = module.exports = bookIndex;
