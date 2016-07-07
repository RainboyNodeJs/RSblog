
var nunjucks = require('nunjucks');

var path = 'E:\\MY_code\\Git files\\RainboyTheme\\nunjucks\\';
nunjucks.configure(path,{ autoescape: false });

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path));



/*  name 模板名字
 *  data 要渲染的数据
 *  渲染单个页面
 * */
var _render = function(layout,data,outPath){
    //return TemplateContainer[name](env,data);
    var ans = env.render(layout+'.html', data);

    fs.writeFile(outPath,ans,function(err){
        if(err)
            console.log('渲染失败');
        else
            console.log('渲染成功');
    });
};


exports.renderPost = render;
