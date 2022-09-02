<template>
	<view class="sheet-container">
		<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore" v-if="count">
			<view class="sheets-item" v-for="(item,index) in data.playlists" :key="index">
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
		</scroll-view>
		<text class="empty" v-else>暂未查询到任何有关数据...</text>
	</view>
</template>

<script>
	import { serachScrollMixin ,bottomControlMixin} from '@/common/mixins/mixins.js'
	export default {
		name:'Sheet',
		mixins:[serachScrollMixin,bottomControlMixin]
		
	}
</script>

<style scoped lang="scss">
	.scroll-v{
		margin: 0 auto;
		width: 94%;
		background-color: #fff;
		border-radius: 6px;
		font-size: 12px;
	}
	.sheets-item{
		margin-top: 10px;
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
	
</style>
