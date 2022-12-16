<template>
	<view class="song-auto-scr">
		<text class="title">{{title}}</text>
		<view class="song-sheet-box">
			<scroll-view scroll-x="true" class="scroll">
				<view class="sheet-box">
					<view class="sheet-item">
						<swiper class="swiper" @change="change($event)" :indicator-dots="false" vertical :autoplay="true" :interval="4000" :duration="1000" :circular="true">
							<swiper-item  v-for="(auto,autoIndex) in autoSongSheet.resources" @tap="toPlayListDetail(auto.resourceId)" :key="autoIndex">
								<view class="swiper-item">
									<image class="image" :src="auto.uiElement.image.imageUrl" ></image>
								</view>
							</swiper-item>
							
						</swiper>
						<image class="mask-image" src="~@/static/images/infinite.png"></image>
						<text v-if="currentText" class="main-title">{{currentText}}</text>
						<text v-else class="main-title">{{defaultText}}</text>
					</view>
					<view class="sheet-item" @tap="toPlayListDetail(item.resources[0].resourceId)" v-for="(item,index) in songSheet" :key="index">
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
	export default {
		name:"SongSheetAutoScr",
		props:{
			songSheet:{
				type:Array,
				default(){
					return []
				}
			},
			autoSongSheet:{
				type:Object,
				default(){
					return []
				}
			},
			title:{
				type:String,
				default(){
					return '标题'
				}
			},
			defaultText:{
				type:String,
				default(){
					return '默认文本'
				}
			}
		},
		data() {
			return {
				currentText:''
			};
		},
		methods:{
			change(e){
				this.currentText = this.autoSongSheet.resources[e.detail.current].uiElement.mainTitle.title
			},
			toPlayListDetail(id){
				uni.navigateTo({
					url:'../../pages/playListDetail/playListDetail?playListId='+id
				})
			}
		}
	}
</script>

<style scoped>
	.song-auto-scr{
		padding: 0 10px;
	}
	
	.mask-image{
		position: absolute;
		left: 75%;
		top: 0;
		width: 32px;
		height: 32px;
	}
</style>
