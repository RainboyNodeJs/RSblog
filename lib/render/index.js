var nunjucks = require('nunjucks');
var fs = require('fs');
var Promise = require('bluebird');
var config = require('../utils/config.js');

var path = config.themePath



//nunjucks.configure(path,{ autoescape: true });
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path),{ autoescape: false });



/*  name 模板名字
 *  data 要渲染的数据
 *  渲染单个页面
 * */
var _render = function(layout,data,outPath){
    //return TemplateContainer[name](env,data);
    var ans = env.render(layout+'.html', data);
    return new Promise(function(resolve,reject){
        fs.writeFile(outPath,ans,function(err){
            if(err){
                console.log('渲染失败');
                reject(err);
            }
            else{
                console.log('渲染成功');
                resolve();
            }
        });
    });
};


exports = module.exports = _render;
