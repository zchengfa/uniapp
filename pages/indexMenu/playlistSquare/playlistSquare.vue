<template>
	<view class="playlist-square">
		<!-- 导航栏 -->
		<view class="nav">
			<view class="left">
				<text @tap="back" class="nav-item iconfont musicleftArrow"></text>
				<text class="nav-item nav-name">歌单广场</text>
			</view>
		</view>
		<!-- 滚动菜单 -->
		
		<scroll-view scroll-y="true" class="scroll-v "  :style="scrollHeightNoTab">
			<view class="scroll-menu">
				<view class="menu-container">
					<scroll-view scroll-x="true" class="scroll-x" scroll-left="0" :scroll-into-view="into" scroll-with-animation="true">
						<view class="menu-box">
							<view v-for="(item,index) in menu" :key="index" class="menu-item" :id="item.into">
								<text class="menu-text" @tap="searchByTag(item.name,index)">{{item.name}}</text>
								<text v-show="currentIndex===index" :class="{'menu-active':currentIndex===index}"></text>
							</view>
						</view>
					</scroll-view>
					<view class="all-tag">
						<image src="../../../static/images/all_tag.png" class="all-tag-img" mode="aspectFit"></image>
					</view>
				</view>
				<swiper class="result-scroll" :style="scrollHeight" :indicator-dots="false" :autoplay="false"  :duration="1000" @change="changeItem" :current="currentIndex">
					<swiper-item v-for="(mItem,mIndex) in menu" :key="mIndex">
						<scroll-view scroll-y="true" class="scroll-v" :style="scrollHeight" @scrolltolower="loadMore">
							<view class="list-container">
								<view class="list-item" v-for="(item,index) in list[mItem.name]" :key="index"  @tap="toPlayListDetail(item.id)">
									<image :src="item.coverImgUrl" mode="aspectFit" class="list-img"></image>
									<text class="list-name main-title">{{item.name}}</text>
									<view class="count-box" :style="{'background-color':item.bgColor}">
										<text class="iconfont musicplayCircleOne"></text>
										<text class="play-count">{{$dealCount(item.playCount)}}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</scroll-view>
		<!-- 底部音乐控制 -->
		<view class="bottom-control" v-show="isShowBottomControl" >
			<music-controller FMPath="../FM/FM" songDetailPath="../../songDetail/songDetail"></music-controller>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import { playlistHotCate , topPlaylist} from '@/common/api.js'
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	
	export default {
		mixins:[bottomControlMixin],
		data() {
			return {
				menu:[],
				currentIndex:0,
				into:'t0',
				tag:'推荐',
				list:{},
				more:{},
				offset:{}
			}
		},
		methods: {
			back(){
				uni.navigateBack()
			},
			toPlayListDetail(id){
				uni.navigateTo({
					url:'../../playListDetail/playListDetail?playListId='+id
				})
			},
			searchByTag(tag,index){
				this.currentIndex = index
				this.into = 't'+ (index)
				this.tag = tag
				this.getCateDetail(tag)
				
			},
			listCate(){
				playlistHotCate().then(res=>{
					if(res.code === 200){
						this.menu.push({
							'id':0,
							'name':'推荐',
							'into':'t0'
						})
						res.tags.map((item,index)=>{
							this.menu.push({
								'id':(item.id +1),
								'name':item.name,
								'into':'t'+(index+1)
							})
							
						})
						uni.setStorageSync('playlist_square',JSON.stringify(this.menu))
						this.menu.map(item=>{
							this.getCateDetail(item.name)
							
						})
					}
					else{
						uni.getStorageSync('playlist_square') ? this.menu = uni.getStorageSync('playlist_square') : null
					}
					
				})
			},
			getCateDetail(tag){
				topPlaylist(tag).then(res=>{
					
					if(res.code === 200){
						this.$set(this.list,tag,this.$color(res.playlists,'bgColor'))
						
						this.more[tag] = res.more
						this.offset[tag] = 0
					}
				})
			},
			changeItem(e){
				this.into = 't' + e.detail.current
				this.currentIndex = e.detail.current
				this.tag = this.menu[e.detail.current].name
			},
			
			loadMore(){
				uni.showLoading({
					title:'加载更多歌单...'
				})
				this.offset[this.tag] +=21
				topPlaylist(this.tag,this.offset[this.tag]).then(res=>{
					if(res.code === 200){
						this.list[this.tag].push(...this.$color(res.playlists,'bgColor'))
						this.more[this.tag] = res.more
						uni.hideLoading()
					}
					else{
						let timer = setTimeout(()=>{
							uni.hideLoading()
							clearTimeout(timer)
						},0)
					}
				})
			},
			init(){
				this.listCate()
			}
		},
		created() {
			this.init()
		}
	}
</script>

<style scoped lang="scss">
.nav{
	color: #000;
	.nav-name{
		width: 64px;
	}
}
.menu-container{
	position: relative;
	width: 100%;
	height: 40px;
}
.scroll-x{
		
		width: 86%;
		white-space: nowrap;
		.menu-box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			
			.menu-item{
				margin-left: 10px;
				margin-right: 20px;
				height: 40px;
				font-size: 14px;
				line-height: 40px;
			}
		}
	}
.scroll-v{
	height:calc(100vh - 50px) ;
}	
.scroll-menu{
	height: 100%;
}
.result-scroll{
	height: calc(100% - 40px);
}
.all-tag{
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top:50%;
	right: 6px;
	width: 40px;
	height: 26px;
	transform: translateY(-50%);
	.all-tag-img{
		width: 20px;
		height: 20px;
	}	
}
.list-container{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto;
	width: 94%;
	.list-item{
		margin-bottom: 15px;
		position: relative;
		width: 30vw;
		.list-img{
			width: 100%;
			height: 30vw;
			border-radius: 10px;
		}
		.list-name{
			margin-top: 0;
			height: 38px;
			font-size: 14px;
		}
		.count-box{
			display: flex;
			justify-content: space-around;
			align-items: center;
			position: absolute;
			right: 2px;
			top:6px;
			padding:2px 6px;
			font-size: 12px;
			border-radius: 20px;
			color: #fff;
			transform: scale(.9);
			.iconfont{
				transform: scale(.7);
			}
		}
	}
}
.list-container::after{
	margin-bottom: 20px;
	content: '';
	width: 30vw;
}
.bottom-control{
	bottom:0;
}
</style>
