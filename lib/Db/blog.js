
var config = require('../utils/config.js');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var pathFn = require('path');
var Schema = mongoose.Schema;
var chalk = require('chalk');
var md5Str = require('../utils/hash.js').md5Str;
var front_parse = require('../utils/front_matter.js');
var fs = require('../utils/rexofs.js');
var marko = require('../utils/marko.js');

var join = pathFn.join;
var listDir = fs.listDir;

var warningStr = chalk.green('[ WARNING ]');

var blog = function(Db){
    var self = Db.db;
    this.PostSchema = new Schema({
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

    this.PostSchema.virtual('outpath').get(function(){
        return join(this.categories,this.title);
    });

    this.Post = self.model('Posts',this.PostSchema);
};


blog.prototype.find = function(self,condition){
    var con = condition.condition || {};
    var sort = condition.sort || {update:-1};
    var select = condition.select || '';
    var skip = condition.skip || 0;
    var limit = condition.limit || 0;
    return new Promise(function(resolve,reject){
            self.container.blog.Post
                .find(con)
                .sort(sort)
                .skip(skip)
                .select(select)
                .limit(limit)
                .exec(function(err,data){
                    if(err)
                        reject(err);
                    else
                        resolve(data);
                });
    });
};

blog.prototype.count = function(self,condition){
    condition = condition || {isHave:true};
    return new Promise(function(resolve,reject){
            self.container.blog.Post
                .count(condition,function(err,count){
                    if(err)
                        reject(err);
                    else
                        resolve(count);
                });
    });
};



blog.prototype.updateIsHave= function(self){
    return new Promise(function(resolve,reject){

            self.container.blog.Post
                .update({},{isHave:false},function(err){
                    if(err)
                        reject(err);
                    else
                        resolve();
                });
    });
};



blog.prototype.DataToDb = function(self){
	var blogPath = config.blog.source;
	return self.container.blog.updateIsHave(self)
				.then(function(){
					return listDir(blogPath);
				})
				.map(function(data){
				if( data.slice(-3) !== '.md') return;
				var str = fs.readFileSync(join(blogPath,data));
				var hash = md5Str(str);
				var ans = front_parse(str);
				ans.hash = hash;
				var result = convertBlogInfo(ans);
				return new Promise(function(resolve,reject){
                self.container.blog.Post
                    .findOne({title:result.title},{hash:1},function(err,data){
                    if(err)
                        reject(err);
                    else
                        resolve(data);
                });
				}).then(function(data){
            var Post = self.container.blog.Post;
            return new Promise(function(resolve,reject){
                if(data === null){//没有找到
                    return Post
                        .create(result,function(err,res){
                            if(err){
                                console.log('cun ru shibai!');
                                reject(err);
                            }
                            else{
                                console.log('存入成功:'+result.title);
                                resolve();
                            }
                        });
                }
                /* data !== null */
                else{
                    if( data.hash !== result.hash){
                        Post.update({title:result.title},result,function(err){
                            if(err){
                                console.log('cun ru shibai!');
                                reject(err);
                            }
                            else{
                                console.log('存入成功:'+result.title);
                                resolve();
                            }
                        });
                    }
                    else{
                        Post.update({title:result.title},{isHave:true},function(err){
                            if(err){
                                console.log('cun ru shibai!');
                                reject(err);
                            }
                            else{
                                console.log('存入成功:'+result.title);
                                resolve();
                            }
                        });
                    }
                }
            });
        });
    });
};


function convertBlogInfo(BlogInfo){
    if(BlogInfo=== undefined)
        return new Error('OJTMInfo is required');
    
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

    /* CodeAuthor */
    if(BlogInfo.CodeAuthor === undefined || BlogInfo.CodeAuthor === null)
        result.CodeAuthor ='Rainboy';
    else
        result.CodeAuthor = BlogInfo.CodeAuthor;
    return result;
}


exports = module.exports = blog;
