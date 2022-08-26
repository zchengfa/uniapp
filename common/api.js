const baseUrl = "https://www.codeman.ink/api"
//const baseUrl = 'http://192.168.31.130:4000'

function Get(URL){
	return new Promise((resolve)=>{
		uni.request({
			url:baseUrl+URL,
			method:'GET',
			success:(res)=>{
				resolve(res.data)
			}
		})
	})
}

export function topList  (){
	return new Promise(resolve=>{
		Get(`${baseUrl}/toplist/detail`).then(res=>{
			 let result = res.list
			 resolve(result)
		})
		
	})
}

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


//首页滚动菜单
export function indexScrollMenu(){
	return Get(`/homepage/dragon/ball`)
}

//首页推荐歌单
export function indexSongSheet(){
	return Get(`/personalized`)
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


//  获取歌曲评论(新的评论接口)
// /comment/new?type=0&id=1407551413&sortType=3&cursor=1602072870260&pageSize=20&pageNo=2
//id : 资源 id, 如歌曲 id,mv id

// type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型

// 0: 歌曲

// 1: mv

// 2: 歌单

// 3: 专辑

// 4: 电台

// 5: 视频

// 6: 动态
// 可选参数 :
// pageNo:分页参数,第 N 页,默认为 1

// pageSize:分页参数,每页多少条数据,默认 20

// sortType: 排序方式, 1:按推荐排序, 2:按热度排序, 3:按时间排序

// cursor: 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
export function comments(id,sortType = 3) {
	return Get(`/comment/new?type=0&id=${id}&sortType=${sortType}`)
	
}


//歌曲评论（旧的评论接口）（用于在歌曲详情页获取评论总数）
export function commentsTotalNum (id){
	return Get(`/comment/music?id=${id}&limit=1&offset=1`)
}

//获取更多评论
export function moreCommentsByTime(id,sortType,cursor,pageSize,pageNo) {
	return Get(`/comment/new?type=0&id=${id}&sortType=${sortType}&cursor=${cursor}&pageSize=${pageSize}&pageNo=${pageNo}`)
}


export function moreCommentsByOtherType(id,sortType,pageSize,pageNo) {
	return Get(`/comment/new?type=0&id=${id}&sortType=${sortType}&pageSize=${pageSize}&pageNo=${pageNo}`)
}
//获取评论回复数据
export function commentsReply(songId,commentId){
	return Get(`/comment/floor?parentCommentId=${commentId}&id=${songId}&type=0`)
}