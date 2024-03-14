<template>
	<view class="songer-container">
		<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore">
			<view class="artist" v-if="count">
				<view class="sheets-item" v-for="(item,index) in data.artists" :key="index">
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
			</view>
			<view class="empty" v-else>
				<image class="empty-img" src="../../../../static/images/empty.png" mode="aspectFit"></image>
				<text class="empty-msg">暂无数据</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { searchScrollMixin ,bottomControlMixin} from '@/common/mixins/mixins.js'
	export default {
		name:'Sheet',
		mixins:[searchScrollMixin ,bottomControlMixin]
		
	}
</script>

<style scoped lang="scss">
	.songer-container{
		padding: 0 10px;
		background-color: #fff;
		text-align: center;
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
</style>
