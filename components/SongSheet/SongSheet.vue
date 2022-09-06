<template>
	<view class="song-sheet">
		<text class="title">{{title}}</text>
		<view class="song-sheet-box">
			<scroll-view scroll-x="true" class="scroll">
				<view class="sheet-box">
					<view class="sheet-item"   @tap="toPlayListDetail(item.creativeId)" v-for="(item,index) in songSheet" :key="item.creativeId">
						<image :src="item.uiElement.image.imageUrl" class="image"></image>
						<view class="mask">
							<text class="play-count">{{item.resources[0].resourceExtInfo.playCount}}</text>
							<text class="play-icon iconfont musicplayCircle"></text>
						</view>
						<text class="main-title">{{item.uiElement.mainTitle.title}}</text>
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

<style scoped>
	.scroll{
		white-space: nowrap;
	}
	
</style>
