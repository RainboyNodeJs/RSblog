var mongoose = require('mongoose');
var Promise = require('bluebird');
var pathFn = require('path');
var Schema = mongoose.Schema;
var chalk = require('chalk');
var md5Str = require('../utils/hash.js').md5Str;
var front_parse = require('../utils/front_matter.js');
var fs = require('../utils/rexofs.js');
var nfs = require('fs');
var SC = require('../utils/SummaryConvert.js');
var config = require('../utils/config.js');



var join = pathFn.join;
var listDir = fs.listDir;

var warningStr = chalk.green('[ WARNING ]');

var book  = function(Db){
    var self = Db.db;
    this.PostSchema= new Schema({
        bookName:String,
        hash:String,
        source:String,
		outPath:String,
        data:[],
    });

    this.Post = self.model('Books',this.PostSchema);
};


book.prototype.find = function(self,condition){
    var con = condition.condition || {};
    var sort = condition.sort || {update:-1};
    var select = condition.select || '';
    var skip = condition.skip || 0;
    var limit = condition.limit || 0;
    return new Promise(function(resolve,reject){
            self.container.book.Post
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


book.prototype.BookToDB = function(self,bookName){
    //var path = 'E:/MY_code/Git files/myHexo/book/SUMMARY.md';
    var path  = '';
	var bookPath = '';
	var outPath = '';
    for( var i =0 ;i<config.Books.length;i++)
        if(bookName === config.Books[i].name){
			bookPath = config.Books[i].SourcePath;
			outPath = config.Books[i].outPath
            path = join(config.Books[i].SourcePath,'SUMMARY.md');
			break;
		}
    //var bookName = 'NoipBook';
    var post = self.container.book.Post;
    var str = nfs.readFileSync(path);
    var hash = md5Str(str);
    var result ={
        bookName:bookName,
        hash:hash,
		source:bookPath,
		outPath:outPath
    };
    return SC(path).then(function(data){
        result.data = data;
        return new Promise(function(resolve,reject){
                post.findOne({bookName:bookName},function(err,ans){
                    if(err)
                        reject(err);
                    else
                        resolve(ans);
                });
        });
    }).then(function(data){ //查找的数据
    return new Promise(function(resolve,reject){
                if(data === null){
                    return post
                        .create(result,function(err,res){
                            if(err){
                                console.log('cun ru shibai!');
                                reject(err);
                            }
                            else{
                                console.log('cun ru chenggong');
                                resolve(true);
                            }
                        });
                }
                /* data !== null */
                else{
                    if( data.hash !== result.hash){
                        post.update({bookName:result.bookName},result,function(err){
                            if(err){
                                console.log('cun ru shibai!');
                                reject(err);
                            }
                            else{
                                console.log('cun ru chenggong');
                                resolve(true);
                            }
                        });
                    }
                    else{
                        console.log('已经有这本书了:'+result.bookName);
                        resolve(false);
                    }
                }
    });
    });
};

book.prototype.count = function(self,condition){
    condition = condition || {isHave:true};
    return new Promise(function(resolve,reject){
            self.container.OJTM.Post
                .count(condition,function(err,count){
                    if(err)
                        reject(err);
                    else
                        resolve(count);
                });
    });
};
exports = module.exports = book;
