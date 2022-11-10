<template>
	<view class="FM">
		<view class="filter" :style="{'background-image':`url(${songs.picUrl})`}"></view>
		<view class="filter cover" ></view>
		<nav-bar title="私人FM"></nav-bar>
		<view class="fm-content"  @touchstart="touchS($event)" @touchend="touchE($event)">
			<view class="song-info"  v-if="!isShowLyric" @tap="showLyric">
				<image :src="songs.picUrl" mode="aspectFit" class="FM-image"></image>
				<text class="song-name">{{songs.name}}</text>
				<text class="author">{{songs.author}}</text>
			</view>
			<lyric class="lyric" v-show="isShowLyric" @closeLyric="closeLyric"></lyric>
		</view>
		<detail-controller @nextFM="nextFM" :key="controllerKey" class="control" @changePlayStatus="changePlayStatus"></detail-controller>
	</view>
</template>

<script>
	import { personalFm } from '@/common/api.js'
	import DetailController from '@/components/DetailController/DetailController.vue'
	import Lyric from '@/components/Lyric/Lyric.vue'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				touchStartX:0,
				touchEndX:0,
				isShowLyric:false,
				controllerKey:0,
			}
		},
		components:{
			DetailController,
			Lyric
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
					
					this.nextFM()
				}
				
			},
			changePlayStatus(){
				this.playStatus?this.$audio.pause():this.$audio.play()
				this.$store.dispatch('changePlayStatus',!this.playStatus)
			},
			nextFM(){
				let index = this.currentSongIndex
				++ index 
				
				if(index >= this.musicList.length){
					this.fm()
				}
				else{
					this.$songSave(this.musicList[index].id).then(res=>{
						if(res){
							this.$store.dispatch('index',index)
						}
					})
				}
			
			},
			showLyric(){
				this.isShowLyric = true
			},
			closeLyric(){
				this.isShowLyric = false
			},
			fm(){
				personalFm().then(res=>{
					console.log(res)
					if(res.code === 200){
						this.$store.dispatch('musicList',JSON.stringify(res.data))
						
						
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
	.lyric{
		position: relative;
		width: 100%;
		height:100%;
	}
}
</style>
