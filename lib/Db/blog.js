var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;

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


exports = module.exports = blog;
