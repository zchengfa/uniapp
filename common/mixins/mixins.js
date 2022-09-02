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
	methods:{
		changeStyle(){
			this.isShowBottomControl = Boolean(this.$store.state.music.audio)
			
			if(Boolean(this.$store.state.music.audio)){
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
	activated() {
		
		this.changeStyle()
	},
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
			this.$store.dispatch('changeLoopWay',{
				'loop':this.loop,
				'loopStatus':this.way,
				'loopCount':this.count
			})
		},
	}
}
import { summarySearch } from '@/common/api.js'
const serachScrollMixin = {
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
			pageSize:1
		}
	},
	methods:{
		loadMore(){
			
			if(this.$props.data.hasMore || this.$props.count > this.$props.data[this.$props.prop].length){
				uni.showLoading({
					title:'加载更多...'
				})
				this.pageSize ++
				summarySearch(this.$props.word,this.$props.type,this.pageSize).then(res=>{
					if(res.code === 200){
						this.$emit('more',{'type':this.$props.type,'data':res.result})
						uni.hideLoading()
					}
					
				})
				
			}
		}
	}
}


const playSongMixin = {
	data(){
		return {
			idList:[]
		}
	},
	methods:{
		//保存播放列表
		savePlayList(){
			
			this.$store.dispatch('musicList',JSON.stringify(this.getPlayListData()))
			
		},
		//点击歌曲进行播放
		playSong(id){
			let listLength = this.$store.state.music.musicList.length
			let musicList = this.$store.state.music.musicList
			let index = undefined 
			
			this.idList.map((item,listIndex)=>{
				 
				if(Number(item.id) === id){
					index = listIndex
					this.$store.dispatch('index',index)
					
				}
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
					url:'../songDetail/songDetail'
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

module.exports = {
	bottomControlMixin,
	changeLoopMixin,
	serachScrollMixin,
	playSongMixin
}