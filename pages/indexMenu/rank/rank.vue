<template>
	<view class="rank-content">
		<view class="rank-nav">
			<nav-bar class="rank-nav-bar">
				<text slot="right"></text>
			</nav-bar>
		</view>
		<scroll-view scroll-y="true" class="scroll" :style="scrollHeightNoTab">
			<view class="author" v-if="rankAuthor.length">
				<text class="rank-title">官方榜</text>
				<view class="rank-item" v-for="(item,index) in rankAuthor" :key="item.id">
					<view class="item-top">
						<text class="rank-name">{{item.name}}</text>
						<text class="update-frequency">{{item.updateFrequency}}</text>
					</view>
					<view class="item-bottom">
						<view class="image-box" @tap="beginPlay(item.id)">
							<text class="iconfont musicplay" v-show="playingId !== item.id"></text>
							<Playing class="playing" v-show=" playingId === item.id"></Playing>
							<image :src="song.picUrl" mode="" v-for="(song,songIndex) in item.tracks" :key="songIndex" class="image" :class="['f-img','s-img','t-img'][songIndex]"></image>
							<view class="cover"></view>
						</view>
						<view class="tracks" @tap="toPlaylistDetail(item.id)">
							<view v-for="(track,trackIndex) in item.tracks" :key="trackIndex" class="track-item">
								<text class="music-id">{{trackIndex + 1 }}</text>
								<text class="music-name">{{track.first}}</text>
								<text class="music-charactor">-</text>
								<text class="music-author">{{track.second}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="other-rank" v-if="rankOther.length">
				<text class="rank-title">其他榜单</text>
				<view class="rank-box">
					<view class="rank-item" v-for="(other,otherIndex) in rankOther" :key="other.id" @tap="toPlaylistDetail(other.id)">
						<view class="other-img">
							<image-loader  :src="other.coverImgUrl"></image-loader>
						</view>
						<text class="update-frequency">{{other.updateFrequency}}</text>
						<text class="iconfont musicplayCircleOne"></text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bottom-control" v-show="isShowBottomControl">
			<music-controller FMPath="../FM/FM" songDetailPath="../../songDetail/songDetail"></music-controller>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
		<u-no-network tips="YC音乐君开小差了喔!"></u-no-network>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import {topList,topSong,playListDeatil} from '@/common/api.js'
	import { bottomControlMixin,playSongMixin } from '@/common/mixins/mixins.js'
	import Playing from '@/components/Playing/Playing.vue'
	import ImageLoader from '@/components/common/ImageLoader.vue'
	
	export default {
		mixins:[bottomControlMixin,playSongMixin],
		data() {
			return {
				rankAuthor:[],
				rankOther:[],
				playingId:undefined,
				list:[]
			}
		},
		components:{
			Playing,
			ImageLoader
		},
		methods: {
			beginPlay(id){
				if(this.playingId === id){
					this.toPlaylistDetail(id)
				}
				else{
					this.playingId = id
					playListDeatil(id).then(res=>{
						
						if(res.code === 200){
							
							this.idList = res.playlist.trackIds
							this.list = res.playlist.tracks
							this.playAll()
						}
					})
				}
				
			},
			getPlayListData(){
				let list = []
				this.list.map(item=>{
					list.push(item)
				})
				
				return list
			},
			toPlaylistDetail(id){
				uni.navigateTo({
					url:'../../playListDetail/playListDetail?playListId='+id
				})
			},
			playAll(){
				this.playSong(this.idList[0].id,0)
			},
			getRankData(){
				uni.showLoading({
					title:'加载中...'
				})
				topList().then(res=>{
					//console.log(res)
					if(res){
						res.map(item=>{
							item.tracks.length?this.rankAuthor.push(item):this.rankOther.push(item)
						})
						this.rankAuthor.map(rank=>{
							this.getTopThree(rank.id)
						})
						uni.hideLoading()
					}
				})
			},
			//获取对应歌单的前三首歌数据
			getTopThree(id){
				topSong(id).then(res=>{
					let songs = res.songs
					songs.map(item=>{
						this.rankAuthor.map(rank=>{
							if(id === rank.id){
								rank.tracks.map(tr=>{
									if(tr.first === item.name){
										//歌名相同，给tracks中的歌曲添加图片
										//该操作属于给对象添加属性，导致试图不会更新，需要使用this.$set()进行强制更新
										this.$set(tr,'picUrl',item.al.picUrl)
										
									}
								})
							}
						})
					})
					
				})
			}
		},
		created() {
			this.getRankData()
		}
	}
</script>

<style scoped lang="scss">
	.rank-content{
		background: linear-gradient(to bottom,#c9e2ff,#dbeeff,#d7efff,#f4f9ff);
	}
	.scroll{
		margin: 0 auto;
		
		width: 96%;
		height: calc(100vh - 50px);
	}
	.bottom-control{
		bottom:0;
	}
	.rank-nav-bar{
		position: fixed;
		left: 0;
		top: 0;
	}
	.rank-title{
		font-weight: bold;
		
	}
	.rank-item{
		margin: 10px auto;
		width: 96%;
		border-radius: 6px;
		background-color: #ffffff;
	}
	.item-top,.item-bottom,.track-item{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin: 0 auto;
		padding: 10px;
		width: 96%;
	}
	
	.item-top{
		justify-content: space-between;
	}
	.rank-name{
		font-size: 18px;
		font-weight: bolder;
	}
	.update-frequency{
		margin-right: 10px;
		font-size: 12px;
		color: #b5b5b5;
	}
	.tracks{
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: flex-start;
		margin-left: 10px;
		width: 60%;
		height: 80px;
		font-size: 14px;
		font-weight: bolder;
		letter-spacing: 1px;
	}
	.track-item{
		padding: 5px 0;
	}
	.music-id{
		margin-right: 10px;
	}
	.music-name{
		white-space: nowrap;
	}
	.music-charactor{
		padding: 0 4px;
	}
	.music-author,.music-name{
		max-width: 100px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.music-author{
		color: #707070;
		font-weight: normal;
	}
	.image-box{
		position: relative;
		width: 80px;
		height: 80px;
		color: #e8e8e8;
		.playing{
			top:35%;
			width: 20px;
			height: 20px;
		}
		.musicplay,.playing{
			position: absolute;
			left: 35%;
			line-height: 80px;
			transform: translate(-50%);
			z-index: 1000;
		}
		.image{
			position: absolute;
			top:50%;
			transform: translateY(-50%);
		}
		.f-img{
			width: 70%;
			height: 70%;
			border-radius: 6px;
			z-index: 999;
		}
		.s-img{
			width: 60%;
			height: 60%;
			top:44px;
			left: 18px;
			border-radius: 5px;
			z-index: 998;
		}
		
		.t-img{
			width: 40%;
			height: 40%;
			top:52px;
			left: 42px;
			border-radius: 4px;
			z-index: 997;
		}
		.cover{
			position: absolute;
			top:50%;
			width: 100%;
			height: 70%;
			background-color: rgba(255, 255, 255, .7);
			transform: translateY(-50%);
			z-index: 998;
		}
	}
	.other-rank{
		.rank-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
		}
		.rank-box::after{
			content: '';
			width: 33%;
		}
		.other-img{
			width: 100%;
			height: 100%;
			border-radius: 10px;
		}
		.rank-item{
			position: relative;
			margin: 8px auto;
			width: 120px;		
			height: 120px;
			border-radius: 10px;
				.update-frequency{
					position: absolute;
					bottom: 10px;
					left: 50%;
					width: 60px;
					transform: translateX(-50%);
					color: #dddddd;
				}
				.musicplayCircleOne{
					position: absolute;
					right: 6px;
					top:6px;
					color: #fff;
				}
		}
	}
	/* #ifdef H5 */
	.rank-nav{
		height: 50px;
	}
	/* #endif */
	/* #ifdef MP-WEIXIN || APP*/
	.scroll{
		height: 100vh;
	}
	.rank-nav{
		height: 80px;
	}
	/* #endif */
</style>
