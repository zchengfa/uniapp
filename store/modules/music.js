export default {
	state:{
		//音频地址
		audio:uni.getStorageSync('audio'),
		//当前音频是否为试听版
		audition:uni.getStorageSync('audition'),
		//音频可播放时长
		duration:uni.getStorageSync('duration'),
		//音频循环方式
		loopStatus:uni.getStorageSync('loop_status'),
		//音频播放状态（true播放中、false暂停中）
		playStatus:0,
		//音频开始时间
		startTime:uni.getStorageSync('startTime'),
		//音频总时长
		totalTime:uni.getStorageSync('totalTime'),
		//当前音频的播放进度
		currentTime:uni.getStorageSync('currentTime'),
		//歌单id
		songSheetId:undefined,
		//播放列表
		musicList:uni.getStorageSync('musicList'),
		//音频信息
		songs:uni.getStorageSync('songs'),
		//音频id
		songId:uni.getStorageSync('songId'),
		//播放的歌曲在列表中的位置
		currentSongIndex:uni.getStorageSync('currentIndex'),
		//循环类名
		loop:uni.getStorageSync('loop'),
		//循环按钮的点击次数
		loopCount:uni.getStorageSync('loopCount'),
		//要滚动的那一行歌词
		intoIndex:'',
		//当前歌曲的歌词
		lyric:[],
		//歌曲当前时间对应的歌词的索引
		lyricIndex:0,
		// //当前进度条宽度
		// progressWidth:'',
		// //进度条总宽度
		// totalWidth:'',
		// //进度条圆点位置
		// dotLocation:'',
		//进度条的值
		progress:0,
		//是否在拖动中
		isSeeking:false,
		//是否私人FM模式
		fmStatus:uni.getStorageSync('FM_status'),
		//音量值
		volume:uni.getStorageSync('volume')
	},
	getters:{
		songs(state){
			return state.songs
		},
		audition(state){
			return state.audition
		},
		duration(state){
			return state.duration
		},
		currentTime(state){
			return state.currentTime
		},
		totalTime(state){
			return state.totalTime
		},
		playStatus(state){
			return state.playStatus
		},
		audio(state){
			return state.audio
		},
		loopStatus(state){
			return state.loopStatus
		},
		musicList(state){
			return state.musicList
		},
		songId(state){
			return state.songId
		},
		currentSongIndex(state){
			return state.currentSongIndex
		},
		loop(state){
			return state.loop
		},
		loopCount(state){
			return state.loopCount
		},
		lyric(state){
			return state.lyric
		},
		lyricIndex(state){
			return state.lyricIndex
		},
		intoIndex(state){
			return state.intoIndex
		},
		// progressWidth(state){
		// 	return state.progressWidth
		// },
		// dotLocation(state){
		// 	return state.dotLocation
		// },
		progress(state){
			return state.progress
		},
		fmStatus(state){
			return state.fmStatus
		},
		volume(state){
			return state.volume
		}
	},
	mutations:{
		loopWay(state,payload){
			let loop = JSON.parse(payload)
			state.loopStatus = loop.loopStatus
			state.loop = loop.loop
			state.loopCount = loop.loopCount
			
			uni.setStorageSync('loop_status',loop.loopStatus)
			uni.setStorageSync('loopCount',loop.loopCount)
			uni.setStorageSync('loop',loop.loop)
			
		},
		playStatus(state,playStatus){
			let status = Number(playStatus)
			state.playStatus = status
		},
		ids(state,ids){
			
			state.songIds = JSON.parse(ids)
			uni.setStorageSync('songIds',ids)
		},
		id(state,id){
			state.songId = id
			uni.setStorageSync('songId',id)
		},
		songs(state,songsData) {
			let songData = JSON.parse(songsData)
			state.songs = songData
			uni.setStorageSync('songs',songData)
		},
		audio(state,src){
			state.audio = src
			uni.setStorageSync('audio',src)
		},
		audition(state,payload){
			state.audition = payload
			uni.setStorageSync('audition',payload)
		},
		duration(state,payload){
			state.duration = payload
			uni.setStorageSync('duration',payload)
		},
		totalTime(state,totalTimes){
			state.totalTime = totalTimes
			uni.setStorageSync('totalTime',totalTimes)
		},
		currentTime(state,currentTimes){
			state.currentTime = currentTimes
			uni.setStorageSync('currentTime',currentTimes)
		},
		saveStartTime(state,startTimes){
			state.startTime = startTimes
			uni.setStorageSync('startTime',startTimes)
		},
		musicList(state,list){
			
			state.musicList = JSON.parse(list)
			uni.setStorageSync('musicList',JSON.parse(list))
		},
		index(state,index){
			state.currentSongIndex = index
			uni.setStorageSync('currentIndex',index)
			
		},
		lyric(state,payload){
			state.lyric = JSON.parse(payload)
		},
		addLyricIndex(state,payload){
			state.lyricIndex = payload
		},
		reduceIntoIndex(state,payload){
			state.intoIndex = 't'+ (state.lyricIndex - payload)
		},
		resetLyric(state,payload){
			state.intoIndex = 't-8'
			state.lyricIndex = 0
		},
		// progressTotalWidth(state,payload){
		// 	state.totalWidth = payload
		// },
		// changeProAndDotStyle(state,payload){
		// 	state.progressWidth = JSON.parse(payload).progress
		// 	state.dotLocation = JSON.parse(payload).dot
		// },
		progress(state,payload){
			state.progress = payload
		},
		seekStatus(state,payload){
			state.isSeeking = payload
		},
		fmStatus(state,payload){
			state.fmStatus = payload
			uni.setStorageSync('FM_status',payload)
		},
		changeVolume(state,payload){
			state.volume = payload
			uni.setStorageSync('volume',payload)
		}
	},
	actions:{
		//更改歌曲循环方式
		changeLoopWay(context,payload){
			context.commit('loopWay',payload)
		},
		//更改歌曲播放状态（播放或暂停）
		changePlayStatus(context,payload){
			context.commit('playStatus',payload)
		},
		//当前列表中的索取歌曲id
		songIds(context,payload){
			
			context.commit('ids',payload)
		},
		//当前播放的歌曲数据
		songs(context,payload){
			context.commit('songs',payload)
		},
		audio(context,payload){
			context.commit('audio',payload)
		},
		audition(context,payload){
			context.commit('audition',payload)
		},
		duration(context,payload){
			context.commit('duration',payload)
		},
		totalTime(context,payload){
			context.commit('totalTime',payload)
		},
		currentTime(context,payload){
			context.commit('currentTime',payload)
		},
		saveStartTime(context,payload){
			context.commit('saveStartTime',payload)
		},
		id(context,payload){
			context.commit('id',payload)
		},
		musicList(context,payload){
			context.commit('musicList',payload)
		},
		index(context,payload){
			context.commit('index',payload)
		},
		lyric(context,payload){
			context.commit('lyric',payload)
		},
		addLyricIndex(context,payload){
			context.commit('addLyricIndex',payload)
		},
		reduceIntoIndex(context,payload){
			context.commit('reduceIntoIndex',payload)
		},
		resetLyric(context,payload){
			context.commit('resetLyric',payload)
		},
		// progressTotalWidth(context,payload){
		// 	context.commit('progressTotalWidth',payload)
		// },
		// changeProAndDotStyle(context,payload){
		// 	context.commit('changeProAndDotStyle',payload)
		// },
		progress(context,payload){
			context.commit('progress',payload)
		},
		seekStatus(context,payload){
			context.commit('seekStatus',payload)
		},
		fmStatus(context,payload){
			context.commit('fmStatus',payload)
		},
		changeVolume(context,payload){
			context.commit('changeVolume',payload)
		}
	}
	
}