<template>
	<view class="FM">
		<view class="filter" :style="{'background-image':`url(${bg})`}"></view>
		<nav-bar title="私人FM"></nav-bar>
		<view class="fm-content"  @touchstart="touchS($event)" @touchend="touchE($event)">
			<view class="song-info">
				<image :src="bg" mode="aspectFit" class="FM-image"></image>
				<text class="song-name">{{songs.name}}</text>
				<text class="author">{{songs.author}}</text>
			</view>
		</view>
		<detail-controller :key="controllerKey" class="control" @changePlayStatus="changePlayStatus"></detail-controller>
	</view>
</template>

<script>
	import { personalFm } from '@/common/api.js'
	import DetailController from '@/components/DetailController/DetailController.vue'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				touchStartX:0,
				touchEndX:0,
				fmList:[],
				bg:'',
				controllerKey:0,
			}
		},
		components:{
			DetailController
		},
		computed:{
			...mapGetters(['songs'])
		},
		methods: {
			touchS(e){
				this.touchStartX = Math.floor(e.changedTouches[0].pageX)
				
			},
			touchE(e){
				this.touchEndX = Math.floor(e.changedTouches[0].pageX)
				
				if(this.touchEndX - this.touchStartX >= 30){
					console.log('用户在向右滑动')
				}
				else if(this.touchEndX - this.touchStartX <= -30){
					console.log('用户在向左滑动')
				}
				
			},
			changePlayStatus(){
				// this.playStatus?this.$audio.pause():this.$audio.play()
				// this.$store.dispatch('changePlayStatus',!this.playStatus)
			},
			fm(){
				personalFm().then(res=>{
					if(res.code === 200){
						this.fmList.push(...res.data)
						this.bg = this.fmList[0].album.blurPicUrl
					}
				})
			}
		},
		created() {
			this.fm()
		}
	}
</script>

<style scoped lang="scss">
.FM{
	width: 100vw;
	height: 100vh;
	.fm-content{
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 70%;
		z-index: 999;
		.song-info{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.song-name{
				color: #fff;
			}
			.author{
				color: #bebebe;
			}
		}
		
	}
	.filter{
		filter: blur(10px);
	}
	.FM-image{
		width: 300px;
		height: 300px;
	}
}
</style>
