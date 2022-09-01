<template>
	<view class="lyrics-container">
		<scroll-view scroll-y="true" class="scroll-v" @scrolltolower="loadMore" >
			<view class="lyrics" v-show="count">
				<view class="lyric-item" v-for="(item,index) in data.songs" :key="index">
					<view class="top">
						<view class="left">
							<text class="song-name">{{item.name}}</text>
							<view class="self-info">
								<text v-if="item.copyrightId" class="copyright">原唱</text>
								<text class="sq" v-if="item.sq">SQ</text>
								<text class="author">{{item.artists[0].name}}</text>
								<text class="charactor" v-if="item.album">-</text>
								<text class="al" v-if="item.album">{{item.album.name}}</text>
							</view>
						</view>
						<view class="right">
							<text v-if="item.mvid" class="iconfont musicplayCircle"></text>
							<text class="iconfont controller-more_ver"></text>
						</view>
					</view>
					<view class="bottom">
						<text class="tag">词</text>
						<view class="lyric-box">
							<text class="lyric" :class="item.isOpen?'open-active':'close-active'">{{item.lyrics.txt}}</text>
							<!-- #ifdef H5 -->
							<view class="open-box" v-show="!item.isOpen" @tap="openOrCloseLy(index)">
								<text class="open">展开歌词</text>
								<image class="image" src="~@/static/images/down.png"></image>
							</view>
							<view class="close-box" v-show="item.isOpen" @tap="openOrCloseLy(index)">
								<text class="close">收起歌词</text>
								<image class="image" src="~@/static/images/up.png"></image>
							</view>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<view class="open-box" v-if="!item.isOpen" @tap="openOrCloseLy(index)">
								<text class="open">展开歌词</text>
								<image class="image" src="~@/static/images/down.png"></image>
							</view>
							<view class="close-box" v-else @tap="openOrCloseLy(index)">
								<text class="close">收起歌词</text>
								<image class="image" src="~@/static/images/up.png"></image>
							</view>
							<!-- #endif -->
						</view>
					</view>
				</view>
			</view>
			<text class="empty" v-show="!count">暂未查询到任何有关数据...</text>
		</scroll-view>
	</view>
</template>

<script>
	import { serachScrollMixin } from '@/common/mixins/mixins.js'
	export default {
		name:'Sheet',
		mixins:[serachScrollMixin],
		
		methods:{
			openOrCloseLy(index){
				this.$emit('openOrCloseLy',index)
			}
		}
		
	}
</script>

<style scoped lang="scss">
	.scroll-v{
		margin: 0 auto;
		width: 94%;
	}
	.open-active{
		height: 100%;
	}
	.close-active{
		height: 60px;
	}
	.lyrics-container{
		background-color: #fff;
		font-size: 12px;
		.lyric-item{
			padding: 10px 0;
			border-bottom: 1px solid #d5d5d5;
		}
		.top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-left: 40px;
			.self-info{
				margin-top: 6px;
			}
		}
		.copyright{
			margin:0 4px;
			padding: 1px;
			background-color: #ff0000;
			color: #fff;
			border-radius: 4px;
			font-size: 12px;
		}
		.sq{
			margin: 0 2px;
			padding:0 1px;
			border-radius: 4px;
			border: 1px solid #f00;
			font-size: 12px;
			color: #f00;
		}
		.author{
			color: #007AFF;
		}
		.al{
			position: relative;
			top:3px;
			display: inline-block;
			color: #8d8d8d;
			width: 180px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.song-name{
			display: block;
			max-width: 200px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			font-size: 14px;
		}
		.right{
			.musicplayCircle{
				margin-right: 10px;
			}
		}
		.bottom{
			margin-top: 10px;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			.tag{
				margin:0 6px;
				padding: 1px 2px;
				border-radius: 2px;
				background-color: #cccccc;
				color: #fff;
			}
			.lyric{
				display:block;
				max-width: 280px;
				line-height: 20px;
				color: #707070;
				white-space: pre-wrap;
				word-break: break-word;
				overflow: hidden;
			}
		}
	}
	.image{
		width: 16px;
		height: 16px;
	}
	.open-box,.close-box{
		margin-top: 10px;
		display: inline-flex;
		color: #707070;
	}
</style>
