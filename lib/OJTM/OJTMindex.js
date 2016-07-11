var Promise = require('bluebird');
var DB = require('../Db/index.js');
var TaskQueue = require('../utils/TaskQueue.js');
var render = require('../render/index.js');
var PathFn = require('path');
var DataFormat = require('../utils/time.js').DataFormat;
var marko = require('../utils/marko.js');
var fs = require('../utils/rexofs.js');
var router = require('../utils/Router.js');
var config = require('../utils/config.js');

var join = PathFn.join;

var sitePath  = config.ChildSite;

function _OJTMIndex(data,opts){
    if(opts === undefined ){
        opts = {};
        opts.outPath = 'OJTM';
    }
    var ans = [];
    for(var i =0;i<data.length;i++){
        ans.push({
            outPath:router(data[i].title),
            title:data[i].title,
            categories:data[i].categories,
            URL:data[i].URL,
            oj:data[i].oj,
            level:data[i].level,
            tags:data[i].tags,
        });
    }
    opts.outPath = join(sitePath,opts.outPath,'index.html');
	fs.mkdirsSync(PathFn.dirname(opts.outPath));
    return render('OJTMindex',{
        OJTMs:ans
    },opts.outPath);
}

function OJTMIndex(opts){
    return DB.find('OJTM',{
        condition:{"isHave" : true},
        select:'title categories level tags oj URL'
    }).then(function(ans){
        //console.log(data);
        return _OJTMIndex(ans,opts);
    });
}


exports = module.exports =OJTMIndex;
