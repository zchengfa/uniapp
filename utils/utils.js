//处理播放量
export function dealCount ( count ) {
	if(count >=10000 && count < 100000000){
		return (count/10000).toFixed(2) + '万'
	}
	else if(count >= 100000000){
		return (count/100000000).toFixed(2) + '亿'
	}
	else{
		return count
	}
}


//处理歌曲作者
export function dealAuthor ( authorArr = [] , arrProperty) {
	let author = ''
	authorArr.map(item=>{
		author += item[arrProperty]+'/'
	})
	return author.substr(0,author.length-1)
}

//节流
export function throttle (func,delay) {
    let flag = true
    return function (...args) {
        if (flag) {
            setInterval(()=>{
                func.call(this,args)
                flag = true
            },delay)
        }
        flag = false
    }
}

//根据VIP等级返回大写的等级
export function level(num){
	switch(num){
		case 1:
			return '壹';
			break;
		case 2:
			return '贰';
			break;
		case 3:
			return '叁';
			break;
		case 4:
			return '肆';
			break;
		case 5:
			return '伍';
			break;
		case 6:
			return '陆';
			break;
		case 7:
			return '柒';
			break;
		case 8:
			return '捌';
			break;
		case 9:
			return '玖';
			break;
		case 10:
			return '拾';
			break;				
	}
}
