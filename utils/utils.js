/**
 * @param { Number } count 数量
 * @return {Number | string} 返回处理过的数量
 * @example
	dealCount(100000)
 */
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


/**
 * @param { Array } authorArr 数组
 * @param { String } arrProperty 数组中要处理的属性
 * @param { String } splitChar 分割符 
 * @return {string} 返回处理完成的数组
 * @example 
	dealAuthor(arr,'name','/')
 */
export function dealAuthor ( authorArr = [] , arrProperty, splitChar = '/') {
	let author = ''
	let num = 0
	authorArr.map(item=>{
		author += item[arrProperty]+splitChar
	})
	return author.substr(0,author.length-1)
}

/**
 * @param { Function } func 执行函数
 * @param { Number } delay 执行时间
 * @return { Function } 返回节流函数
 * @example 
   throttle(func,3000)
 */
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

/**
 * @param { Number } num 数字（10以内）
 * @return {void[]} 返回大写的数字
 * @example 
	level(8)
 */
export function level(num){
	let textArr = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖','拾'],str = undefined
	textArr.forEach((item,index)=>{
		index === num ? str = item : null
	})
	return str
}

/**
 * @param { String } fm 时间格式
 * @param { Number } time 时间
 * @return {String} 返回处理后的时间
 * @example 
	timeFormatting('YYYY-MM-DD hh-mm-ss',134566534536)
 */
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


/**
 * @param { Number } target 时间
 * @return { String } 返回处理过的时间
 */
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
	return m + ':' + s
}

/**
 * @param { Array } arr 要添加颜色属性的数组
 * @param { String } property 颜色属性
 * @param { Array } colors 自定义的颜色数组 
 * @return { Array } 返回带有颜色属性的数组
 * @example 
	 getColor(arr,'bgColor',['#fff','000'])
 */
export function getColor(arr,property,colors = []){
	if(!colors.length){
		colors = ['#633000','#415b63','#271200','#632953','#32f363','#ffaaff']
	}
	
	arr.map((item)=>{
		
		item[property] = colors[Math.floor(Math.random()*colors.length)]
	})
	return arr
}