<template>
	<view class="style-list">
		<text class="title">{{title}}</text>
		<view class="song-sheet-box">
			<scroll-view scroll-x="true" class="scroll-style">
				<swiper class="sheet-box" :interval="3000" :duration="1000">
					<swiper-item class="style-item" v-for="(style,styleIndex) in styleData" :key="styleIndex">
						<view @tap="playThisSong(child)" class="item-children" v-for="(child,childIndex) in style.resources" :key="childIndex">
							<view class="image-box">
								<image class="style-image" :src="child.uiElement.image.imageUrl"></image>
							</view>
							<view class="song">
								<view class="top">
									<text v-if="child.resourceType === 'song'" class="song-name">{{child.resourceExtInfo.songData.name}}</text>
									<text v-else class="song-name">{{child.uiElement.mainTitle.title}}</text>
								</view>
								<view class="bottom">
									<text class="sub-title" v-if="child.uiElement.subTitle">{{child.uiElement.subTitle.title}}</text>
									<text class="song-author">{{$dealAuthor(child.resourceExtInfo.artists,'name')}}</text>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { playSongMixin } from '@/common/mixins/mixins.js'
	export default {
		name:"StyleSongAlbum",
		mixins:[playSongMixin],
		props:{
			styleData:{
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
		data() {
			return {
				
			};
		},
		methods:{
			//保存播放列表
			getPlayListData(){
				let list = []
				this.$props.styleData.map(item=>{
					item.resources.map(res=>{
						item.creativeType === 'SONG_LIST_HOMEPAGE' ? list.push(res.resourceExtInfo.song) : null
						item.creativeType === 'NEW_SONG_HOMEPAGE' ? list.push(res.resourceExtInfo.songData) : null
					})
				})
				
				return list
				
			},
			playThisSong(child){
				if(child.resourceType === 'song'){
					
					this.playSong( child.resourceId,undefined,'../../pages/songDetail/songDetail' )
				}
				else{
					uni.showModal({
						title:'操作提示:',
						content:'您点击的选项属于'+ child.resourceType + '，等待作者完善！'
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.style-list{
		position: relative;
		top:20px;
		margin: 0 auto ;
		width: 96%;
	}
.scroll-style{
		height: 200px;
	}
	.style-image{
		width: 50px;
		height: 50px;
		border-radius: 6px;
	}
	.sheet-box{
		width: 96vw;
		font-size: 14px;
	}
	.style-item{
		width: 96% !important;
	}
	.item-children{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin: 10px 0;
	}
	.song{
		margin-left: 2vw;
		width: 76vw;
	}
	.bottom{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.sub-title{
		color: #d40000;
		background-color: #ffe7de;
		border-radius: 4px;
		font-size: 12px;
		transform: scale(.8);
		transform-origin: 0;
	}
	.song-author{
		font-size: 14px;
		color: #9a9a9a;
	}
	.sub-title,.song-author{
		max-width: 140px;
	}
	.song-name{
		display: block;
		max-width: 280px;
	}
	.sub-title,.song-author,.song-name{
		
		white-space: nowrap;
		word-wrap: break-word;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>