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

//排行榜
export function topList  (){
	return new Promise(resolve=>{
		Get(`/toplist/detail`).then(res=>{
			 let result = res.list
			 resolve(result)
		})
		
	})
}

//榜单详情
export function listDetail(id){	
	return Get(`/playlist/track/all?id=${id}`)
}

//获取歌曲信息
export function songDetail(songId){
	return Get('/song/detail?ids='+songId)
}


//获取歌曲音频
export function songData (songId){
	return Get('/song/url?id='+songId)
}

//下载歌曲
export function downloadSong (songId,br = 999){
	return Get('/song/download/url?id='+songId+'&br='+br)
}
 

//获取用户选择的歌曲所需数据（除歌词外） 
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
export function likeSong(id,like = true){
	return Get(`/like?id=${id}&like=${like}`)
}

//首页滚动菜单
export function indexScrollMenu(){
	return Get(`/homepage/dragon/ball`)
}

//首页推荐歌单
export function indexSongSheet(){
	return Get(`/personalized`)
}

//热门歌单分类
export function playlistHotCate(){
	return Get('/playlist/hot')
}

//歌单分类详情歌单
export function topPlaylist(cate,offset=0,limit=21){
	return Get(`/top/playlist?cat=${cate}&offset=${offset}&limit=${limit}`)
}

//获取歌单详情数据
export function playListDeatil(id){
	return Get(`/playlist/detail?id=${id}`)
}

//获取歌单前几首歌曲
export function topSong(id,limit = 3,offset = 0){
	return Get(`/playlist/track/all?id=${id}&limit=${limit}&offset=${offset}`)
}

//首页轮播图数据type（0：pc、1：安卓、2：iphone、3：ipad）
export function banner(type = 1){
	return Get(`/banner?type=${type}`)
}

//获取首页数据
export function homePageData(){
	return Get('/homepage/block/page')
}


//lyric?id=33894312 获取歌词
export function lyric(songId) {
	return Get('/lyric?id='+ songId)
}


//默认搜索关键词https://www.codeman.ink/api/search/default
export function keywordDefault() {
	return Get('/search/default')
}

//搜索建议https://www.codeman.ink/api/search/suggest?keywords=海阔天空&type=mobile
export function searchSuggest(keyword) {
	return Get(`/search/suggest?keywords=${keyword}&type=mobile`)
}

//热搜榜https://www.codeman.ink/api/search/hot/detail
export function hotSearch() {
	return Get(`/search/hot/detail`)
}

//综合搜索https://www.codeman.ink/api/search?keywords=海阔天空&type=1018
export function summarySearch(word,type=1018,offset=0,limit=20) {
	return Get(`/search?keywords=${word}&type=${type}&offset=${offset}&limit=${limit}`)
	
}


// cursor: 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
export function comments(id,sortType = 3,type = 0) {
	return Get(`/comment/new?type=${type}&id=${id}&sortType=${sortType}`)
	
}



//歌曲评论（旧的评论接口）（用于在歌曲详情页获取评论总数）
export function commentsTotalNum (id){
	return Get(`/comment/music?id=${id}&limit=1&offset=1`)
}

//获取更多评论
export function moreCommentsByTime(id,sortType,cursor,pageSize,pageNo,type = 0) {
	return Get(`/comment/new?type=${type}&id=${id}&sortType=${sortType}&cursor=${cursor}&pageSize=${pageSize}&pageNo=${pageNo}`)
}


export function moreCommentsByOtherType(id,sortType,pageSize,pageNo,type = 0) {
	return Get(`/comment/new?type=${type}&id=${id}&sortType=${sortType}&pageSize=${pageSize}&pageNo=${pageNo}`)
}
//获取评论回复数据
export function commentsReply(songId,commentId,type = 0,limit = 10){
	return Get(`/comment/floor?parentCommentId=${commentId}&id=${songId}&type=${type}&limit=${limit}`)
}
//获取更多评论回复数据
export function moreCommentsReply(songId,commentId,type = 0,time,limit = 10){
	return Get(`/comment/floor?parentCommentId=${commentId}&id=${songId}&type=${type}&limit=${limit}&time=${time}`)
}

//全部.https://www.codeman.ink/api/mv/all?offset=1&limit=50
export function allMv(offset,limit = 20){
	return Get (`/mv/all?offset=${offset}&limit=${limit}`)
}


