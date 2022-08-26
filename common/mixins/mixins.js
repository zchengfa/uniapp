const bottomControlMixin = {
	data(){
		return {
			isShowBottomControl:true,
			scrollHeight:undefined
		}
	},
	mounted() {
		
		this.isShowBottomControl = Boolean(this.$store.state.music.audio)	
		
		if(!this.$store.state.music.audio){
			this.scrollHeight = 'calc(100% - 100px)'
		}

	},
	activated() {
		
		if(!this.$store.state.music.audio){
			this.scrollHeight = 'calc(100% - 100px)'
		}
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