import { mapGetters } from 'vuex'
const bottomControlMixin = {
	data(){
		return {
			isShowBottomControl:true,
			scrollHeight:undefined,
			isShowMusicList:false,
			scrollHeightNoTop:undefined,
			scrollHeightSwiper:undefined,
			scrollHeightNoTab:undefined
		}
	},
	computed:{
		...mapGetters(['musicList'])
	},
	watch:{
		musicList(n,o){
			if(n.length === 0){
				this.isShowBottomControl = false
			}
		}
	},
	methods:{
		changeStyle(){
			this.isShowBottomControl = Boolean(this.musicList.length)
			
			if(Boolean(this.musicList.length)){
				this.scrollHeight = 'height:calc(100vh - 150px);'
				this.scrollHeightNoTop = 'height:calc(100vh - 50px);'
				this.scrollHeightNoTab = 'height:calc(100vh - 100px);'
				this.scrollHeightSwiper = 'height:calc(100vh - 145px);'
				// #ifdef MP-WEIXIN
				this.scrollHeight = 'height:calc(100vh - 130px);'
				this.scrollHeightNoTop = 'height:calc(100vh - 50px);'
				this.scrollHeightSwiper = 'height:calc(100vh - 175px);'
				this.scrollHeightNoTab = 'height:calc(100vh - 130px);'
				// #endif
				
			}
		}
	},
	created(){
		this.changeStyle()
	},
	mounted() {
		
	  this.changeStyle()
		
		//监听music-controller组件列表按钮发出的事件（显示播放列表）
		uni.$on('showList',()=>{
			this.isShowMusicList = true
		})
		
		//监听music-list组件关闭播放列表的事件，将己组件中控制列表显示的变量作出改变
		uni.$on('listCloseOver',()=>{
			this.isShowMusicList = false
		})

	},
	// #ifdef MP-WEIXIN
	//解决在小程序不触发activated生命周期的问题
	onShow(){
		this.changeStyle()
	},
	// #endif
	// #ifdef H5
	activated() {
		
		this.changeStyle()
	},
	// #endif
}

const changeLoopMixin = {
	data(){
		return {
			way:uni.getStorageSync('loop_status'),
			count:uni.getStorageSync('loopCount'),
			loop:uni.getStorageSync('loop'),
		}
	},
	methods:{
		changeLoop(){
			
			this.count ++
			switch(this.count){
				case 0:
					this.loop = 'controller-list_loop';
					this.way = 'll'
					break;
				case 1:
					this.loop = 'controller-single_loop';
					this.way = 'sl'
					break;
				case 2:
					this.loop = 'controller-random';
					this.count = -1;
					this.way = 'rl'
					break;
			}
			this.$store.dispatch('changeLoopWay',JSON.stringify({
				'loop':this.loop,
				'loopStatus':this.way,
				'loopCount':this.count
			}))
		},
	}
}
import { summarySearch } from '@/common/api.js'
const searchScrollMixin = {
	props:{
		data:{
			type:Object,
			default(){
				return {}
			}
		},
		type:{
			type:Number,
			default(){
				return 0
			}
		},
		word:{
			type:String,
			default(){
				return ''
			}
		},
		count:{
			type:Number,
			default(){
				return 0
			}
		},
		prop:{
			type:String,
			default(){
				return ''
			}
		}
	},
	data(){
		return {
			offset:0
		}
	},
	methods:{
		loadMore(){
			
			if(this.$props.data.hasMore || this.$props.count > this.$props.data[this.$props.prop].length){
				uni.showLoading({
					title:'加载更多...'
				})
				this.offset +=15
				summarySearch(this.$props.word,this.$props.type,this.offset).then(res=>{
					if(res.code === 200){
						this.$emit('more',{'type':this.$props.type,'data':res.result})
						uni.hideLoading()
					}
					
				})
				
			}
		}
	}
}

