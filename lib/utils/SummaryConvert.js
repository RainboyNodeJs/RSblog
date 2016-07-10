var fs = require('fs');
var Promise = require('bluebird');

/* 测试regex */

/* 1.得到每一行 ,输出匹配的一行*/
/* 2.判断每一行开头的空格的多少 */
/* 3.返回值
 * [ {
 *      name: []里面的名字
 *      path:()里的字符
 *      level:级别,0 1 2 3 4 5 6 和它上面的第一个空格比自己少的空格+1
 *      outpath:把path转换成拼音
 *  }
 * ]
 * 每一个空格前面的空格 必须是4的倍数
 * */

function SummaryConvert(SummaryPath){
	return new Promise( function(res,rej){
		var ans = _SummaryConvert(SummaryPath);
		res(ans);
	});
 }
 
function _SummaryConvert(SummaryPath){

    var pattern = /^\ *\*\ \[([\S\ ]+)\]\((\S+)\)$/;
    var p2 = /^[\S,\ ]*$/gm;
    var ans = [];
    
    var stat = fs.statSync(SummaryPath);
    if(!stat.isFile()){
        return new Error(SummaryPath + 'do not exits');
    }
    
    var str = fs.readFileSync(SummaryPath,{encoding:'UTF-8'});

    /* 字符前的空格数 */
    function getbank(str){
        var j=0;
        while( str[j] === ' ') j++;
        return j;
    }

    /* 和前面的比较得到等级 */
    function getlevel( ans,j){
        if(ans.length === 0) return 0;
        for(var k =ans.length-1;k>=0;k--){

            if(j === ans[k].blank){
                return ans[k].level;
            } else if( j >= ans[k].blank)
                return ans[k].level+1;

        }
    }

    if(p2.test(str)){
        var singline = str.match(p2);
        if(singline.length === 0) return; //过滤空行
        //console.log(singline.length);
        for(var i =0;i<singline.length;i++ ){
            if(pattern.test(singline[i])){
                var res = singline[i].match(pattern);
                if( ans.length === 0){ //压入第一行的数据
                    var j =getbank(singline[i]);
                    ans.push({
                        name:res[1],
                        path:res[2],
                        level:0,
                        blank:j
                    });
                } else {
                    var j =getbank(singline[i]);
                    /* 根据j来得到level */
                    var l = getlevel(ans,j);
                    ans.push({
                        name:res[1],
                        path:res[2],
                        level:l,
                        blank:j
                    });
                }

            } else {
                if( i !== singline.length-1)
                    throw new Error('SUMMARY no match!!');
            }
        }
    }
    return ans;
}
//console.log(str);
//console.log(pattern.test(str));





/*
var ans =SummaryConvert("./SUMMARY.md");
for(var i = 0;i<ans.length ;i++ ){
    console.log("%d:%d %s %s",i,ans[i].level,ans[i].name,ans[i].path);
}
*/

exports = module.exports = SummaryConvert;
exports._SummaryConvert = _SummaryConvert;


