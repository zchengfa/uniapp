import App from './App'
import MusicController from 'components/MusicController/MusicController.vue'
import TopBar from '@/components/TopBar/TopBar.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import { dealCount , dealAuthor , throttle , level, timeFormatting ,transTime} from '@/utils/utils.js'
import { songExceptLyric , lyric} from '@/common/api.js'
import MusicList from '@/components/MusicList/MusicList.vue'
import store from './store'
// import audio from 'common/audio.js'

import personalModal from '@/components/PersonalModal/modal.js'

// #ifndef VUE3
import Vue from 'vue'


//引入uview-ui，需在vue之后引入
import uview from 'uview-ui'

Vue.use(uview)

Vue.use(personalModal)

Vue.config.productionTip = false
Vue.component('MusicController',MusicController)
Vue.component('TopBar',TopBar)
Vue.component('MusicList',MusicList)
Vue.component('NavBar',NavBar)

Vue.prototype.$dealCount = dealCount
Vue.prototype.$dealAuthor = dealAuthor
Vue.prototype.$song = songExceptLyric
Vue.prototype.$level = level
Vue.prototype.$timeFormate = timeFormatting
Vue.prototype.$transTime = transTime

function save(res){
	if(res.url){
		let songs = {
			'name':res.detail.name,
			'picUrl':res.detail.al.picUrl,
			'author':dealAuthor(res.detail.ar,'name')
		}
		store.dispatch('songs',JSON.stringify(songs))
		store.dispatch('id',res.detail.id)
		store.dispatch('audio',res.url)
		
		return true
	}
	else{
		uni.showModal({
			title:'歌曲提醒：',
			content:'当前歌曲音频出现错误，无法播放！',
			confirmText:'好吧',
			cancelText:'太遗憾了',
			cancelColor:'red'
		})
		
		return false
	}
	
}


Vue.prototype.$songSave = async function songSave (id){
	return new Promise((resolve,reject)=>{
		songExceptLyric(id).then(res=>{
			
			save(res)?resolve(true):reject(false)
			
		})
		
	})
	
}

function getLyric(id){
	
	//获取歌词
	lyric(id).then(res=>{
	
		if(res.lrc.lyric){
			let result = []
			let arr = res.lrc.lyric.split('\n')
			
			arr.forEach((item,index)=>{
				
				let time = item.split(']')[0]
				let value = item.split(']')[1]
				
				//将时间转换成秒，精确到毫秒
				let newTime = time.substr(1,time.length -1)
				let m = Number(newTime.substring(0,newTime.indexOf(':')))*60
				let s = Number(newTime.substring(newTime.indexOf(':')+1,newTime.indexOf('.')))
				let ms = newTime.substring(newTime.indexOf('.'),newTime.length)
				let realTime = Number(m + s + ms)
							
				result.push({
					'time':realTime,
					'lyric':value,
					'lyricIndex':'t'+ index
				})
				
				store.dispatch('lyric',JSON.stringify(result))
			})
		}
	})
}


Vue.prototype.$lyric = getLyric

Vue.prototype.$store = store

let audioContext = uni.createInnerAudioContext() || uni.getBackgroundAudioManager()


audioContext.autoplay = true
// audioContext.volume = (store.state.music.volume)/100

if(store.state.music.audio){
	audioContext.src = store.state.music.audio
	if(store.state.music.palyStatus){
		audioContext.play()
	}
	else{
		audioContext.pause()
	}
}

audioContext.onCanplay(()=>{
	//从对应歌曲数据中获取歌曲总时间，从audio对象中获取可播放时间
	let songId = store.state.music.songId
	let musicList = store.state.music.musicList
	musicList.map(item=>{
		if(item.id === songId){
			item.hasOwnProperty('dt') ? store.dispatch('totalTime',(item.dt)/1000) : store.dispatch('totalTime',(item.duration)/1000)
		}
	})
	store.dispatch('duration',audioContext.duration)
	
	let totalTime = store.state.music.totalTime
	let duration = store.state.music.duration
	totalTime - duration >= 100 && duration !== 0 ? store.dispatch('audition',true) : store.dispatch('audition',false)
	//音乐在可播放时就获取歌词数据
	if(!store.state.music.lyric.length){
		getLyric(store.state.music.songId)
	}
	
})

audioContext.onTimeUpdate(()=>{

	store.dispatch('currentTime',audioContext.currentTime)
	let time = audioContext.currentTime
	let lyric = store.state.music.lyric
	let index = store.state.music.lyricIndex
	
	if(lyric[index]){
		if(time >= lyric[index].time){
			//向vuex分发事件（让歌词滚动组件的滚动索引-8）
			store.dispatch('reduceIntoIndex',8)
		}
	} 
	
	let totalWidth = store.state.music.totalWidth
	let totalTime = store.state.music.totalTime
	let percent = time/totalTime
	let seekStatus = store.state.music.isSeeking
	// store.dispatch('changeProAndDotStyle',JSON.stringify({
	// 	'progress':'width:' + totalWidth*percent +'px',
	// 	'dot':'left:' + totalWidth*percent +'px'
	// }))
	
	//改变进度条的值之前需判断进度条是否还在被拖动状态，若是在拖动状态就不随着音乐进度改变，只有在进度条脱离拖动状态下改变
	if(!seekStatus){
		//结束拖动，修改进度条的值
		store.dispatch('progress',percent*100)
		for (var i = 0; i < lyric.length; i++) {
			if(i < lyric.length -1){
				if(time > lyric[i]['time'] && time < lyric[i + 1]['time']){
					store.dispatch('addLyricIndex', i + 1)
					
				}
				
			}
		}
		  
		
	}
	
})

audioContext.onPlay(()=>{
	store.dispatch('changePlayStatus',true)
	
})

audioContext.onPause(()=>{
	store.dispatch('changePlayStatus',false)
})

audioContext.onEnded(()=>{
	//console.log('音乐自然播放到结束')
	nextSong()
	//audioContext.src = list[index]
})

function nextSong(){
	//判断用户当前选择的歌曲循环方式，通过循环方式来决定是按照列表顺序循环，还是单曲循环，亦或是列表随机播放
	let way = store.state.music.loopStatus
	let songId = store.state.music.songId
	let list = store.state.music.musicList
	let index = store.state.music.currentSongIndex
	
	audioContext.src = ''
	//列表循环
	if(way === 'll'){
		index +=1 
		if(index >= list.length){
			index = 0
		}
	}
	//列表随机
	else if(way === 'rl'){
		index = Math.floor(Math.random()*list.length)
	}
	//单曲循环
	else if(way === 'sl'){
		index = index
	}
	
	songExceptLyric(Number(list[index].id)).then(res=>{
		save(res)
		store.dispatch('index',index)
		if(!save(res)){
			nextSong()
		}
	})
}

Vue.prototype.$audio = audioContext

//判断vuex中是否有token，有则表示用户已登录
function checkLogin(){
	let token = store.state.user.token
	
	return !!token
}
Vue.prototype.$checkLogin = checkLogin

App.mpType = 'app'
const app = new Vue({
    ...App,
		store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif