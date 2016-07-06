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
        console.log(WARNING+':'+'tags is required Array!'+' Title:'+BlogInfo.title);
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
function isExist(title){
    Post.findOne({title:title},function(err,data){
        if(err)
            console.log(err);
        else{
            if(data === null){
                console.log("kong de");
                return false;
            } else
                return true;
        }
    });
}

listDir('E:/MY_code/Git files/Rainboy/source/_posts').then(function(data){

//    for(var i=0;i<data.length;i++){
        var str = fs.readFileSync(join('E:/MY_code/Git files/Rainboy/source/_posts',data[2]));
        var hash = md5Str(str);
        var ans = front_parse(str);
        ans.hash = hash;
      //console.log(ans._content);
        debugger;
        var result = convertBlogInfo(ans);
        console.log(result);
  //  }
        /*
        if(!isExist(ans.title)){
            // 存入 
            Post.create(ans,function(err,res){
                    console.log(res);
                    console.log(ans);
            });
        }
        */

});

//Post.create({title:'test!!'});


/* 某个 collection*/
