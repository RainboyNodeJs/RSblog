var fs = require('fs');


var renderPost = function(env,data){

    var ans = env.render('post.html', data);
    fs.writeFile(data.post.title+'.html',ans,function(err){
        if(err)
            console.log('渲染失败');
        else
            console.log('渲染成功');
    });
};

exports = module.exports = renderPost;
