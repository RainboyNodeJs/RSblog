---
title: mongoose 学习笔记
date: 2016-03-17 22:49:09
update: 2016-03-17 22:49:09
tags:
	- nodejs
	- mongooose
categories: nodejs
---


### 资源

 - [mongoose API](http://mongoosejs.com/docs/api.html)
 - [Mongoose学习参考文档](http://cnodejs.org/topic/504b4924e2b84515770103dd)
 - [mongoose中文API](http://www.nonb.cn/blog/nodejs-mongoose-query-chinaese.html)
 - [mongoose官方网站](http://mongoosejs.com/docs/guide.html)

Schema -相当于一个表框架
Model - Model相当于db里的集合,里面有Schema表,同时它也具有操作,可以有实体
Entity - 实体,存在的意义就是由Schema定义表框架同后发表Model,而Model关联到**集合**,关联集合后就会有一个Model对象,可以用Model对象创建一个**实体**能包含具体数据,就能保存了


### schema 有方法

### 查询

Model.find(tiaojian,function(err,docs){});


### 增加

Model.create


### 更新

Model.update(condion,{$set:{age:16},function(err,docs));

### 删除

Model.remove(condion,function(err){});


### limit 上限  skip 下限

```
find(Conditions,fields,options,callback);
    Model.find({},null,{limit:20},function(err,docs){
        console.log(docs);
    });

Model.find({},null,{skip:4},function(err,docs){
        console.log(docs);
    });
	
	
Model.find({},null,{sort:{age:-1}},function(err,docs){
      //查询所有数据，并按照age降序顺序返回数据docs
    });
```
