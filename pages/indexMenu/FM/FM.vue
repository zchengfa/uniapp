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
		<detail-controller @nextFM="nextFM" :key="controllerKey" class="control" @changePlayStatus="changePlayStatus"></detail-controller>
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
				bg:'',
				controllerKey:0,
			}
		},
		components:{
			DetailController
		},
		computed:{
			...mapGetters(['songs','playStatus','musicList','currentSongIndex'])
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
				this.playStatus?this.$audio.pause():this.$audio.play()
				this.$store.dispatch('changePlayStatus',!this.playStatus)
			},
			nextFM(){
				this.nextSong()
				 console.log('下一首fm歌曲')
			},
			nextSong(){
				let index = this.currentSongIndex
				
				index =+ 1
				
				if(index >= this.musicList.length){
					this.fm()
					this.$songSave(this.musicList[index].id).then(res=>{
						this.$store.dispatch('index',0)
					})
				}
				
				this.$songSave(this.musicList[index].id).then()
			},
			
			fm(){
				personalFm().then(res=>{
					if(res.code === 200){
						this.$store.dispatch('musicList',JSON.stringify(res.data))
						this.bg = this.musicList[this.currentSongIndex].album.blurPicUrl
						
						//获取列表第一首歌进行播放
						this.$songSave(this.musicList[0].id).then(res=>{
							this.$store.dispatch('index',0)
						})
					}
				})
			}
		},
		created() {
			this.fm()
			
			//向vuex分发事件，开启fm
			this.$store.dispatch('fmStatus',true)
		}
	}
</script>

<style scoped lang="scss">
.FM{
	position: relative;
	max-width: 500px;
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
				margin-top: 15px;
				color: #fff;
			}
			.author{
				margin-top: 10px;
				color: #bebebe;
				font-size: 13px;
			}
			
		}
		
	}
	.filter{
		filter: blur(10px);
	}
	.FM-image{
		width: 300px;
		height: 300px;
		border-radius: 6px;
	}
}
</style>
