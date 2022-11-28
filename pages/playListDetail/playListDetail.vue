<template>
	<view class="playlist-detail">
		<view class="bg" :style="bgImage"></view>
		<!-- 导航栏 -->
		<view class="nav">
			<view class="left">
				<text @tap="back" class="nav-item iconfont musicleftArrow"></text>
				<text class="nav-item">歌单</text>
			</view>
		</view>
		<scroll-view scroll-y="true" :style="scrollHeightNoTab" class="scroll-v">
			<!-- 歌单基本信息 -->
			<view class="playlist-info">
				<view class="top">
					<view class="image-text">
						<view class="image-box">
							<image class="playlist-image" :src="playList.coverImgUrl"></image>
						</view>
						<view class="info">
							<text class="name">{{playList.name}}</text>
							<view class="user">
								<view class="image-box">
									<image class="user-ava" :src="creator.avatarUrl" ></image>
									<image v-if="creatorDetail" class="identity-image user-img" :src="creatorDetail.identityIconUrl" ></image>
								</view>
								<text class="creator-name">{{creator.nickname}}</text>
								<image v-if="creator.gender === 1" class="identity-image" src="~@/static/images/man.png" mode=""></image>
								<image v-else-if="creator.gender === 2" class="identity-image" src="~@/static/images/woman.png" mode=""></image>
								<view class="followed">
									<text class="care no-care" v-if="!playList.followed">+关注</text>
									<text class="care had-care" v-else>√已关注</text>
								</view>
							</view>
						</view>
					</view>
					<view class="desc-box" v-if="desc" @tap="showDetail">
						<text class="desc">{{desc}}</text>
						<text class="iconfont musicleftArrow rotate"></text>
					</view>
				</view>
				<view class="bottom other-info">
					<view class="other-info-item">
						<text class="iconfont musicshare"></text>
						<text class="count">{{$dealCount(playList.shareCount)}}</text>
					</view>
					<view class="other-info-item">
						<text class="iconfont controller-comments"></text>
						<text class="count">{{$dealCount(playList.commentCount)}}</text>
					</view>
					<view class="other-info-item " :class="{'subscr':true}">
						<text class="iconfont controller-add"></text>
						<text class="count">{{$dealCount(playList.subscribedCount)}}</text>
					</view>
				</view>
			</view>
			<!-- 歌曲列表 -->
			<view class="list">
				<view class="list-top">
					<view class="play-all">
						<text class="iconfont musicplayCircleOne"></text>
						<text class="play-text" @tap="playAll">播放全部</text>
						<text class="list-count">({{allSongData.length}})</text>
					</view>
					<text class="iconfont controller-download"></text>
				</view>
				<scroll-view scroll-y="true" class="list-scroll"  @scrolltolower="loadMore">
					<view class="list-item" v-for="(item,index) in showData" :key="index">
						<image src="../../static/images/playing.png" mode="aspectFit" v-if="songId === item.id" class="playing"></image>
						<text class="No" v-show="songId !== item.id">{{index+1}}</text>
						<view class="item-info">
							<view class="item-left" @tap="playSong(item.id,index,'../../pages/songDetail/songDetail')">
								<text class="song-name hidden-text" :class="{'current-song':songId === item.id}">{{item.name}}</text>
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
					<!-- 底部收藏者简略介绍 -->
					<view class="subscr-box">
						<view class="avatar-box">
							<view class="image-box">
								<image class="sub-img" v-for="(ava,avaIndex) in playList.subscribers" :src="ava.avatarUrl" :key="avaIndex"></image>
							</view>
						</view>
						<view class="sub">
							<text class="sub-count">{{$dealCount(playList.subscribedCount)}}人收藏</text>
							<text class="iconfont musicleftArrow sub-rotate"></text>
						</view>
					</view>
				</scroll-view>
			</view>
		</scroll-view>
		<!-- 歌单详细描述 -->
		<view class="desc-detail" v-show="showDescDetail">
			<text class="iconfont musicclose close" @tap="showDetail"></text>
			<view class="main-desc">
				<view class="image-name">
					<image :src="playList.coverImgUrl" class="desc-image"></image>
					<text class="desc-name">{{playList.name}}</text>
				</view>
				<view class="tag-desc">
					<view class="tag-box" v-if="!!tagsLength">
						<text class="tag-label">标签:</text>
						<text class="tag-item" v-for="(item,index) in playList.tags" :key="index">{{item}}</text>
					</view>
					<text class="desc-text">{{playList.description}}</text>
				</view>
			</view>
			<text class="save">保存封面</text>
		</view>
		<!-- 底部音乐控件 -->
		<view class="bottom-control" v-show="isShowBottomControl">
			<music-controller FMPath="../indexMenu/FM/FM" songDetailPath="../songDetail/songDetail"></music-controller>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import '@/common/controller.css'
	import { playListDeatil,songDetail } from '@/common/api.js'
	import { bottomControlMixin,playSongMixin } from '@/common/mixins/mixins.js'
	import { mapGetters } from 'vuex'
	
	export default {
		name:'playListDetail',
		mixins:[bottomControlMixin,playSongMixin],
		data() {
			return {
				playList:{},
				allSongData:[],
				bgImage:'',
				creator:{},
				creatorDetail:{},
				showDescDetail:false,
				sliceBegin:0,
				sliceEnd:15,
				showData:[],
				tagsLength:undefined
			}
		},
		computed:{
			...mapGetters(['songId']),
			desc(){
				if(typeof this.playList.description === 'string'){
					return this.playList.description.replace('\n','')
				}
			}
		},
		methods: {
			//整理播放列表所需要的数据
			getPlayListData(){
				let list = []
				this.allSongData.map(item=>{
					list.push(item)
				})
				
				return list
			},
			//点击播放全部按钮，从列表中的第一首歌开始播放
			playAll(){
				this.playSong(this.idList[0].id,0)
			},
			back(){
				uni.navigateBack()
			},
			getData(id){
				playListDeatil(id).then(res=>{
					if(res.code === 200){
						this.playList = res.playlist
						this.tagsLength = res.playlist.tags.length
						this.idList = this.playList.trackIds
						let ids = ''
						this.idList.map(item=>{
							ids += item.id + ','
						})
						this.bgImage = `background-image:url("${this.playList.coverImgUrl}")`
						this.creator = res.playlist.creator
						this.creatorDetail = res.playlist.creator.avatarDetail
						
						this.getAllSongDetail(ids.substring(0,ids.length - 1))
					}
					
				})
			},
			getAllSongDetail(ids){
				uni.showLoading({
					title:'加载中'
				})
				//console.log(songDetail(ids))
				songDetail(ids).then(res=>{
					//console.log(res)
					if(res.code === 200){
						this.allSongData = res.songs
						this.sliceList()
					}
					uni.hideLoading()
				})
			},
			showDetail(){
				this.showDescDetail = !this.showDescDetail
			},
			loadMore(){
				if(this.showData.length < this.allSongData.length){
					this.sliceBegin +=15
					this.sliceEnd += 15
					this.sliceList()
				}
				
			},
			sliceList(){
				this.showData.push(...this.allSongData.slice(this.sliceBegin,this.sliceEnd)) 
			}
		},
		
		onLoad(options) {
			
			this.getData(options.playListId)
		}
	}
