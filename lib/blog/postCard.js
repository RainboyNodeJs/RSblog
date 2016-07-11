/*-------------------------------------------------
*  生成一个postCard
*-------------------------------------------------*/


/* 
 *  path
 * page/2.html
 * */

/* 
 *  得到数据后
 *
 *
 * */

/* 
 * 得到1
 * 得到2,
 * 得到3.
 *
 * */

var Promise = require('bluebird');
var DB = require('../Db/index.js');
var pagination = require('./pagination.js');
var TaskQueue = require('../utils/TaskQueue.js');
var render = require('../render/index.js');
var PathFn = require('path');
var DataFormat = require('../utils/time.js').DataFormat;
var config = require('../utils/config.js');
var fs = require('../utils/rexofs.js');
var router = require('../utils/Router.js');



var join = PathFn.join;



var blogOutPath = join(config.ChildSite,config.blog.outPath);


var TaskQueuePostCard = new TaskQueue(10);


/* 渲染PostCard */
function DoTask(task){
        DB.find('blog',{
            condition:{isHave:true},
            select:'title date update Author tags',
            skip:task.task.skip,
            limit:task.task.limit,
            }).then(function(data){
                
                for(var i =0;i <data.length;i++){
                    data[i]._date = DataFormat(data[i].date,'yyyy-MM-dd h:mm:ss');
                    data[i]._update = DataFormat(data[i].update,'yyyy-MM-dd h:mm:ss');
					data[i].link = '/'+join(config.blog.outPath,config.blog.post,router(data[i].title));
                }
                //var outPath = join('blog',task.page+'html');
                var outPath = join(blogOutPath,config.blog.postCard,task.task.page+'.html');
				fs.mkdirsSync(PathFn.dirname(outPath));
                return render('postCard',{
                    cards:data,
                },outPath);
            }).then(function(){
                TaskQueuePostCard.taskDone(task);
            });
}

function DoPostCard(){
return DB.count('blog',{isHave:true}).then(function(count){
                return pagination(count,20);
        }).then(function(pagination){
                
            return new Promise(function(resole,reject){
                function done(){
                    resole();
                }
               
                TaskQueuePostCard.afterFinish(pagination.length,done);

                var skip = 0;
                for(var i =0;i<pagination.length;i++){
                    TaskQueuePostCard.push({
                        skip:skip,
                        limit:pagination[i],
                        page:i+1,
                    },DoTask);
                    skip += pagination[i];
                }
            });

}).then(function(){
    console.log('all done');
});
}

exports = module.exports = DoPostCard;