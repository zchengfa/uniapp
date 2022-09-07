<template>
	<view class="user-container">
		<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore">
			<view class="artist" v-if="count">
				<view class="sheets-item" v-for="(item,index) in data.userprofiles" :key="index">
					<view class="left">
						<view class="image-box">
							<image class="sheet-image" :src="item.avatarUrl"></image>
						</view>
						<view class="info">
							<view class="nick-name-box">
								<text class="artist-name">{{item.nickname}}</text>
								<image v-if="item.gender === 1" class="identity-image" src="~@/static/images/man.png" mode=""></image>
								<image v-else-if="item.gender === 2" class="identity-image" src="~@/static/images/woman.png" mode=""></image>
							</view>
							<text v-if="item.signature" class="signature">{{item.signature}}</text>
						</view>
					</view>
					<view class="right">
						<text class="care no-care" v-if="!item.followed">+关注</text>
						<text class="care had-care" v-else>√已关注</text>
					</view>
				</view>
			</view>
			<text class="empty" v-else>暂未查询到任何有关数据...</text>
		</scroll-view>
	</view>
</template>

<script>
	import {  searchScrollMixin ,bottomControlMixin } from '@/common/mixins/mixins.js'
	export default {
		name:'Sheet',
		mixins:[ searchScrollMixin ,bottomControlMixin]
		
	}
</script>

<style scoped lang="scss">
	.user-container{
		padding: 0 10px;
		background-color: #fff;
		text-align: center;
		font-size: 12px;
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
			.info{
				display: flex;
				justify-content: space-around;
				flex-direction: column;
				align-items: flex-start;
			}
			.had-care{
				border-color: #bebebe;
				color: #bebebe;
			}
			.left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.artist-name,.signature{
					display: block;
					margin-left: 10px;
					max-width: 200px;
					height: 16px;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					font-size: 14px;
				}
				.signature{
					margin-top: 6px;
					color: #939393;
					font-size: 12px;
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
			
		}
		.nick-name-box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.identity-image{
				margin-left: 2px;
				width: 12px;
				height: 12px;
				
			}
		}
	}
	
</style>
