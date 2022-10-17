<template>
	<view class="index-content">
		<!-- 顶部导航栏 -->
		<view class="top-box">
			<top-bar :defaultKeyword="keywordD" @centerTap="toSearch" @changeModal="changeModal"></top-bar>
		</view>
		<!-- 页面主内容 -->
		<scroll-view scroll-y="true" class="scroll-v" :style="scrollHeight">
			<swiper :indicator-dots="true" indicator-color="#fff" indicator-active-color="#ff215c" :autoplay="true" :interval="7000" :duration="1000" :circular="true">
				<swiper-item v-for="(item,index) in banners" :key="index">
					<view class="swiper-item" @tap="toDetail(item)">
						<image :src="item.pic" class="banner-image"></image>
						<text class="type-title">{{item.typeTitle}}</text>
					</view>
				</swiper-item>
			</swiper>
			<!-- 圆形滚动按钮菜单 -->
			<scroll-menu :scroll-menu="scrollMenu" class="scroll-menu"></scroll-menu>
			<!-- 推荐歌单 -->
			<SongSheetAutoScr v-if="recDefSheet.length" :title="recTitle" class="rec-sheet" :songSheet="recDefSheet" :defaultText="defaultAutoText" :autoSongSheet="recAutoSheet"></SongSheetAutoScr>
			<!-- 风格歌单推荐 -->
			<view class="style-list">
				<text class="title">{{styleTitle}}</text>
				<view class="song-sheet-box">
					<scroll-view scroll-x="true" class="scroll-style">
						<swiper class="sheet-box" :interval="3000" :duration="1000">
							<swiper-item class="style-item" v-for="(style,styleIndex) in styleSong" :key="styleIndex">
								<view @tap="playSong( child.resourceExtInfo.song.id )" class="item-children" v-for="(child,childIndex) in style.resources" :key="childIndex">
									<view class="image-box">
										<image class="style-image" :src="child.uiElement.image.imageUrl"></image>
									</view>
									<view class="song">
										<view class="top">
											<text class="song-name">{{child.resourceExtInfo.songData.name}}</text>
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
			<!-- 雷达歌单 -->
			<SongSheet :song-sheet="MGCSongSheet" class="mgc-song-sheet" :title="MGCTitle"></SongSheet>
			<!-- Look直播 -->
			<look-live :title="lookLiveTitle" :live="lookLive" class="live" v-if="lookLive.length"></look-live>
		</scroll-view>
		<!-- 底部音乐控制 -->
		<view class="bottom-control" v-show="isShowBottomControl" >
			<music-controller ></music-controller>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
		<!-- 小程序端的个人板块组件 -->
		<!-- #ifdef MP-WEIXIN -->
		<personal-modal @changeModal="changeModal" class="wechat-modal" :class="modalStatus?'modal-in':'modal-out'"></personal-modal>
		<!-- #endif -->
	</view>
</template>

