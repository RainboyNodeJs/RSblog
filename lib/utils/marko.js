var mared = require('marked');
var hljs = require('highlight.js');

// 自定义Render
var renderer = new mared.Renderer();
// 原始marked生成anchor时不支持中文，这里加入中文支持，以便与TOC相匹配
renderer.heading = function (text, level) {
    return '<h'
        + level
        + ' id="'
        + this.options.headerPrefix
        + text.toLowerCase().replace(/\./g, '').replace(/[^[\w\u0100-\uffff\]]+/g, '-')
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
}


// 开启GFM并支持代码高亮
mared.setOptions({
    gfm: true,
    //langPrefix: 'prettyprint linenums lang-',
    renderer: renderer,
    highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

function compileFile(mdpath){
    if(mdpath.slice(-2).toString() !== 'md'){
        throw new Error("Not MD file:"+mdpath);
    }
    
    var content = fs.readFileSync(mdpath,{encoding:'UTF-8'});
    return mared(content);
}

function compile(Str){
    if (typeof Str !== 'string') throw new TypeError('str is required!');
    return mared(Str);
}



exports = module.exports = compile;
exports.compileFile = compileFile ;

