import store from '../store/index.js'

const baseUrl = "https://www.codeman.ink/api"

function Get(URL){
	return new Promise((resolve)=>{
		uni.request({
			url:baseUrl+URL,
			method:'GET',
			withCredentials:true,
			success:(res)=>{
				resolve(res.data)
			}
		})
	})
}

function Post(URL,datas){
	return new Promise((resolve)=>{
		uni.request({
			url:baseUrl+URL,
			method:'POST',
			data:datas,
			withCredentials:true,
			success:(res)=>{
				resolve(res.data)
			}
		})
	})
}

/**
 * 榜单内容摘要
 * @author zcf
 */
export function topList  (){
	return new Promise(resolve=>{
		Get(`/toplist/detail`).then(res=>{
			 let result = res.list
			 resolve(result)
		})
		
	})
}

/**
 * 榜单详情
 * @param { Number | String } id  榜单id
 * @author zcf
 */
export function listDetail(id){	
	return Get(`/playlist/track/all?id=${id}`)
}

/**
 * 获取歌曲信息
 * @param { Number } songId 歌曲id
 * @author zcf
 */
export function songDetail(songId){
	return Get('/song/detail?ids='+songId)
}


/**
 * 获取歌曲音源
 * @param { Number } songId 歌曲id
 * @author zcf
 */
export function songData (songId){
	return Get('/song/url?id='+songId)
}

/**
 * 获取歌曲信息
 * @param { Number } songId 歌曲id
 * @param { Number } br 码率  
 * @author zcf
 */
export function downloadSong (songId,br = 999){
	return Get('/song/download/url?id='+songId+'&br='+br)
}
 
/**
 * 获取歌曲信息（歌词除外）
 * @param { Number } songId 歌曲id
 * @author zcf
 */
export async function songExceptLyric(songId){
	let data = {}
	//歌曲基本信息
	await songDetail(songId).then(res=>{

		data.detail = res.songs[0]
		
	})
	//歌曲音频
	await songData(songId).then(res=>{
		
		data.url = res.data[0].url
		
	})
	if( Object.keys(data).length === 2 ) {
		return new Promise(resolve=>{
			resolve(data)
		})
	}
	
}

//点击爱心按钮喜欢/取消喜欢音乐/like?id=xxx
/**
 * 给歌曲点亮红心或取消红心
 * @param { Number } id 歌曲id
 * @param { Boolean } like 喜欢true、不喜欢false  
 * @author zcf
 */
export function likeSong(id,like = true){
	return Get(`/like?id=${id}&like=${like}`)
}

/**
 * 首页滚动菜单
 * @author zcf
 */
export function indexScrollMenu(){
	return Get(`/homepage/dragon/ball`)
}

/**
 * 首页推荐菜单
 * @author zcf
 */
export function indexSongSheet(){
	return Get(`/personalized`)
}

/**
 * 热门歌单分类
 * @author zcf
 */
export function playlistHotCate(){
	return Get('/playlist/hot')
}

/**
 * 歌单分类详情歌单
 * @param { Number | String }  cate 类型
 * @param { Number }  offset 偏移量
 * @param { Number }  limit 一次性返回的数量
 * @author zcf
 */
export function topPlaylist(cate,offset=0,limit=21){
	return Get(`/top/playlist?cat=${cate}&offset=${offset}&limit=${limit}`)
}

/**
 * 歌单详情数据
 * @param { Number }  id 歌单id
 * @author zcf
 */
export function playListDeatil(id){
	return Get(`/playlist/detail?id=${id}`)
}

/**
 * 获取歌单中的前几首歌曲
 * @param { Number }  id 歌单id
 * @param { Number }  offset 偏移量
 * @param { Number }  limit 返回几首
 * @author zcf
 */
export function topSong(id,limit = 3,offset = 0){
	return Get(`/playlist/track/all?id=${id}&limit=${limit}&offset=${offset}`)
}


/**
 * 首页轮播图数据
 * @param { Number }  type 设备类型（0：pc、1：安卓、2：iphone、3：ipad）
 * @author zcf
 */
export function banner(type = 1){
	return Get(`/banner?type=${type}`)
}

/**
 * 首页其她数据
 * @author zcf
 */
export function homePageData(){
	return Get('/homepage/block/page')
}


