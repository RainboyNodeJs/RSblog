var Promise = require('bluebird');
var DB = require('../Db/index.js');
var TaskQueue = require('../utils/TaskQueue.js');
var render = require('../render/index.js');
var PathFn = require('path');
var DataFormat = require('../utils/time.js').DataFormat;
var router = require('../utils/Router.js');
var config = require('../utils/config.js');
var fs = require('../utils/rexofs.js');


var join = PathFn.join;


var blogOutPath = join(config.ChildSite,config.blog.outPath);

var TaskQueueArticle = new TaskQueue(10);


/* ‰÷»æPostCard */
function DoTask(task){
        DB.find('blog',{
            condition:{isHave:true},
            select:'title date update Author tags content',
            skip:task.task.skip,
            limit:task.task.limit,
            }).then(function(data){
                for(var i =0;i <data.length;i++){
                    data[i]._date = DataFormat(data[i].date,'yyyy-MM-dd h:mm:ss');
                    data[i]._update = DataFormat(data[i].update,'yyyy-MM-dd h:mm:ss');
					console.log(data[i].title);
                }
                
				//console.log(data);
				//console.log(data[0].title);
				var outPath = join(blogOutPath,config.blog.post,router(data[0].title));
				//var outPath = task.task.page +'.html';
				fs.mkdirsSync( PathFn.dirname(outPath) );
                return render('article',{
                    post:data[0],
                },outPath);
            }).then(function(){
                TaskQueueArticle.taskDone(task);
            });
}

function DoArticle(){
	return DB.count('blog',{isHave:true}).then(function(count){
            return new Promise(function(resole,reject){
                
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


exports = module.exports = DoArticle;