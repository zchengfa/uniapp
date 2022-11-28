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
		<view class="menu-container">
			<scroll-view scroll-x="true" class="scroll-x" scroll-left="0" :scroll-into-view="into" scroll-with-animation="true">
				<view class="menu-box">
					<view v-for="(item,index) in menu" :key="index" class="menu-item" :id="item.into">
						<text class="menu-text" @tap="searchByTag(item.type,index)">{{item.name}}</text>
						<text v-show="currentIndex===index" :class="{'menu-active':currentIndex===index}"></text>
					</view>
				</view>
			</scroll-view>
			<view class="all-tag">
				<image src="../../../static/images/all_tag.png" class="all-tag-img" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import { playlistHotCate , topPlaylist} from '@/common/api.js'
	
	export default {
		data() {
			return {
				menu:[],
				currentIndex:0,
				into:'t0',
				tag:'推荐'
			}
		},
		methods: {
			back(){
				uni.navigateBack()
			},
			searchByTag(tag,index){
				this.currentIndex = index
				this.into = 't'+ (index-2)
				this.tag = tag
			},
			listCate(){
				playlistHotCate().then(res=>{
					if(res.code === 200){
						this.menu.push({
							'id':0,
							'name':'推荐',
							'into':'t0'
						})
						this.menu.push({
							'id':1,
							'name':'精品',
							'into':'t1'
						})
						res.tags.map((item,index)=>{
							this.menu.push({
								'id':(item.id +2),
								'name':item.name,
								'into':'t'+(index+2)
							})
						})
					}
					
				})
			},
			getCateDetail(tag){
				topPlaylist(tag).then(res=>{
					console.log(res)
				})
			},
			init(){
				this.listCate()
			}
		},
		created() {
			this.init()
			this.getCateDetail('华语')
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
</style>