/**
 * 获取歌词
 * @param { Number }  songId 歌曲id
 * @author zcf
 */
export function lyric(songId) {
	return Get('/lyric?id='+ songId)
}


/**
 * 默认搜索关键词
 * @author zcf
 */
export function keywordDefault() {
	return Get('/search/default')
}

/**
 * 搜索词相关
 * @param { String }  keyword 搜索词
 * @author zcf
 */
export function searchSuggest(keyword) {
	return Get(`/search/suggest?keywords=${keyword}&type=mobile`)
}

/**
 * 热搜榜
 * @author zcf
 */
export function hotSearch() {
	return Get(`/search/hot/detail`)
}

/**
 * 综合搜索
 * @param { String }  word 搜索词
 * @param { Number }  type 搜索类型默认为 1018 即综合搜索 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
 * @param { Number }  offset 偏移量
 * @param { Number }  limit 获取量
 * @author zcf
 */
export function summarySearch(word,type=1018,offset=0,limit=20) {
	return Get(`/search?keywords=${word}&type=${type}&offset=${offset}&limit=${limit}`)
	
}


/**
 * 获取评论数据
 * @param { Number }  id 资源id
 * @param { 1 | 2 | 3 }  sortType 排序方式 1、推荐排序 2、热度排序 3、时间排序
 * @param { 0| 1 | 2 | 3 | 4 | 5 | 6 | 7 }  0: 歌曲、1: mv、2: 歌单、3: 专辑、4: 电台节目、5: 视频、6: 动态、7: 电台
 * @author zcf
 */
export function comments(id,sortType = 3,type = 0) {
	return Get(`/comment/new?type=${type}&id=${id}&sortType=${sortType}`)
	
}




/**
 * 歌曲评论（旧的评论接口）（用于在歌曲详情页获取评论总数）
 * @param { Number }  id  歌曲id
 * @author zcf
 */
export function commentsTotalNum (id){
	return Get(`/comment/music?id=${id}&limit=1&offset=1`)
}


/**
 * 在时间排序的情况下获取更多评论数据
 * @param { Number }  id  资源id
 * @param { Number }  sortType 排序方式 1、推荐排序 2、热度排序 3、时间排序
 * @param { 0| 1 | 2 | 3 | 4 | 5 | 6 | 7 } type  0: 歌曲、1: mv、2: 歌单、3: 专辑、4: 电台节目、5: 视频、6: 动态、7: 电台
 * @param { Number } cursor 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
 * @param { Number }   pageNo:分页参数,第 N 页,默认为 1
 * @param { Number }  pageSize:分页参数,每页多少条数据,默认 20 
 * @author zcf
 */
export function moreCommentsByTime(id,sortType,cursor,pageSize,pageNo,type = 0) {
	return Get(`/comment/new?type=${type}&id=${id}&sortType=${sortType}&cursor=${cursor}&pageSize=${pageSize}&pageNo=${pageNo}`)
}


/**
 * 在其他排序的情况下获取更多评论数据
 * @param { Number }  id  资源id
 * @param { Number }  sortType 排序方式 1、推荐排序 2、热度排序 3、时间排序
 * @param { 0| 1 | 2 | 3 | 4 | 5 | 6 | 7 } type  0: 歌曲、1: mv、2: 歌单、3: 专辑、4: 电台节目、5: 视频、6: 动态、7: 电台
 * @param { Number }   pageNo:分页参数,第 N 页,默认为 1
 * @param { Number }  pageSize:分页参数,每页多少条数据,默认 20 
 * @author zcf
 */
export function moreCommentsByOtherType(id,sortType,pageSize,pageNo,type = 0) {
	return Get(`/comment/new?type=${type}&id=${id}&sortType=${sortType}&pageSize=${pageSize}&pageNo=${pageNo}`)
}


/**
 * 获取评论回复数据
 * @param { Number }  id  资源id
 * @param { Number }  commentId 评论id
 * @param { 0| 1 | 2 | 3 | 4 | 5 | 6 | 7 } type  0: 歌曲、1: mv、2: 歌单、3: 专辑、4: 电台节目、5: 视频、6: 动态、7: 电台
 * @param { Number }  limit 获取数量
 * @author zcf
 */
export function commentsReply(id,commentId,type = 0,limit = 10){
	return Get(`/comment/floor?parentCommentId=${commentId}&id=${id}&type=${type}&limit=${limit}`)
}

