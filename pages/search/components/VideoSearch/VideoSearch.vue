<template>
	<view class="video-container">
		<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore" v-if="count">
			<view class="sheets-item" v-for="(item,index) in data.videos" :key="index" @tap="toVideoDetail(item.vid)">
				<view class="image-box">
					<image :src="item.coverUrl" class="sheet-image"></image>
					<text class="time">{{$transTime(item.playTime/1000)}}</text>
				</view>
				<view class="info">
					<text class="video-title">{{item.title}}</text>
					<view class="creator">
						<text class="art-item" v-for="(art,artIndex) in item.creator" :key="artIndex">{{art.userName}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<text class="empty" v-else>暂未查询到任何有关数据...</text>
	</view>
</template>

<script>
	import { serachScrollMixin ,bottomControlMixin} from '@/common/mixins/mixins.js'
	export default {
		name:'VideoSearch',
		mixins:[serachScrollMixin,bottomControlMixin],
		
		methods:{
			toVideoDetail(mvId){
				if(Number(mvId)){
					console.log('这是mv')
				}
				else{
					console.log('这是视频')
				}
				
				uni.showModal({
					title:'提示',
					content:'视频功能尚未完善'
				})
			}
		}
		
	}
</script>

<style scoped lang="scss">
	.video-container{
		margin: 0 auto;
		width: 94vw;
	}
	.scroll-v{
		
		height: calc(100vh - 100px);
		background-color: #fff;
		border-radius: 6px;
		font-size: 12px;
		
	}
	.sheets-item{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 10px;
	}
	.sheet-image{
		width: 160px;
		height: 100px;
		border-radius: 6px;
	}
	.info{
		margin-left: 10px;
		.video-title{
			margin: 10px  10px 10px 0;
			display: inline-block;
			font-size: 14px;
			white-space: pre-wrap;
		}
		.art-item{
			margin-right: 10px;
			color: #767676;
		}
	}
	.image-box{
		position: relative;
	}
	.time{
		position: absolute;
		right: 8px;
		top:80px;
		color: #fff;
	}
	
</style>
