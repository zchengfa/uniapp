<template>
	<view class="rec-every-day">
		<nav-bar class="nav"></nav-bar>
		<view class="rec-content">
			<view class="top" :style="topCover">
				<view class="today-fortune">
					<view class="time">
						<text class="day">{{new Date().getDate()}}</text>
						<text class="month">/{{month}}</text>
					</view>
					<text class="fortune">查看今日运势&nbsp></text>
				</view>
			</view>
			<!-- 歌曲列表 -->
			<view class="list" :style="changeHeight">
				<view class="list-top">
					<view class="play-all">
						<text class="iconfont musicplayCircleOne"></text>
						<text class="play-text" @tap="playAll">播放全部</text>
						<!-- <text class="list-count">({{allSongData.length}})</text> -->
					</view>
					<text class="iconfont controller-download"></text>
				</view>
				<scroll-view scroll-y="true" class="list-scroll">
					<view class="list-item" v-for="(item,index) in songsData" :key="index">
						<image class="pic" :src="item.al.picUrl"></image>
						<view class="item-info">
							<view class="item-left" @tap="playSong(item.id,index,'../../songDetail/songDetail')">
								<text class="song-name hidden-text" :class="{'current-song':item.id === songId}">{{item.name}}</text>
								<view class="song-info">
									<text class="hi-res tag" v-if="item.hr">Hi-res</text>
									<text class="sq tag" v-else>SQ</text>
									<text class="author">{{$dealAuthor(item.ar,'name')}}</text>
									<text class="charactor">-</text>
									<text class="al hidden-text" >{{item.al.name}}</text>
								</view>
							</view>
							<view class="item-right">
								<text v-if="item.mv" class="iconfont musicplayCircle mv"></text>
								<text class="more iconfont controller-more_ver"></text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 底部音乐控件 -->
		<view class="bottom-control" v-show="isShowBottomControl">
			<music-controller FMPath="../FM/FM" songDetailPath="../../songDetail/songDetail"></music-controller>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import { recSongs } from '@/common/api.js'
	import { playSongMixin ,bottomControlMixin} from '@/common/mixins/mixins.js'
	import { mapGetters } from 'vuex'
	
	export default {
		name:'recommendedDay',
		mixins:[playSongMixin,bottomControlMixin],
		data() {
			return {
				songsData:[],
				topCover:''
			}
		},
		created() {
			recSongs().then(res=>{
				
				if(res.code === 200){
					this.songsData = res.data.dailySongs
					this.topCover = `background-image:url(${this.songsData[0].al.picUrl})`
					
				}
			})
			this.changeStyle()
		},
		mounted() {
			//监听music-controller组件列表按钮发出的事件（显示播放列表）
			uni.$on('showList',()=>{
				this.isShowMusicList = true
			})
			
			//监听music-list组件关闭播放列表的事件，将己组件中控制列表显示的变量作出改变
			uni.$on('listCloseOver',()=>{
				this.isShowMusicList = false
			})
		},
		computed:{
			...mapGetters(['songId']),
			month(){
				let month = new Date().getMonth()
				if(month === 0){
					return 12
				}
				else{
					return month + 1
				}
			}
		},
		methods: {
			//整理播放列表所需要的数据
			getPlayListData(){
				return this.songsData
			},
			//点击播放全部按钮，从列表中的第一首歌开始播放
			playAll(){
				this.playSong(this.songsData[0].id,0)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rec-every-day{
		width: 100%;
		height: 100vh;
		
	}
	.nav{
		position: fixed;
		top: 0;
		width:100vw;
		background-color: rgba(0, 0, 0, .1);
		z-index: 1000;
	}
	.rec-content{
		position: absolute;
		top:0;
		width: 100%;
		height: 100%;
		.top{
			display: flex;
			flex-direction: column-reverse;
			width: 100%;
			height: 30%;
			background-size: cover;
			background-repeat: no-repeat;
			.today-fortune{
				margin-left: 30px;
				margin-bottom: 30px;
				color: #fff;
			}
			.day{
				font-size: 30px;
			}
			.fortune{
				font-size: 14px;
			}
		}
	}
	.list{
		padding: 0 10px;
		height: 70%;
		background-color: #fff;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.list-top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 0;
		.musicplayCircleOne{
			font-size: 18px;
			color: #f00;
		}
		.play-text{
			margin-left: 10px;
			font-weight: bold;
		}
		.list-count{
			margin-left: 5px;
			color: #a3a3a3;
			font-size: 12px;
		}
	}
	.list-scroll{
		height: calc(100% - 62px - 15px);
		background-color: #fff;
		.list-item{
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 20px;
			color: #a8a8a8;
			
		}
		
		.No{
			margin-right: 10px;
			width: 20px;
			text-align: center;
			font-size: 12px;
		}
		.item-info{
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.song-name{
				font-size: 14px;
				color: #000;
				max-width: 200px;
			}
		}
	}
	.hidden-text{
		display: block;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.al{
		max-width: 160px;
	}
	.song-info{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 6px;
		font-size: 12px;
		.tag{
			
			padding: 1px;
			color: #f00;
			border: 1px solid #f00;
			border-radius: 4px;
		}
	}
	.mv{
		margin-right: 20px;
	}
	.pic{
		margin-right: 8px;
		width: 40px;
		height: 40px;
		border-radius: 6px;
	}
	.bottom-control{
		bottom:0;
	}
</style>
