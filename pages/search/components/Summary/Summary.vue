<template>
	<view class="summary-container">
		<scroll-view scroll-y="true" class="scroll-summary" :style="scrollHeightSwiper">
			<!-- 单曲 -->
			<view class="single-song scroll-item">
				<view class="title-box">
					<text class="title">单曲</text>
					<view class="play-btn" @tap="playAll">
						<text class="iconfont musicplayCircleOne"></text>
						<text class="play-text">播放全部</text>
					</view>
				</view>
				<view class="song-item" v-for="(item,index) in song.songs" :key="index" @tap="toDetail(item)">
					<view class="left">
						<text class="song-name">{{item.name}}</text>
						<view class="self-info">
							<text v-if="item.copyright" class="copyright tag">原唱</text>
							<text class="sq tag" v-if="item.sq">SQ</text>
							<text class="author">{{item.ar[0].name}}</text>
							<text class="charactor">-</text>
							<text class="al">{{item.al.name}}</text>
						</view>
						<text class="alia">{{item.alia[0]}}</text>
					</view>
					<view class="right">
						<text v-if="item.mv" class="iconfont musicplayCircle"></text>
						<text class="iconfont controller-more_ver"></text>
					</view>
				</view>
				<view class="bottom-item" v-if="song.more" @tap="changeInto('t1')">
					<view class="match-box" v-if="song.moreText.indexOf(word) !== -1">
						<text class="more-title">{{dealStringPre(song.moreText,word)}}</text>
						<text class="word">{{dealStringWord(song.moreText,word)}}</text>
						<text>{{dealStringLast(song.moreText,word)}}</text>
					</view>
					<view class="no-match" v-else>
						<text>{{song.moreText}}</text>
					</view>
					<text class="tag">></text>
				</view>
			</view>
			<!-- 歌单 -->
			<view class="sheet scroll-item">
				<text class="title">歌单</text>
				<view class="sheets-item" v-for="(item,index) in playList.playLists" :key="index" @tap="toPlayListDetail(item.id)">
					<view class="image-box">
						<image :src="item.coverImgUrl" class="sheet-image"></image>
					</view>
					<view class="self-info">
						<text class="item-name self-item">{{item.name}}</text>
						<text class="item-other self-item">{{item.trackCount}} 首,by {{item.creator.nickname}},播放 {{$dealCount(item.playCount)}}次</text>
						<view class="other self-item" v-if="item.officialTags">
							<text class="tag-item" v-for="(tag,tagIndex) in  item.officialTags" :key="tagIndex">{{tag}}</text>
						</view>
					</view>
				</view>
				<view class="bottom-item sheet-bottom" v-if="playList.more"  @tap="changeInto('t2')">
					<view class="match-box" v-if="playList.moreText.indexOf(word) !== -1">
						<text class="more-title">{{dealStringPre(playList.moreText,word)}}</text>
						<text class="word">{{dealStringWord(playList.moreText,word)}}</text>
						<text>{{dealStringLast(playList.moreText,word)}}</text>
					</view>
					<view class="no-match" v-else>
						<text>{{playList.moreText}}</text>
					</view>
					<text class="tag">></text>
				</view>
			</view>
			<!-- 相关搜索 -->
			<view class="sim-search scroll-item" v-if="sim.sim_querys">
				<text class="title">相关搜索</text>
				<view class="sim-box">
					<text class="sim-text" v-for="(item,index) in sim.sim_querys" :key="index">{{item.keyword}}</text>
				</view>
			</view>
			<!-- 艺人 -->
			<view class="artist scroll-item">
				<text class="title">艺人</text>
				<view class="sheets-item" v-for="(item,index) in artist.artists" :key="index">
					<view class="left">
						<view class="image-box">
							<image class="sheet-image" :src="item.picUrl"></image>
							<image class="identity-image" :src="item.identityIconUrl" mode=""></image>
						</view>
						<view class="info">
							<text class="artist-name">{{item.name}}</text>
						</view>
					</view>
					<view class="right">
						<text class="care no-care" v-if="!item.followed">+关注</text>
						<text class="care had-care" v-else>√已关注</text>
					</view>
				</view>
				<view class="bottom-item sheet-bottom" v-if="artist.more">
					<text>{{artist.moreText}}</text>
					<text class="tag">></text>
				</view>
			</view>
			<!-- 专辑 -->
			<view class="album scroll-item">
				<text class="title">专辑</text>
				<view class="album-item" v-for="(item,index) in album.albums" :key="index">
					<view class="image-box">
						<image class="album-image" :src="item.picUrl" ></image>
					</view>
					<view class="info">
						<text class="song-name">{{item.name}}</text>
						<view class="name-publish-time">
							<text class="author">{{item.artist.name}}</text>
							<text class="publish-time">{{$timeFormate('YYYY.MM.DD',new Date(item.publishTime))}}</text>
						</view>
					</view>
				</view>
				<view class="bottom-item sheet-bottom" v-if="album.more">
					<view class="no-match">
						<text>{{album.moreText}}</text>
					</view>
					<text class="tag">></text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import '@/common/controller.css'
	import { bottomControlMixin , playSongMixin } from '@/common/mixins/mixins.js'
	
	export default {
		name:'Summary',
		mixins:[bottomControlMixin,playSongMixin],
		props:{
			song:{
				type:Object,
				default(){
					return {}
				}
			},
			word:{
				type:String,
				default(){
					return ''
				}
			},
			playList:{
				type:Object,
				default(){
					return {}
				}
			},
			artist:{
				type:Object,
				default(){
					return {}
				}
			},
			sim:{
				type:Object,
				default(){
					return {}
				}
			},
			album:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		methods:{
			changeInto(into){
				
				this.$emit('changeInto',into)
			},
			dealStringPre(str,word){
				return str.substring(0,str.indexOf(word))
			},
			dealStringWord(str,word){
				return str.substr(str.indexOf(word),word.length)
			},
			dealStringLast(str,word){
				return str.substr(str.indexOf(word)+(word.length))
			},
			toDetail(item){
				this.playSongNoCoverPlayList(item)
			},
			playAll(){
				this.playSong(this.$props.song.resourceIds[0],0)
			},
			getPlayListData(){
				let list = []
				list.push(...this.$props.song.songs)
				return list
			},
			toPlayListDetail(id){
				uni.navigateTo({
					url:'../../pages/playListDetail/playListDetail?playListId='+id
				})
			}
		}
	
	}
</script>

<style lang="scss" scoped >
	.title{
		font-size: 18px;
	}
	.summary-container{
		margin: 0 auto;
		width: 94vw;
	}
	.title-box{
		padding: 20px 0 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 16px;
		font-weight: bold;
		border-bottom: 1px solid #efefef;
		.title{
			padding: 0;
		}
		.play-btn{
			padding:2px 6px;
			color: #f00;
			font-size: 12px;
			border: 1px solid #f00;
			border-radius: 16px;
			.musicplayCircleOne{
				margin-right: 4px;
				font-size: 12px;
			}
		}
	}
	.scroll-item{
		padding: 0 10px;
		background-color: #fff;
		
		border-radius: 6px;
	}
	.scroll-item:not(:first-child){
		margin-top: 20px;
	}
	.scroll-summary{
		width: 94vw;
		height: calc(100vh - 100px);
		font-size: 14px;
		font-size: 12px;
		
		.song-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 0;
			width: 100%;
			border-bottom: 1px solid #efefef;
			.copyright{
				
				padding: 1px;
				background-color: #ff0000;
				color: #fff;
				border-radius: 4px;
				font-size: 12px;
			}
			.sq{
				
				padding:0 1px;
				border-radius: 4px;
				border: 1px solid #f00;
				font-size: 12px;
				color: #f00;
			}
			.left{
				.song-name{
					font-size: 14px;
				}
				.self-info{
					padding-top: 5px;
				}
				
				.alia{
					display: block;
					position: relative;
					margin-top: 4px;
					color: #B9B9B9;
				}
			}
			.right{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				margin-left: 35px;
				.iconfont{
					margin: 0 10px;
				}
			}
		}
		.author{
			color: #007AFF;
		}
		.bottom-item{
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 10px 0;
			letter-spacing: 2px;
			color: #b6b6b6;
			.word{
				color: #007AFF;
			}
			.tag{
				margin-left: 4px;
			}
		}
		.sheet-bottom{
			border-top: 1px solid #efefef;
		}
		.sheets-item{
			margin-bottom: 10px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			letter-spacing: 1px;
			.sheet-image{
				width: 50px;
				height: 50px;
				border-radius: 6px;
			}
			.self-info{
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				
				margin-left: 10px;
				.tag-item{
					margin-left: 4px;
					display: inline-block;
					padding: 0 2px;
					color: #f00;
					border-radius: 4px;
					background-color: #ffe5ea;
				}
				.item-other{
					color: #b0b0b0;
				}
				.self-item{
					margin-bottom: 6px;
				}
			}
		}
	}
	.artist{
		.sheets-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 0;
			.care{
				padding: 2px 8px;
				border: 1px solid #f00;
				border-radius: 16px;
				color: #f00;
				
			}
			.had-care{
				border-color: #bebebe;
				color: #bebebe;
			}
			.left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.artist-name{
					margin-left: 10px;
				}
			}
		}
		.image-box{
			position: relative;
			.sheet-image{
				width: 50px;
				height: 50px;
				border-radius: 50%;
			}
			.identity-image{
				position: absolute;
				bottom: 0;
				right: 6px;
				width: 16px;
				height: 16px;
				border-radius: 50%;
			}
		}
	}
	.sim-search{
		.sim-box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			padding: 10px 0;
			.sim-text{
				padding: 5px 10px;
				background-color: #dcdcdc;
				border-radius: 16px;
				margin-right: 20px;
				margin-bottom: 10px;
			}
		}
	}
	.album{
		.album-item{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-top: 10px;
		}
		.album-image{
			width: 50px;
			height: 50px;
			border-radius: 6px;
		}
		.info{
			margin-left: 10px;
			.song-name{
				display: block;
				max-width: 240px;
				font-size: 14px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.name-publish-time{
				margin-top: 6px;
				.publish-time{
					margin-left: 6px;
					color: #bfbfbf;
				}
			}
		}
		
	}
// #ifdef MP-WEIXIN
.scroll-summary{
	height: calc(100vh - 125px);
}
// #endif
</style>
