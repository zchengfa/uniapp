<template>
	<view class="look-live">
		<text class="title">{{title}}</text>
		<view class="song-sheet-box">
			<scroll-view scroll-x="true" class="scroll">
				<view class="sheet-box">
					<view class="sheet-item" v-for="(item,index) in live" :key="item.liveId" >
						<image :src="item.verticalCover || item.cover" class="image"></image>
						<view class="mask">
							<text class="play-count live-tag">{{item.coverTag || item.privateTag}}</text>
						</view>
						<text class="main-title">{{item.title}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"LookLive",
		props:{
			title:{
				type:String,
				default(){
					return '标题'
				}
			},
			live:{
				type:Array,
				default(){
					return []
				}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
	.sheet-item{
		height: 180px;
		background-color: #90747e;
		text-align: center;
		color: #fff;
		border-radius: 6px;
	}
	.mask{
		flex-direction: row;
	}
	.image{
		background-size: contain;
	}
	.live-tag{
		margin-top: 6px;
		margin-left: 6px;
		display: inline-block;
		padding:1px 10px;
		height: 20px;
		line-height: 18px;
		border-radius: 4px;
		background-color: rgba(0,0,0,.2);
	}
</style>