import { songData } from '@/common/api.js'
const playSongMixin = {
	data(){
		return {
			idList:[]
		}
	},
	methods:{
	async	playSongNoCoverPlayList(song){
			//碰到是歌曲时，获取播放列表播放的歌曲在列表中的位置，将当前点击的歌曲放置其后面
			let playList = this.$store.state.music.musicList
			let currentSongIndex = this.$store.state.music.currentSongIndex
			//获取点击的歌曲信息
			let songs = {
				'author':this.$dealAuthor(song.ar,'name'),
				'name':song.name,
				'picUrl':song.al.picUrl
			}
			let songId = song.id
			if(playList){
				//先判断列表中是否含有该首歌，有则无需再加入列表
				let difCount = 0
				playList.map(list=>{
					if(list.id !== songId){
						difCount ++
					}	
				})
				difCount === playList.length?playList.splice(currentSongIndex+1,0,song):null
			}
			else{
				playList = []
				playList.push(song)
			}
			let url = ''
			await	songData(song.id).then(res=>{
				if(res.code === 200){
					url = res.data[0].url
					//向vuex分发事件，修改歌曲以及播放列表数据
					this.$store.dispatch('songs',JSON.stringify(songs))
					this.$store.dispatch('audio',url)
					this.$store.dispatch('musicList',JSON.stringify(playList))
					this.$store.dispatch('id',songId)
					this.$store.dispatch('index',Number(currentSongIndex) + 1)
				}
			})
							
			uni.navigateTo({
				url:'../songDetail/songDetail'
			})
		},
		//保存播放列表
		savePlayList(){
			
			this.$store.dispatch('musicList',JSON.stringify(this.getPlayListData()))
			
		},
		//点击歌曲进行播放
		playSong(id,index = undefined,detailPath){
			let listLength = this.$store.state.music.musicList.length
			let musicList = this.$store.state.music.musicList
			 
			//关闭私人FM模式
			this.$store.dispatch('fmStatus',false)
			
			if(!index){
				this.idList.map((item,listIndex)=>{
					 
					if(Number(item.id) === id){
						index = listIndex	
					}
				})
			}
			this.$songSave(id).then(res=>{
				this.$store.dispatch('index',index)
			})
			
			//判断vuex中是否保存过列表数据
			if(listLength && index){
				//判断点击的音乐是否存在之前保存过的列表里，不存在说明是新列表，保存新列表
				
				if(id !== musicList[index].id){
					this.savePlayList()
				}
			}
			//未保存过，直接保存
			else{
				this.savePlayList()
			}
			
			//先判断播放控件播放的音乐是否是当前点击的歌曲，若不是则换成点击的歌曲播放，若一致直接跳转到详情页进行播放
			let songId = this.$store.state.music.songId
			if(id === songId){
				//一致，跳转至歌曲详情页
				uni.navigateTo({
					url:detailPath
				})
			}
			else{
				this.$songSave(id).then(res=>{
					if(res){
						this.isShowBottomControl = true
					}
				})
			}
		}
	}
}

//登录和注册页面键盘弹出和收起做出相应操作的混入
const keyboardMixins = {
	data(){
		return {
			isShowOtherLogin:true,
			originHeight:undefined,
		}
	},
	methods:{
		blur(e,target){
			target.onFieldChange(e.detail.value)
		},
		handleResize(){
			// #ifdef H5
			let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
			//软键盘弹出，隐藏第三方登录组件
			resizeHeight < this.originHeight ? this.isShowOtherLogin = false : this.isShowOtherLogin = true
			// #endif
			
		}
	},
	mounted() {
		// #ifdef H5
		this.originHeight = document.documentElement.clientHeight || document.body.clientHeight
		window.addEventListener('resize',this.handleResize)
		// #endif
	}
}


module.exports = {
	bottomControlMixin,
	changeLoopMixin,
	searchScrollMixin,
	playSongMixin,
	keyboardMixins
}