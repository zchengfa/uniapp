<template>
	<view class="digital-album">
		<!-- 导航栏 -->
		<view class="nav">
			<view class="left">
				<text @tap="back" class="nav-item iconfont musicleftArrow"></text>
				<text class="nav-item nav-title">{{navTitle}}</text>
			</view>
		</view>
		<scroll-view scroll-y="true" class="album-scroll">
			<view class="album-content" :style="bgImg">
				<!-- 弹幕开关 -->
				<view class="bullet-scroll-switch">
					<switch style="transform: scale(.7);" color="#703800" class="switch" @change="switchChange" />
				</view>
				<!-- 专辑信息 -->
				<view class="album-detail">
					<image class="album-image" :src="album.album.coverUrl" mode="aspectFill"></image>
					<text class="album-name">{{album.album.albumName}}</text>
					<text class="author">{{album.album.artistName}} ></text>
					<text class="price" :style="{'color':album.style.color}">￥{{album.product.price}}</text>
					<text class="buy-btn" :style="{'background-color':album.style.color}">立即支持</text>
				</view>
				<!-- 专辑标签 -->
				<view class="album-tags">
					<text v-for="(item,index) in album.product.tags" :key="index" class="tag-item">{{item}}</text>
				</view>
				<!-- 其他相关 -->
				<view class="album-other">
					<!-- 菜单栏 -->
					<view class="album-menu">
						<view class="menu-box">
							<text class="menu-item">专辑详情</text>
						</view>
						<view class="menu-box">
							<text class="menu-item">活动</text>
						</view>
						<view class="menu-box">
							<text class="menu-item">评论</text>
						</view>
					</view>
					<!-- 产品描述 -->
					<view class="product-desc">
						<view class="desc-item" v-for="(item,index) in album.product.descr" :key="index">
							<text class="item-text" v-if="item.resource !== null">{{item.resource}}</text>
							<text class="br" v-else></text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import { digitalAlbum } from '@/common/api.js'
	export default {
		data() {
			return {
				navTitle:undefined,
				bgImg:undefined,
				album:{}
			}
		},
		methods: {
			back(){
				uni.navigateBack()
			},
			switchChange(e){
				console.log(e)
			}
		},
		onLoad(options) {
			let id = options.id
			digitalAlbum(id).then(res=>{
				console.log(res)
				if(res.code === 200){
					this.navTitle = res.album.artistName + '《' +res.album.albumName + '》'
					this.bgImg = 'background-image:url(' + res.style.bgImgUrl +');'
					this.album = res
					this.album.product.descr.map(item=>{
						if(item.resource.trim() === '<br>'){
							item.resource = null
						}
					})
				}
			})
		}
	}
</script>

<style scoped lang="scss">
.nav-item.nav-title{
	width: auto !important;
}
.bullet-scroll-switch{
	display: flex;
	justify-content: flex-end;
	align-items: center;
}
.album-scroll{
	color: #fff;
}
.album-detail{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.album-image{
		width: 50vw;
		height: 50vw;
	}
	.album-name{
		font-size: 18px;
	}
	.author{
		font-size: 15px;
		color: #a29e9e;
	}
	.album-name,.author{
		margin-top: 5px;
	}
	.price{
		margin: 10px 0;
		font-weight: bold;
	}
	.buy-btn{
		padding: 6px 0;
		width: 70%;
		text-align: center;
		border-radius: 18px;
	}
}
.album-tags{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	padding:10px;
	background-color: #1b1818;
	.tag-item{
		padding:2px 0;
		width: 50%;
		font-size: 12px;
		color: #a29e9e;
	}
	.tag-item::before{
		display: inline-block;
		width: 16px;
		height: 16px;
		content: '√';
		color: #1b1818;
		text-align: center;
		border-radius: 50%;
		background-color: #a29e9e;
		transform-origin: 0;
		transform: scale(.8);
	}
}
.album-other{
	.album-menu{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		border-bottom: 1px solid #dedede;
		.menu-box{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 33%;
			text-align: center;
			.menu-item{
				width: auto;
				padding: 10px 4px;
				border-bottom: 2px solid #98acd2;
			}
		}
	}
	.product-desc{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		.br{
			display: block;
			width: 100%;
			height: 15px;
		}
	}
}
/* #ifdef H5 */
.album-scroll{
	height: calc(100vh - 50px);
}
/* #endif */
/* #ifdef MP-WEIXIN */
.album-scroll{
	height: calc(100vh - 80px);
}
/* #endif */
</style>