/**
 * 获取更多评论回复数据
 * @param { Number }  id  资源id
 * @param { Number }  commentId 评论id
 * @param { 0| 1 | 2 | 3 | 4 | 5 | 6 | 7 } type  0: 歌曲、1: mv、2: 歌单、3: 专辑、4: 电台节目、5: 视频、6: 动态、7: 电台
 * @param { Number }  limit 获取数量
 * @param { Number }  time 上一页最后一条回复的时间
 * @author zcf
 */
export function moreCommentsReply(id,commentId,type = 0,time,limit = 10){
	return Get(`/comment/floor?parentCommentId=${commentId}&id=${id}&type=${type}&limit=${limit}&time=${time}`)
}

/**
 * 评论
 * @param { Object } options 请求参数
 * @param { 1|2 } options.t 1为评论、2为回复
 * @param { 0|1|2|3|4|5|6 } options.type 0歌曲、1mv、2歌单、3专辑、4电台、5视频、6动态
 * @param { Number | string } options.id 资源id
 * @param { string } options.content 评论的内容
 * @param { string } options.cookie 登录后得到的cookie
 * @return { Function } 返回一个Promise函数
 * @example
	sendComment({
		t:1,
		type:this.dataType,
		id:this.vId,
		content,
		cookie:this.cookie
	})
 */
export function sendCommentOrReply(options){
	return Post('/comment',options)
}


/**
 * 获取MV
 * @param { Number }  offset 偏移量  
 * @param { Number }  limit 获取数量
 * @author zcf
 */
export function allMv(offset,limit = 20){
	return Get (`/mv/all?offset=${offset}&limit=${limit}`)
}


/**
 * 获取mv或video的点赞数、分享数等信息
 * @param { Number }  vId  资源id
 * @author zcf
 */
export function vInfo(vId){
	if(Number(vId)){
		return Get(`/mv/detail/info?mvid=${vId}`)
	}
	else{
		return Get(`/video/detail/info?vid=${vId}`)
	}
}

/**
 * 获取mv或video的名字、歌手、发布时间等信息
 * @param { Number }  vId  资源id
 * @author zcf
 */
export function vDetail(vId){
	if(Number(vId)){
		return Get(`/mv/detail?mvid=${vId}`)
	}
	else{
		return Get(`/video/detail?id=${vId}`)
	}	
	
	
}

/**
 * 获取mv或video资源地址
 * @param { Number }  vId  资源id
 * @author zcf
 */
export function vUrl(vId){
	if(Number(vId)){
		return Get(`/mv/url?id=${vId}`)
	}
	else{
		return Get(`/video/url?id=${vId}`)
	}	
}

/**
 * 获取相关的mv或video
 * @param { Number }  vId  资源id
 * @author zcf
 */
export function relatedMV(vId){
	if(Number(vId))
	{
		return Get(`/simi/mv?mvid=${vId}`)
	}
	else{
		return Get(`/related/allvideo?id=${vId}`)
	}
	
}


/**
 * 我的页面获取推荐歌单
 * @author zcf
 */
export function recommendSongSheet(){
	return Get(`/personalized?limit=6`)
}

/**
 * 获取验证码
 * @param { Number } phone 手机号码
 * @author zcf
 */
export function sendValidate(phone){
	return Get(`/captcha/sent?phone=${phone}`)
}

/**
 * 验证
 * @param { Number } phone 手机号码
 * @param { Number } code 收到的手机验证码
 * @author zcf
 */
export function verifyCode(phone,code){
	return Get(`/captcha/verify?phone=${phone}&captcha=${code}`)
}

/**
 * 验证通过进行登录（暂时绕不开，请使用二维码登录）
 * @param { Number } phone 手机号码
 * @param { Number } code 收到的手机验证码
 * @author zcf
 */
export function loginWithPhone(phone,code){
	return Get(`/login/cellphone?phone=${encodeURIComponent(phone)}&captcha=${code}`)
}

/**
 * 查看登录状态
 * @param { String } cookie 登录后得到的cookie
 * @author zcf
 */
export function loginStatus(cookie){
	return Post('/login/status',{
		cookie
	})
}

