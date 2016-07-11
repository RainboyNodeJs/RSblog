/*-------------------------------------------------
*  所有的MongDb的操作
*-------------------------------------------------*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var _blog = require('./blog.js');
var _OJTM = require('./OJTM.js');
var _book = require('./book.js');

var config = require('../utils/config.js');

/* DB 类 */
var DB  = function(options){
    this.db = mongoose.createConnection(config.DataBase);
    
    this.container = {
        blog:new _blog(this),
        OJTM:new _OJTM(this),
        book:new _book(this),
    };


    /* --------  ---------- */
    /* --------  ---------- */

    this.db.on('error',function(){
        console.log('连接错误!!!');
    });

    this.db.once('open',function(){
        console.log('打开数据库成功!');
    });
};

/* 查找 */
DB.prototype.find = function(model,condition){
        if( model === 'blog' || model === 'Post')
            return this.container.blog.find(this,condition);
        else if(model === 'OJTM')
            return this.container.OJTM.find(this,condition);
		else if(model === 'book')
			return this.container.book.find(this,condition);
};



/* 计数 */
DB.prototype.count= function(model,condition){
        if( model === 'blog' || model === 'Post')
            return this.container.blog.count(this,condition);
        else if(model === 'OJTM')
            return this.container.OJTM.count(this,condition);
};

DB.prototype.DataToDb = function(model,condition){
        if(model === 'OJTM')
            return this.container.OJTM.OJTMtoDB(this);
        if(model === 'book')
            return this.container.book.BookToDB(this,condition);
		if(model === 'blog')
			return this.container.blog.DataToDb(this);
		
};
exports = module.exports = new DB();