//获取MV详情信息https://www.codeman.ink/api/mv/detail/info?mvid=14559050（点赞数、分享数、评论数、当前用户对该mv是否点过赞{未登录默认为false}）
export function vInfo(vId){
	if(Number(vId)){
		return Get(`/mv/detail/info?mvid=${vId}`)
	}
	else{
		return Get(`/video/detail/info?vid=${vId}`)
	}
}

//mv 名字 , 歌手 , 发布时间 ,https://www.codeman.ink/api/mv/detail?mvid=14559050
export function vDetail(vId){
	if(Number(vId)){
		return Get(`/mv/detail?mvid=${vId}`)
	}
	else{
		return Get(`/video/detail?id=${vId}`)
	}	
	
	
}

//MV播放地址https://www.codeman.ink/api/mv/url?id=14559050
export function vUrl(vId){
	if(Number(vId)){
		return Get(`/mv/url?id=${vId}`)
	}
	else{
		return Get(`/video/url?id=${vId}`)
	}	
}

//获取相关mv或video
export function relatedMV(vId){
	if(Number(vId))
	{
		return Get(`/simi/mv?mvid=${vId}`)
	}
	else{
		return Get(`/related/allvideo?id=${vId}`)
	}
	
}

//获取MV或video评论
// export function commentsMV(vId){
// 	if(Number(vId))
// 	{
// 		return Get(`/comment/mv?id=${vId}`)
// 	}
// 	else{
// 		return Get(`/comment/video?id=${vId}`)
// 	}
// }

//我的页面获取推荐歌单
export function recommendSongSheet(){
	return Get(`/personalized?limit=6`)
}

//获取验证码https://www.codeman.ink/api/captcha/sent?phone=
export function sendValidate(phone){
	return Get(`/captcha/sent?phone=${phone}`)
}

//验证手机验证码https://www.codeman.ink/api/captcha/verify?phone=1111&captcha=1111
export function verifyCode(phone,code){
	return Get(`/captcha/verify?phone=${phone}&captcha=${code}`)
}

//验证成功后使用该验证码和手机号进行登录https://www.codeman.ink/api/login/cellphone?phone=111111&captcha=1111
//登录提示网络太拥挤
export function loginWithPhone(phone,code){
	return Get(`/login/cellphone?phone=${encodeURIComponent(phone)}&captcha=${code}`)
}

//查看登录状态
export function loginStatus(){
	return Get('/login/status')
}

//注册
export function register(nickname,phone,pwd,code){
	return Get(`/register/cellphone?phone=${phone}&password=${pwd}&captcha=${code}&nickname=${nickname}`)
}

//检测手机号是否被注册
//https://www.codeman.ink/api/cellphone/existence/check?phone=
export function checkPhone(phone){
	return Get(`/cellphone/existence/check?phone=${phone}`)
}


//获取关注页面动态消息https://www.codeman.ink/api/event?pagesize=50说明 : 调用此接口 , 可获取各种动态 , 对应网页版网易云，朋友界面里的各种动态消息 ，如分享的视频，音乐，照片等！
export function event(){
	return Get(`/event?pagesize=20`)
}


//登录成功后调用api可以获取用户喜欢的音乐id列表
//likelist?uid=2342343244
export function userLikeMusicList (uid) {
	return 	Get(`/likelist?uid=${uid}`)
}

//获取用户的歌单（包含喜欢的音乐歌单）/user/playlist?uid=42432423423
export function userPlayList(uid){
	return Get(`/user/playlist?uid=${uid}`)
}

//心动模式/智能播放https://www.codeman.ink/api/playmode/intelligence/list?id=&pid=xxx
export function loveMode(id,listId){
	return Get(`/playmode/intelligence/list?id=${id}&pid=${listId}`)
}

//获取用户等级信息https://www.codeman.ink/api/user/level
export function userLevel(){
	return Get(`/user/level`)
}

//获取首页中每日推荐歌曲数据/recommend/songs
export function recSongs(){
	return Get(`/recommend/songs`)
}


//获取热门话题详情 /topic/detail?actid=xxxxx
export function topicDetail(id){
	return Get(`/topic/detail?actid=${id}`)
}

//私人FM
export function personalFm(){
	return Get('/personal_fm')
}

//最近播放
export function recentlyPlayed(type,limit = 300){
	return Get('/record/recent/'+type + '?limit=' + limit)
}

//专辑信息（评论数，收藏数，分享数）
export function albumInfo(id){
	return Get('/album/detail/dynamic?id=' + id)
}

//专辑内容
export function album(id){
	return Get('/album?id=' + id)
}

//数字专辑详情/album/detail?id=xxx
export function digitalAlbum(id){
	return Get('/album/detail?id=' + id)
}