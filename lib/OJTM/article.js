var Promise = require('bluebird');
var DB = require('../Db/index.js');
var TaskQueue = require('../utils/TaskQueue.js');
var render = require('../render/index.js');
var PathFn = require('path');
var DataFormat = require('../utils/time.js').DataFormat;
var marko = require('../utils/marko.js');
var fs = require('../utils/rexofs.js');
var router = require('../utils/Router.js');
var config = require('../utils/config.js');

var join = PathFn.join;

var TaskQueueArticle = new TaskQueue(10);
var sitePath  = config.ChildSite;

/* 渲染PostCard */
function DoTask(task){
 debugger;
        DB.find('OJTM',{
            condition:{isHave:true},
            select:'title date update Author tags content',
            skip:task.task.skip,
            limit:task.task.limit,
            }).then(function(data){
                for(var i =0;i <data.length;i++){
                    data[i]._date = DataFormat(data[i].date,'yyyy-MM-dd h:mm:ss');
                    data[i]._update = DataFormat(data[i].update,'yyyy-MM-dd h:mm:ss');
                }
                debugger;
				//console.log(data);
                var outPath = join(sitePath,'OJTM',router(data[0].title));
				fs.mkdirsSync = (PathFn.dirname(outPath));
                return render('article',{
                    post:data[0],
                },outPath);
            }).then(function(){
                TaskQueueArticle.taskDone(task);
            });
}

function DoArticle(){
	return DB.count('OJTM',{isHave:true}).then(function(count){
            return new Promise(function(resole,reject){
                debugger;
				function done(){
                    resole();
                }
               
                TaskQueueArticle.afterFinish(count,done);

                var skip = 0;
                for(var i =0;i<count;i++){
                    TaskQueueArticle.push({
                        skip:i,
                        limit:1,
                        page:i+1,
                    },DoTask);
                }
            });

}).then(function(){
    console.log('all done');
	});
}

exports = module.exports =DoArticle;