/**
 * 注册
 * @param { Number } phone 手机号码
 * @param { Number } code 收到的手机验证码 
 * @param { String | Number } pwd 密码
 * @param { Number } code 收到的手机验证码
 * @param { String } nickname 用户名
 * @author zcf
 */
export function register(nickname,phone,pwd,code){
	return Get(`/register/cellphone?phone=${phone}&password=${pwd}&captcha=${code}&nickname=${nickname}`)
}


/**
 * 检测手机号是否被注册
 * @param { Number } phone 手机号码
 * @author zcf
 */
export function checkPhone(phone){
	return Get(`/cellphone/existence/check?phone=${phone}`)
}


/**
 * 登录后获取的动态消息
 * @param { Object } data 配置
 * @param { Number } data.pageSize 消息数量 
 * @param { 'cookie' } data.cookie cookie
 * @author zcf
 */
export function event(data){
	return Post(`/event`,data)
}



/**
 * 登录成功后调用api可以获取用户喜欢的音乐id列表
 * @param { Object } data 配置
 * @param { Number } data.uid 用户id 
 * @param { 'cookie' } data.cookie cookie
 * @author zcf
 */
export function userLikeMusicList (data) {
	return 	Post(`/likelist`,data)
}


/**
 * 登录成功后获取用户的歌单（包含喜欢的音乐歌单）
 * @param { Object } data 配置
 * @param { Number } data.uid 用户id 
 * @param { 'cookie' } data.cookie cookie
 * @author zcf
 */
export function userPlayList(data){
	return Post(`/user/playlist`,data)
}


/**
 * 登录成功后心动模式/智能播放
 * @param { Object } data 配置
 * @param { Number } data.id 歌曲id 
 * @param { Number } data.pid 歌单id 
 * @param { 'cookie' } data.cookie cookie
 * @author zcf
 */
export function loveMode(data){
	return Post(`/playmode/intelligence/list`,data)
}

/**
 * 登录成功后获取用户等级信息
 * @param { Object } data 配置
 * @param { 'cookie' } data.cookie cookie
 * @author zcf
 */
export function userLevel(data){
	return Post(`/user/level`,data)
}


/**
 * 登录成功后获取首页每日推荐歌曲数据
 * @param { String } cookie 登录后得到的cookie
 * @author zcf
 */
export function recSongs(cookie){
	return Get(`/recommend/songs?cookie=${cookie}`)
}


/**
 * 热门话题详情
 * @param { Number } id 话题id
 * @author zcf
 */
export function topicDetail(id){
	return Get(`/topic/detail?actid=${id}`)
}

/**
 * 私人FM（需登录后使用）
 * @author zcf
 */
export function personalFm(){
	return Get('/personal_fm')
}

/**
 * 最近播放（需登录后使用）
 * @param { String }  type 最近播放类型 （song：歌曲、video：视频、voice：声音、playlist：歌单、album：专辑、dj：播客）
 * @param { Number } limit 返回数量（默认100）  
 * @author zcf
 */
export function recentlyPlayed(type,cookie,limit = 300){
	return Get('/record/recent/'+type + '?limit=' + limit + '&cookie=' + cookie )
}

/**
 * 数字专辑信息（点赞数量等信息）
 * @param { Number } id 专辑id
 * @author zcf
 */
export function albumInfo(id){
	return Get('/album/detail/dynamic?id=' + id)
}

/**
 * 数字专辑内容
 * @param { Number } id 专辑id
 * @author zcf
 */
export function album(id){
	return Get('/album?id=' + id)
}

/**
 * 数字专辑详情
 * @param { Number } id 专辑id
 * @author zcf
 */
export function digitalAlbum(id){
	return Get('/album/detail?id=' + id)
}


/**
 * 二维码登录（已通过获取到的unikey获取二维码图片base64）
 * @author zcf
 */
export function loginQR(){
	//1.获取key
	return Get('/login/qr/key').then(res=>{
		if(res.code === 200){
			let unikey = res.data.unikey
			//保存得到的unikey
			store.dispatch('unikey',unikey)
			return	Get(`/login/qr/create?key=${unikey}&qrimg=1`)
		}
	})
}


/**
 * 二维码检测扫码状态（已带上时间戳）
 * @author zcf
 */
export function checkQR(){
	let unikey = store.state.user.unikey
	return Get(`/login/qr/check?key=${unikey}&timestamp=${new Date().getTime()}`)
}