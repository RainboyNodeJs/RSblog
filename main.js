/*-------------------------------------------------
*  生成Db 和 各种 Db model 对象 传给其它模块使用
*-------------------------------------------------*/


var Promise = require('bluebird');
var fs =require('./rexofs.js');
var front_parse = require('./front_matter.js');
var pathFn = require('path');
var mongoose = require('mongoose');
var marko = require('./marko.js');
var md5Str = require('./hash.js').md5Str;
var chalk = require('chalk');


var DbToPost = require('./DbToPost.js');


var Schema = mongoose.Schema;

var RSblog = function(){
    this.db = mongoose.createConnection('mongodb://localhost:20001/website');
    
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

    this.Post = this.db.model('Posts',this.PostSchema);
    
    this.db.on('error',function(){
        console.log('连接错误!!!');
    });

    this.db.once('open',function(){
        console.log('打开数据库成功!');
    });
};

RSblog.prototype.DbToPost = function(){
    return DbToPost(this);
};


var shili = new RSblog();

shili.DbToPost();

