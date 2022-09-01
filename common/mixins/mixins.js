const bottomControlMixin = {
	data(){
		return {
			isShowBottomControl:true,
			scrollHeight:undefined,
			isShowMusicList:false,
			scrollHeightT:undefined,
			scrollHeightTh:undefined
		}
	},
	methods:{
		changeStyle(){
			this.isShowBottomControl = Boolean(this.$store.state.music.audio)
			
			if(Boolean(this.$store.state.music.audio)){
				this.scrollHeight = 'height:calc(100vh - 150px);'
				this.scrollHeightT = 'height:calc(100vh - 100px);'
				this.scrollHeightTh = 'height:calc(100vh - 100px);'
				// #ifdef MP-WEIXIN
				this.scrollHeight = 'height:calc(100vh - 130px);'
				this.scrollHeightT = 'height:calc(100vh - 130px);'
				this.scrollHeightTh = 'height:calc(100vh - 175px);'
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

module.exports = {
	bottomControlMixin,
	changeLoopMixin,
	serachScrollMixin
}