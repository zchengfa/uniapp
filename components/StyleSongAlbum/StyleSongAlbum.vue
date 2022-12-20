<template>
	<view class="style-list">
		<text class="title">{{title}}</text>
		<view class="song-sheet-box">
			<scroll-view scroll-x="true" class="scroll-style" :class="{'toplist-scroll':isToplist}">
				<swiper class="sheet-box" :interval="3000" :duration="1000">
					<swiper-item class="style-item" v-for="(style,styleIndex) in styleData" :key="styleIndex">
						<view class="item-container" :class="{'toplist-item-container':isToplist}">
							<view class="swiper-item-title" v-if="isToplist">
								<text class="item-title">{{style.uiElement.mainTitle.title}} > </text>
								<text class="title-desc">{{style.uiElement.mainTitle.titleDesc}}</text>
							</view>
							<view @tap="isToplist ? playToplist(style,child.resourceId,styleIndex)  : playThisSong(child)" class="item-children" v-for="(child,childIndex) in style.resources" :key="childIndex">
								<view class="image-box">
									<image class="style-image" :src="child.uiElement.image.imageUrl" mode="aspectFill"></image>
								</view>
								<view class="song" :class="{'toplist-song':isToplist}">
									<view class="no-box" v-if="isToplist">
										<text class="No" :class="{'No-two':childIndex+1 === 2}">{{childIndex+1}}</text>
									</view>
									<view class="song-item-box">
										<view class="top">
											<text v-if="child.resourceType === 'song'" class="song-name">{{child.resourceExtInfo.songData.name}}</text>
											<text v-else class="song-name">{{child.uiElement.mainTitle.title}}</text>
										</view>
										<view class="bottom">
											<text class="sub-title" v-if="child.uiElement.subTitle">{{child.uiElement.subTitle.title}}</text>
											<text class="song-author">{{$dealAuthor(child.resourceExtInfo.artists,'name')}}</text>
										</view>
									</view>
									<view class="song-label" v-if="isToplist && child.uiElement.labelText.text !==null">
										<text class="label-text" :class="child.uiElement.labelText.textColor">{{child.uiElement.labelText.text}}</text>
									</view>
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
	import { songDetail } from '@/common/api.js'
	import { mapGetters } from 'vuex'
	
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
			},
			isToplist:{
				type:Boolean,
				default(){
					return false
				}
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			...mapGetters(['musicList'])
		},
		methods:{
			//保存播放列表
			getPlayListData(){
				let list = []
				this.$props.styleData.map(item=>{
					item.resources.map(res=>{
						item.creativeType === 'SONG_LIST_HOMEPAGE' ? list.push(res.resourceExtInfo.song) : null
						item.creativeType === 'NEW_SONG_HOMEPAGE' ? list.push(res.resourceExtInfo.songData) : null
						item.creativeType === 'toplist' ? list.push(res.resourceExtInfo.songData) : null
					})
				})
				
				return list
				
			},
			playThisSong(child){
				if(child.resourceType === 'song'){
					
					this.playSong( child.resourceId,undefined,'../../pages/songDetail/songDetail' )
				}
				else if(child.resourceType === "album"){
					uni.navigateTo({
						url:'/pages/playListDetail/playListDetail?playListId='+ child.resourceId + '&resourceType=专辑'
					})
				}
				else if(child.resourceType === "digitalAlbum"){
					uni.showModal({
						title:'操作提示:',
						content:'您点击的选项属于数字专辑等待作者完善！'
					})
				}
				else{
					uni.showModal({
						title:'操作提示:',
						content:'您点击的选项属于'+ child.resourceType + '，等待作者完善！'
					})
				}
			},
			playToplist(data,id,index){
				
				let ids = data.creativeExtInfoVO.topListSongIds
				let count = 0
				if(this.musicList.length){
					this.musicList.map(item=>{
						item.id === Number(id) ? count++ : null
					})
					
					if(!count){
						getSongsData(this)
					}
				}
				else{
					getSongsData(this)
				}
				
				
				this.playSong(id,index,'../../pages/songDetail/songDetail',false)
				
				function getSongsData(that){
					songDetail(ids).then(res=>{
						if(res.code === 200) {
							that.$store.dispatch('musicList',JSON.stringify(res.songs))
						}
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.style-list{
		
		margin: 0 auto ;
		width: 96%;
	}
	.swiper-item-title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.item-title{
			font-weight: bolder;
		}
		.title-desc{
			font-size: 12px;
			color: #9a9a9a;
		}
	}
	.toplist-item-container{
		width: 92%;
		padding: 10px;
		background-color: #fff;
		border-radius: 8px;
	}
	.toplist-scroll.scroll-style{
		height: 240px;
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 2vw;
		width: 76vw;
		.song-item-box{
			flex: 1;
		}
		.no-box,.song-label{
			width: 24px;
			height: 100%;
		}
		.no-box{
			text-align: center;
			font-weight: bolder;
			color: #b95c00;
		}
		.No-two{
			color: #666699;
		}
		.song-label{
			font-size: 12px;
		}
		.colorPrimary1{
			color: #d40000;
		}
		.colorSecondary7{
			color: #00f000;
		}
	}
	.toplist-song{
		margin-left: 0;
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
		max-width: 200px;
	}
	.sub-title,.song-author,.song-name{
		
		white-space: nowrap;
		word-wrap: break-word;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>