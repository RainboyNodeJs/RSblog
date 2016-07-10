
/* 
 *  all 总数据疸
 *  pag 要分的量
 * */
function pagination(all,pag){
    var result = [];
	var pag = 10;
	var cnt = all / pag;	
	for(var i=1;i<=cnt;i++)
		result.push(pag);
	
	if( all % pag >0)
		result.push(all % pag);
    
    return result;
}
exports = module.exports = pagination;
