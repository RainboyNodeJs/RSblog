var Promise = require('bluebird');
var DB = require('../Db/index.js');
var TaskQueue = require('../utils/TaskQueue.js');
var render = require('../render/index.js');
var PathFn = require('path');
var DataFormat = require('../utils/time.js').DataFormat;

var join = PathFn.join;




var TaskQueueArticle = new TaskQueue(10);


/* äÖÈ¾PostCard */
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
                }
                
				//console.log(data);
                var outPath = task.task.page+'.html';
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
                        skip:skip,
                        limit:1,
                        page:i+1,
                    },DoTask);
                    skip += i;
                }
            });

}).then(function(){
    console.log('all done');
	});
}
exports = exports.moudle = DoArticle;