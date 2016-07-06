var Promise = require('bluebird');
var fs =require('./rexofs.js');
var front_parse = require('./front_matter.js');
var pathFn = require('path');
var mongoose = require('mongoose');
var marko = require('./marko.js');
var md5Str = require('./hash.js').md5Str;
var chalk = require('chalk');




/*=== golobal chalk str */

var warningStr = chalk.green('[ WARNING ]');

/*=== golobal chalk str end -----------*/


/* mongoose valaue*/
var Schema = mongoose.Schema;
var db = mongoose.createConnection('mongodb://localhost:20001/website');

var PostSchema = new Schema({
    isHave:Boolean,
    title:String, //unico
    date:Date,
    update:Date,
    categories:String,
    tags:[],
    commentOn:Boolean,
    hash:String,
    hashID:String,
    version:String,
    Author:String,
    content:String,
    _content:String,
});


/*

*/
function convertBlogInfo(BlogInfo){
    if(BlogInfo === undefined)
        return new Error('BlogInfo is required');
    
    /* empyt result */
    var result ={};

    result.title    = BlogInfo.title;
    result.isHave   = true;
    result.date     = BlogInfo.date;
    result.update   = BlogInfo.update;
    result._content = BlogInfo._content;
    result.content  = marko(BlogInfo._content);
    result.hash     = BlogInfo.hash;
    result.categories = BlogInfo.categories;
    result.hashID   = md5Str(result.title);

    /* tags */
    result.tags = [];
    if(typeof(BlogInfo.tags)=== 'string'){
        //result.tags.push(BlogInfo.tags);
        //result.tags = BlogInfo.tags;
        console.log( warningStr +':'+'tags is required Array!'+' Title:'+BlogInfo.title);
        result.tags = [];
    }
    else
        result.tags = BlogInfo.tags;

    /* commentOn */
    if(BlogInfo.commentOn === undefined || BlogInfo.commentOn === null)
        result.commentOn = true;
    else
        result.commentOn = BlogInfo.commentOn;

    /* Author */
    if(BlogInfo.Author === undefined || BlogInfo.Author === null)
        result.Author ='Rainboy';
    else
        result.Author = BlogInfo.Author;

    return result;
}




/* 虚拟属性outpath */
PostSchema.virtual('outpath').get(function(){
    return join(this.categories,this.title);
});

var Post = db.model('Posts',PostSchema);

/* mongoose end*/


var join = pathFn.join;
var listDir = fs.listDir;


/* 事件监视 */
db.on('error',function(){
    console.log('连接错误!!!');
});

db.once('open',function(){
    console.log('打开数据库成功!');
});

//分析一篇文章
//
/* content
 * _content
 * */
//分析-->md转换-->(后期处理)?-->存入db




/* 第一步更新所有的isHave 为0 
 * 查找title, 有: 
 * 如果hash一样,ishave 设为0
 * 不一样:更新 
 * 没有:加入
 *
 *
 * 把ishave 为0 的删除
 * */


/* false 不存在, true 存在 */

/* 对一个文章进行处理 */


function updateIsHave(){
    return new Promise(function(resolve,reject){
                Post.update({},{isHave:false},function(err){
                    if(err)
                        reject(err);
                    else
                        resolve();
                });
    });
}


updateIsHave().then(function(){
    return listDir('E:/MY_code/Git files/Rainboy/source/_posts');
}).map(function(data){
        var str = fs.readFileSync(join('E:/MY_code/Git files/Rainboy/source/_posts',data));
        var hash = md5Str(str);
        var ans = front_parse(str);
        ans.hash = hash;
        var result = convertBlogInfo(ans);
        //console.log(result.title);
        return new Promise(function(resolve,reject){
                Post.findOne({title:result.title},{hash:1},function(err,data){
                    if(err)
                        reject(err);
                    else{
                        resolve(data);
                        }
                });
        }).then(function(data){
                
          if(data === null){
              return Post.create(result,function(err,res){
                  if(err)
                      console.log('cun ru shibai!');
                  else
                      console.log('cun ru chenggong');
              });
          } else{
              if( data.hash !== result.hash){
                  return Post.update({title:result.title},result,function(err){
                      if(err) throw err;
                  });
              }
              else
                  return Post.update({title:result.title},{isHave:true},function(err){
                      if(err) throw err;
                  });
          }
          });
});
/*
listDir('E:/MY_code/Git files/Rainboy/source/_posts').then(function(data){

updateIsHave().then(function(){
    for(var i=0;i<data.length;i++){
        var str = fs.readFileSync(join('E:/MY_code/Git files/Rainboy/source/_posts',data[i]));
        var hash = md5Str(str);
        var ans = front_parse(str);
        ans.hash = hash;
      //console.log(ans._content);
        debugger;
        var result = convertBlogInfo(ans);
        return ;
    }).map(function(){
                Post.findOne({title:result.title},{hash:1},function(err,data){
                    if(err)
                        console.log(err);
                    else{
                        if(data === null){
                            Post.create(result,function(err,res){
                                if(err)
                                    console.log('cun ru shibai!');
                                else
                                    console.log('cun ru chenggong');
                            });
                        } else{
                            if( data.hash !== result.hash){
                                Post.update({title:result.title},result,function(err){
                                    if(err) throw err;
                                });
                            }
                            else
                                Post.update({title:result.title},{isHave:true},function(err){
                                    if(err) throw err;
                                });
                        }
                    }
                });
    });

    }
});

*/

//Post.create({title:'test!!'});


/* 某个 collection*/
