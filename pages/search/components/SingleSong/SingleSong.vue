<template>
	<view class="single-song-container">
		<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore" v-if="count">
			<view class="song-item" v-for="(item,index) in data.songs" :key="index" @tap="toDetail(item.id)">
				<view class="left">
					<text class="song-name">{{item.name}}</text>
					<view class="self-info">
						<text v-if="item.copyrightId" class="copyright tag">原唱</text>
						<text class="sq tag" v-if="item.sq">SQ</text>
						<text class="author">{{$dealAuthor(item.ar,'name') || $dealAuthor(item.artists,'name')}}</text>
						<text class="charactor" v-if="item.album">-</text>
						<text class="al" v-if="item.album">{{item.album.name}}</text>
					</view>
					<text class="alia" v-if="item.al">{{item.al.name }}</text>
				</view>
				<view class="right">
					<text v-if="item.mvid" class="iconfont musicplayCircle"></text>
					<text class="iconfont controller-more_ver"></text>
				</view>
			</view>
		</scroll-view>
		<view class="empty" v-else>
			<image class="empty-img" src="../../../../static/images/empty.png" mode="aspectFit"></image>
			<text class="empty-msg">暂无数据</text>
		</view>
	</view>
</template>
	
<script >
	import '@/common/controller.css'
	import '@/common/iconfont.css'
	import { songDetail } from '@/common/api.js'
	import { searchScrollMixin , bottomControlMixin ,playSongMixin} from '@/common/mixins/mixins.js'
	export default {
		name:'SingleSong',
		mixins:[searchScrollMixin, bottomControlMixin ,playSongMixin ],
		methods:{
			toDetail(id){
				songDetail(id).then(res=>{
					if(res.code === 200){
						this.playSongNoCoverPlayList(res.songs[0])
					}
				})
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.scroll-v{
		
		background-color: #fff;
		border-radius: 6px;
	}
	.song-item{
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		width: 96%;
		border-bottom: 1px solid #efefef;
		font-size: 12px;
		.copyright{
			display: inline-block;
			padding: 1px;
			background-color: #ff0000;
			color: #fff;
			border-radius: 4px;
			font-size: 12px;
		}
		.sq{
			display: inline-block;
			padding:0 1px;
			border-radius: 4px;
			border: 1px solid #f00;
			font-size: 12px;
			color: #f00;
		}
		.left{
			.song-name{
				display: flex;
				width: 280px;
				font-size: 14px;
			}
			.self-info{
				padding-top: 5px;
			}
		}
		.right{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			
			.iconfont{
				margin: 0 10px;
			}
		}
	}
	.author{
		color: #007AFF;
		font-size: 14px;
	}
	.alia{
		
		position: relative;
		margin-top: 4px;
		color: #B9B9B9;
	}
	.al{
		color: #B9B9B9;
	}
	.author,.al,.alia{
		position: relative;
		display: inline-block;
		top: 4px;
		max-width: 260px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
