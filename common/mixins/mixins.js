const bottomControlMixin = {
	data(){
		return {
			isShowBottomControl:true,
			scrollHeight:undefined,
			isShowMusicList:false
		}
	},
	methods:{
		changeStyle(){
			this.isShowBottomControl = Boolean(this.$store.state.music.audio)
			
			if(Boolean(this.$store.state.music.audio)){
				this.scrollHeight = 'height:calc(100vh - 150px);'
				// #ifdef MP-WEIXIN
				this.scrollHeight = 'height:calc(100vh - 130px);'
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

module.exports = {
	bottomControlMixin,
	changeLoopMixin
}