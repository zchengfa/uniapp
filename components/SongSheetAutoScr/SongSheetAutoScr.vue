<template>
	<view class="song-auto-scr">
		<text class="title skeleton-rect">{{title}}</text>
		<view class="song-sheet-box">
			<scroll-view scroll-x="true" class="scroll">
				<view class="sheet-box">
					<view class="sheet-item">
						<swiper class="swiper" @change="change($event)" :indicator-dots="false" vertical :autoplay="true" :interval="4000" :duration="1000" :circular="true">
							<swiper-item  v-for="(auto,autoIndex) in autoSongSheet.resources" @tap="toPlayListDetail(auto.resourceId)" :key="autoIndex">
								<view class="swiper-item " :class="{'skeleton-fillet':autoIndex === 0}">
									<view class="image">
										<image-loader :src="auto.uiElement.image.imageUrl"></image-loader>
									</view>
								</view>
							</swiper-item>
							
						</swiper>
						<image class="mask-image skeleton-rect" src="~@/static/images/infinite.png"></image>
						<text v-if="currentText" class="main-title skeleton-rect">{{currentText}}</text>
						<text v-else class="main-title skeleton-rect">{{defaultText}}</text>
					</view>
					<view class="sheet-item" @tap="toPlayListDetail(item.resources[0].resourceId)" v-for="(item,index) in songSheet" :key="index">
						<view class="image">
							<image-loader :src="item.uiElement.image.imageUrl"></image-loader>
						</view>
						<view class="mask skeleton-fillet">
							<text class="play-count skeleton-rect">{{item.resources[0].resourceExtInfo.playCount}}</text>
							<text class="play-icon iconfont musicplayCircle skeleton-rect"></text>
						</view>
						<text class="main-title skeleton-rect">{{item.uiElement.mainTitle.title}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import ImageLoader from '@/components/common/ImageLoader.vue'
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
		components:{
			ImageLoader
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
