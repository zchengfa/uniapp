import App from './App'
import MusicController from 'components/MusicController/MusicController.vue'
import TopBar from '@/components/TopBar/TopBar.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import { dealCount , dealAuthor , throttle , level} from '@/utils/utils.js'
import { songExceptLyric , lyric} from '@/common/api.js'
import MusicList from '@/components/MusicList/MusicList.vue'
import store from './store'
// import audio from 'common/audio.js'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.component('MusicController',MusicController)
Vue.component('TopBar',TopBar)
Vue.component('MusicList',MusicList)
Vue.component('NavBar',NavBar)

Vue.prototype.$dealCount = dealCount
Vue.prototype.$dealAuthor = dealAuthor
Vue.prototype.$song = songExceptLyric
Vue.prototype.$level = level

function save(res){
	
	let songs = {
		'name':res.detail.name,
		'picUrl':res.detail.al.picUrl,
		'author':dealAuthor(res.detail.ar,'name')
	}
	store.dispatch('songs',JSON.stringify(songs))
	store.dispatch('id',res.detail.id)
	store.dispatch('audio',res.url)
}

Vue.prototype.$songSave = async function songSave (id){
	return new Promise(resolve=>{
		songExceptLyric(id).then(res=>{
			
			save(res)
			resolve(true)
			
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
	store.dispatch('totalTime',audioContext.duration)
	
	//音乐在可播放时就获取歌词数据
	getLyric(store.state.music.songId)
})

audioContext.onTimeUpdate(()=>{

	store.dispatch('currentTime',audioContext.currentTime)
	let time = audioContext.currentTime
	let lyric = store.state.music.lyric
	let index = store.state.music.lyricIndex
	
	if(lyric[index]){
		if(time >= lyric[index].time){
			//向vuex分发事件（歌词索引加一）
			store.dispatch('addLyricIndex',1)
			
			//向vuex分发事件（让歌词滚动组件的滚动索引-8）
			store.dispatch('reduceIntoIndex',8)
		}
	}
	
	let totalWidth = store.state.music.totalWidth
	let totalTime = audioContext.duration
	let percent = time/totalTime
	store.dispatch('changeProAndDotStyle',JSON.stringify({
		'progress':'width:' + totalWidth*percent +'px',
		'dot':'left:' + totalWidth*percent +'px'
	}))
	
})

audioContext.onPlay(()=>{
	store.dispatch('changePlayStatus',true)
	
})

audioContext.onPause(()=>{
	store.dispatch('changePlayStatus',false)
})

audioContext.onEnded(()=>{
	console.log('音乐自然播放到结束')
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
	
	songExceptLyric(Number(list[index].resourceId)).then(res=>{
		save(res)
		store.dispatch('index',index)
	})
	//audioContext.src = list[index]
})

Vue.prototype.$audio = audioContext

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