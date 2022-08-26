<template>
	<view class="song-detail">
		<view class="filter" :style="{'background-image':`url(${songs.picUrl})`}"></view>
		<nav-bar :title="songs.name" class="nav"></nav-bar>
		<view class="detail-content">
			<image v-if="!isShowLyric" src="~@/static/images/song/needle.png" class="needle" :class="{'rotate-needle':playStatus}"></image>
			<view class="music">
				<view class="disc" v-if="!isShowLyric" @tap="showLyric">
					<image :src="songs.picUrl" class="song-pic" :class="playStatus?'rotate':'rotate paused'"></image>
				</view>
				<lyric class="lyric" v-if="isShowLyric" @closeLyric="closeLyric"></lyric>
				<detail-controller :key="controllerKey" class="control" @changePlayStatus="changePlayStatus"></detail-controller>
			</view>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
	</view>
</template>

<script>
	import DetailController from '@/components/DetailController/DetailController.vue'
	import Lyric from '@/components/Lyric/Lyric.vue'
	import { mapGetters } from 'vuex'
	import { lyric } from '@/common/api.js'
	
	export default {
		data() {
			return {
				isShowMusicList:false,
				controllerKey:0,
				isShowLyric:false
			}
		},
		components:{
			DetailController,
			Lyric
		},
		computed:{
			...mapGetters(['songs','playStatus','audio','songId']),
			
		},
		created() {
			
		},
		methods:{
			changePlayStatus(){
				this.playStatus?this.$audio.pause():this.$audio.play()
				this.$store.dispatch('changePlayStatus',!this.playStatus)
			},
			showLyric(){
				this.isShowLyric = true
			},
			closeLyric(){
				this.isShowLyric = false
			}
		},
		mounted() {
			//监听music-controller组件列表按钮发出的事件（显示播放列表）
			uni.$on('showList',()=>{
				this.isShowMusicList = true
			})
			
			//监听music-list组件关闭播放列表的事件，将己组件中控制列表显示的变量作出改变
			uni.$on('listCloseOver',()=>{
				this.isShowMusicList = false
				this.controllerKey++
			})
		}
	}
</script>

<style scoped>
	.song-detail{
		position: relative;
		width: 100%;
		height:100vh;
		background-color: rgba(0,0,0,.5);
		
	}
	.nav{
		position: relative;
		width: 100vw;
		height: 44px;
		
	}
	.detail-content{
		height: calc(100vh - 44px);
	}
	.filter{
		position: absolute;
		left: 0;
		top: 0;
		display: block;
		width: 100%;
		height: 100vh;
		filter: blur(50px);
		background-repeat: no-repeat;
		
	}
	.needle{
		position: relative;
		top:30px;
		left: 50%;
		width: 40%;
		height: 140px;
		transform-origin: 14px 14px;
		transition: transform 1s;
		z-index: 1000;
	}
	.rotate-needle{
		transform-origin: 14px 14px;
		transform: rotate(22deg);
	}
	.disc{
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin: 0 auto;
		width: 320px;
		height: 320px;
		text-align: center;
		background-size: contain;
	}
	/* #ifdef H5 */
	.disc{
		width: 280px;
		height: 280px;
		border-radius: 50%;
		background-color: #000000;
	}
	/* #endif */
	.song-pic{
		width: 70%;
		height: 70%;
		border-radius: 50%;
	}
	.rotate{
		animation: 10s rotateCircle linear infinite;
	}
	.paused{
		animation-play-state: paused;	
	}
	.control{
		position: absolute;
		bottom: 50px;
		width: 100%;
		z-index: 1000;
	}
	.lyric{
		position: relative;
		width: 100%;
		height:63vh;
	}
	@keyframes rotateCircle{
		from{
			
			transform: rotate(0deg);
		}
		to{
			
			transform: rotate(360deg);
		}
	}
	/* #ifdef MP-WEIXIN */
	.nav{
		height: 60px;
	}
	.detail-content{
		height: calc(100vh - 60px);
	}
	.needle{
		width: 30%;
		height: 100px;
	}
	.disc{
		width: 240px;
		height: 240px;
		background-color: #000000;
		border-radius: 50%;
	}
	.control{
		bottom: 0;
	}
	/* #endif */
</style>
