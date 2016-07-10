/* 
 *  把每一本book到输出路径:
 *      bookName+(bookPath.slice 8).html
 *
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

var bookTaskQueue = new TaskQueue(10);

function DoTask(task){
    //读取
    //渲染
    //成功
    var content = fs.readFileSync( join(task.task.source,task.task.path));
    console.log('开始渲染'+task.task.name);
    content = marko(content);
    //var outPath = join(process.cwd(),task.task.outPath,bookRouter(task.task.path)+'.html');
    var outPath = join(task.task.outPath,bookRouter(task.task.path));
    fs.mkdirsSync(PathFn.dirname(outPath));
    return render('bookPost',{
        post:{
            title:task.task.name,
            content:content,
        }
    },outPath).then(function(){
        bookTaskQueue.taskDone(task);
    });
}


function _bookPost(bookName){
    return DB.find('book',{
            condition:{bookName:bookName},
            select:'data source outPath'
        })
        .then(function(data){
             return data[0];
        }).then(function(bookData){
                var source = bookData.source;
                var outPath = bookData.outPath;
                return new Promise(function(resolve,reject){
                    function done(){
                        resolve();
                    }
                    bookTaskQueue.afterFinish(bookData.data.length,done);
                    
                    for(var i=0;i<bookData.data.length;i++)
                        bookTaskQueue.push({
                                path:bookData.data[i].path,
                                name:bookData.data[i].name,
                                source:source,
                                outPath:outPath
                        },DoTask);
                });
        });
}


function bookPost(bookName){
    return DB.DataToDb('book',bookName).then(function(bans){
        if(bans === false) //不用更新 
            return;
        return _bookPost(bookName);
    });
}


//_bookPost('NoipBook');

exports = module.exports =bookPost;