<script>
	import { indexScrollMenu , indexSongSheet , banner , homePageData ,keywordDefault} from '@/common/api.js'
	import ScrollMenu from '@/components/ScrollMenu/ScrollMenu.vue'
	import SongSheet from '@/components/SongSheet/SongSheet.vue'
	import SongSheetAutoScr from '@/components/SongSheetAutoScr/SongSheetAutoScr.vue'
	import LookLive from '@/components/LookLive/LookLive.vue'
	import { bottomControlMixin ,playSongMixin} from '@/common/mixins/mixins.js'
	
	
	// #ifdef MP-WEIXIN
	import PersonalModal from '@/components/PersonalModal/PersonalModal.vue'
	// #endif
	
	export default {
		mixins:[bottomControlMixin,playSongMixin],
		data() {
			return {
				scrollMenu:[],
				recTitle:'',
				recSongSheet:[],
				recAutoSheet:{},
				recDefSheet:[],
				defaultAutoText:'',
				MGCSongSheet:[],
				banners:[],
				MGCTitle:'',
				lookLive:[],
				lookLiveTitle:'',
				styleSong:[],
				styleTitle:'',
				pageMusicPlay:false,
				keywordD:undefined,
				// #ifdef MP-WEIXIN
				modalStatus:false
				//#endif
				
			}
		},
		components:{
			ScrollMenu,
			SongSheet,
			SongSheetAutoScr,
			LookLive,
			//#ifdef MP-WEIXIN
			PersonalModal
			//#endif
		},
		onLoad() {
			
		},
		methods: {
			// #ifdef MP-WEIXIN
			changeModal(){
				this.modalStatus = !this.modalStatus
			},
			//#endif
			//点击歌曲，查看详情
			toDetail(item){
				if(item.song){
					
				 	this.playSongNoCoverPlayList(item.song)
				}
				else if(item.url){
					uni.navigateTo({
						url:'../common/common?url='+ item.url
					})
				}
				else if (item.video){
					console.log('这是视频')
				}
				
			},
			//获取首页滚动菜单数据
			getScrollMenu(){
				indexScrollMenu().then(res=>{
				
					if(res.data){
						this.scrollMenu = res.data
					}
				})
			},
			dealData(arr){
				arr.map(items=>{
					items.resources.map(item=>{
						item.resourceExtInfo.playCount = this.$dealCount(item.resourceExtInfo.playCount)
					})
				})
			},
			getHomePageData(){
				homePageData().then(res=>{
					let blocks = res.data.blocks
					//console.log(blocks)
					blocks.map(item=>{
						//轮播图
						if(item.blockCode === 'HOMEPAGE_BANNER'){
							this.banners = item.extInfo.banners
						}
						//推荐歌单
						else if(item.blockCode === 'HOMEPAGE_BLOCK_PLAYLIST_RCMD'){
							this.recTitle = item.uiElement.subTitle.title
							this.recSongSheet = item.creatives
						}
						//直播
						else if(item.blockCode === 'HOMEPAGE_BLOCK_LISTEN_LIVE'){
							this.lookLive = item.extInfo
							this.lookLiveTitle = item.uiElement.subTitle.title
						}
						//雷达歌单
						else if(item.blockCode === 'HOMEPAGE_BLOCK_MGC_PLAYLIST'){
							this.MGCTitle = item.uiElement.subTitle.title
							this.MGCSongSheet = item.creatives
						}
						//风格推荐
						else{
							this.styleSong = item.creatives
							this.styleTitle = item.uiElement.subTitle.title
							this.idList = item.resourceIdList
						}
					})
					
					this.dealData(this.MGCSongSheet)
					this.dealData(this.recSongSheet)
					
					this.recSongSheet.map(item=>{
						if(item.resources.length > 1){
							this.recAutoSheet = item
						}
						else{
							this.recDefSheet.push(item)
						}
					})
					
					this.defaultAutoText = this.recAutoSheet.resources[0].uiElement.mainTitle.title
				})
			},
			init(){
				this.getScrollMenu()
				this.getHomePageData()
				this.getKeyword()
			},
			getKeyword(){
				keywordDefault().then(res=>{
					if(res.code === 200){
						this.keywordD = res.data.showKeyword
					}
				})
			},
			toSearch(){
				uni.navigateTo({
					url:'../search/search?keyword='+encodeURIComponent(this.keywordD)
				})
			},
			//保存播放列表
			getPlayListData(){
				let list = []
				this.styleSong.map(item=>{
					item.resources.map(res=>{
						
						list.push(res.resourceExtInfo.song)
					})
				})
				
				return list
				
			}
		},
		created() {
			this.init()

		},
		
		
	}
</script>

<style scoped>
	
	.top-box{
		width: 100%;
		height: 50px;
		line-height: 32px;
		font-size: 14px;
		color: #fff;
	}
	.scroll-menu,.mgc-song-sheet,.rec-sheet,.live{
		position: relative;
		top:20px;
		margin: 0 auto ;
		width: 96%;
	}
	.swiper-item{
		position: relative;
		margin: 0 auto;
		padding: 10px 0;
		width: 94%;
		height: 150px;
	}
	.banner-image{
		width: 100%;
		height: 140px;
		border-radius: 8px;
	}
	.type-title{
		position: absolute;
		right: 5px;
		bottom:25px;
		padding:1px 2px;
		font-size: 12px;
		background-color: #fff;
		border-radius: 4px;
		/* 可以将字体颜色随背景一致 */
		mix-blend-mode: screen;
	}
	.style-list{
		position: relative;
		top:20px;
		margin: 0 auto;
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
		width: 78vw;
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
	}
	.song-author{
		
		color: #9a9a9a;
	}
	.sub-title,.song-author{
		max-width: 140px;
		white-space: nowrap;
		word-wrap: break-word;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	
	/* #ifdef MP-WEIXIN */
	.top-box{
		height: 80px;
	}
	.scroll-v{
		position: relative;
	
		height: calc(100vh - 70px);
	}
	.wechat-modal{
		position: absolute;
		left: 0;
		top:0;
		width: 100vw;
		height: 100vh;
		background-color: transparent;
		z-index: 1000;
	}
	.wechat-modal{
		transition-duration: .3s;
	}
	.modal-in{
		left: 50%;
		transform: translateX(-50%);
		
	}
	.modal-out{
		left: 0;
		transform: translateX(-100%);
	}
	
	/* #endif */
</style>