</script>

<style scoped lang="scss">
	.author{
		max-width: 100px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.subscr{
		background-color: #f00 !important;
	}
.bg{
	position: absolute;
	width: 100%;
	height: 100vh;
	filter: blur(10vw);
}

.scroll-v{
	height: calc(100vh - 50px);
	.playlist-info{
		padding: 10px 15px;
		color: #fff;
		.playlist-image{
			width: 100px;
			height: 100px;
			border-radius: 10px;
		}
		.creator-name{
			margin: 0 4px;
		}
		.identity-image{
			width: 12px;
			height: 12px;
		}
		.image-text{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.user-ava{
				width: 30px;
				height: 30px;
				border-radius: 50%;
			}
			.info{
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: flex-start;
				margin-left: 10px;
				height: 100px;
				.name{
					font-weight: bold;
				}
				.user{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin: 10px 0;
					color: #d4d4d4;
					font-size: 12px;
					.user-img{
						position: relative;
						left: -10px;
					}
				}
			}
		}
	}
}
.rotate,.sub-rotate{
	margin-left: 4px;
	font-size: 12px;
	transform: rotate(180deg);
}
.desc-box{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-top: 20px;
	font-size: 12px;
	.desc{
		height: 16px;
		white-space: nowrap;
		overflow: hidden;
		mix-blend-mode: lighten;
	}
}
.followed{
	margin-left: 10px;
}
.care{
	padding: 2px 8px;
	background-color: rgba(0,0,0,.3);
	border-radius: 16px;
}

.other-info{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 0;
	font-size: 12px;
	.other-info-item{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 26%;
		height: 36px;
		border-radius: 18px;
		background-color: rgba(143, 143, 143, 0.3);
		.count{
			margin-left: 10px;
		}
	}
}
.list{
	padding: 0 10px;
	height: 100%;
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
	height: calc(100% - 62px);
	background-color: #fff;
	.list-item{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;
		color: #a8a8a8;
		
	}
	.playing{
		margin-right: 10px;
		transform-origin: center;
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

// 歌单详细描述
.desc-detail{
	position: absolute;
	top:0;
	left: 0;
	width: 100%;
	height: 100vh;
	color: #fff;
	font-size: 12px;
	background-color: #643e3e;
	z-index: 999;
	.close{
		position: relative;
		top:20px;
		left: 90%;
	}
	
	.main-desc{
		margin: 40px auto 0;
		width: 84%;
		
		.desc-image{
			width: 200px;
			height: 200px;
			border-radius: 10px;
		}
		// #ifdef MP-WEIXIN
		.desc-image{
			width: 160px;
			height: 160px;
		}
		// #endif
		.image-name{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.desc-name{
			margin: 20px 0;
			font-size: 16px;
			font-weight: bold;
		}
		.tag-item{
			margin: 20px 10px;
			display: inline-block;
			padding: 4px 10px;
			border-radius: 16px;
			background-color: #aba7a7;
		}
		.desc-text{
			line-height: 24px;
		}
	}
	.save{
		position: absolute;
		bottom: 10%;
		left: 50%;
		padding: 4px 10px;
		border-radius: 16px;
		border: 1px solid #c8c8c8;
		transform: translateX(-50%);
	}
	
	// #ifdef MP-WEIXIN
	.main-desc{
		margin: 60px auto 0;
	}
	.close{
		top:40px;
		left: 20px;
	}
	.save{
		bottom: 40px;
	}
	// #endif
}
.subscr-box{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 20px;
	color: #9a9a9a;
	font-size: 12px;
	.avatar-box{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		
	}
		.image-box{
			width: 50vw;
			height: 24px;
			overflow: hidden;
			.sub-img{
				margin-right: 10px;
				display: inline-flex;
				width: 24px;
				height: 24px;
				border-radius: 50%;
			}
		}
		.sub-rotate{
			margin-left: 10px;
		}
	}
// #ifdef MP-WEIXIN
.scroll-v{
	height: calc(100vh - 80px);
}
.nav{
	height: 80px;
	.nav-item{
		position: relative;
		top:20px;
	}
}

// #endif
.bottom-control{
	bottom: 0;
}
</style>
