<template>
	<view class="song-sheet">
		<text class="title">{{title}}</text>
		<view class="song-sheet-box">
			<scroll-view scroll-x="true" class="scroll">
				<view class="sheet-box">
					<view class="sheet-item"   @tap="toPlayListDetail(item.creativeId)" v-for="(item,index) in songSheet" :key="item.creativeId">
						<image :src="item.uiElement.image.imageUrl" class="image"></image>
						<view class="mask">
							<text v-if="item.hasOwnProperty('resources')" class="play-count">{{$dealCount(item.resources[0].resourceExtInfo.playCount)}}</text>
							<text class="play-icon iconfont musicplayCircle"></text>
						</view>
						<view class="main-title">
							<text class="label-title" v-if="item.uiElement.hasOwnProperty('labelTexts')">{{(item.uiElement.labelTexts[0]).replace('热门','')}}</text>
							{{item.uiElement.mainTitle.title}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	export default {
		name:"SongSheet",
		props:{
			songSheet:{
				type:Array,
				default(){
					return []
				}
			},
			title:{
				type:String,
				default(){
					return '标题'
				}
			}
		},
		methods:{
			toPlayListDetail(id){
			
				uni.navigateTo({
					url:'../../pages/playListDetail/playListDetail?playListId='+id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.scroll{
		white-space: nowrap;
	}
	// .title{
	// 	margin-left: 10px;
	// }
	.main-title{
		.label-title{
			display: inline-block;
			padding: 2px 4px;
			color: #2539a6;
			font-size: 12px;
			transform-origin: 0;
			transform: scale(.8);
			border: 1px solid #cccccc;
			border-radius: 6px;
		}
	}
	// #ifdef MP-WEIXIN
	.song-sheet{
		margin: 0 auto;
		width: 96%;
	}
	// #endif
</style>
