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
		default:
			return '零'
	}
}

//时间格式化
export function timeFormatting (fm,time){
    //拓展Date的时间格式化函数
    Date.prototype.format = function (fmt){
        let formatObject = {
            "M+": this.getMonth() + 1,                   //月份
            "d+": this.getDate(),                        //日
            "h+": this.getHours(),                       //小时
            "m+": this.getMinutes(),                     //分
            "s+": this.getSeconds(),                     //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()                  //毫秒
        };

        //  获取年份
        // ①
        if (/(y+)/i.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (let k in formatObject) {
            // ②
            if (new RegExp("(" + k + ")", "i").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1, (RegExp.$1.length === 1) ? (formatObject[k]) : (("00" + formatObject[k]).substr(("" + formatObject[k]).length)));
            }
        }
        return fmt;
    }
    if (time){
			//防止传送的时间是纯数字时报错
			try{
				return time.format(fm)
			}
			catch(e){
				return new Date(time).format(fm)
			}
    }
    else {
        return new Date().format(fm)
    }

}


//事件转换成分钟
export function transTime(target){
	let minutes = target/60
	let m = dealTime(Math.floor(minutes))
	let pointIndex = minutes.toString().indexOf('.')+1
	let remaining = minutes.toString().substr(pointIndex)
	let remainingS = Number('0.'+remaining)*60
	let s = dealTime(Math.floor(remainingS))
	function dealTime(t){
		return t<10?'0'+t:t
	}
	let t = m + ':' + s
	
	return t
}