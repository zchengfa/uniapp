<template>
	<view class="album-container">
		<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll" :style="scrollHeightSwiper"  @scrolltolower="loadMore">
			<view class="album" v-if="count">
				<view class="album-item" v-for="(item,index) in data.albums" :key="index">
					<view class="image-box">
						<image class="album-image" :src="item.picUrl" ></image>
					</view>
					<view class="info">
						<text class="song-name">{{item.name}}</text>
						<view class="name-publish-time">
							<text class="author">{{$dealAuthor(item.artists,'name')}}</text>
							<text class="publish-time">{{$timeFormate('YYYY.MM.DD',new Date(item.publishTime))}}</text>
						</view>
					</view>
				</view>
			</view>	
			<view class="empty" v-else>
				<image class="empty-img" src="../../../../static/images/empty.png" mode="aspectFit"></image>
				<text class="empty-msg">暂无数据</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { searchScrollMixin ,bottomControlMixin } from '@/common/mixins/mixins.js'
	export default {
		name:'Sheet',
		mixins:[searchScrollMixin ,bottomControlMixin]
		
	}
</script>

<style scoped lang="scss">
	.album-container{
		padding: 0 10px;
		background-color: #fff;
		text-align: center;
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
				text-align: left;
			}
			.name-publish-time{
				margin-top: 6px;
				text-align: left;
				.publish-time{
					margin-left: 6px;
					color: #bfbfbf;
					font-size: 12px;
				}
			}
		}
		.author{
			color: #007AFF;
			font-size: 12px;
		}
	}
</style>
