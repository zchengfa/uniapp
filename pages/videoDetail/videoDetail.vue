<template>
	<view class="video-detail">
		<view class="nav-place">
			<view class="nav flex-box">
				<view class="left nav-left">
					<text class="iconfont musicleftArrow back" @tap="back"></text>
				</view>
			</view>
		</view>
		<video id="mv-video" :src="url" autoplay="true" loop="true" objectFit="fill"></video>
		<view class="video-info">
			<view class="info-top">
				<view class="operation">
					<view class="operation-item">
						<text class="iconfont controller-good"></text>
						<text class="item-text" >{{$dealCount(mvInfo.likedCount)}}</text>
					</view>
					<view class="operation-item">
						<text class="iconfont controller-comments"></text>
						<text class="item-text" >{{$dealCount(mvInfo.commentCount)}}</text>
					</view>
					<view class="operation-item">
						
						<text class="iconfont musicshare"></text>
						<text class="item-text" >{{$dealCount(mvInfo.shareCount)}}</text>
					</view>
					<view class="operation-item">
						<text class="iconfont controller-add"></text>
						<text class="item-text" >收藏</text>
					</view>
					<view class="operation-item song">
						<view class="pic-box">
							<image :src="detail.cover" class="cover" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="info">
					<view class="artist-box info-item">
						<view class="artist-avatar">
							<image class="artist-ava" v-for="(art,artIndex) in detail.artists" :src="art.img1v1Url" :key="artIndex"></image>
						</view>
						<text class="artist-name">{{$dealAuthor(detail.artists,'name')}}</text>
					</view>
					<view class="mv-name-desc  info-item" @tap="showDesc">
						<text class="tag">MV</text>
						<text class="mv-name">{{detail.name}}</text>
						<text class="top-angle angle" v-show="!isShowDesc && detail.desc"></text>
					</view>
					<view class="desc-box" v-show="isShowDesc">
						<text @tap="showDesc">{{detail.desc}}</text>
						<text class="bottom-angle angle"></text>
					</view>
				</view>
			</view>
			<view class="info-bottom">
				<input class="input" type="text" placeholder="发条评论支持一下吧~" />
			</view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import '@/common/controller.css'
	import { mvInfo , mvUrl , mvDetail} from '@/common/api.js'
	
	export default {
		data() {
			return {
				mvId:undefined,
				mvInfo:{},
				url:'',
				detail:{},
				isShowDesc:false
			}
		},
		methods: {
			back(){
				uni.navigateBack()
			},
			getMvInfo(id){
				mvInfo(id).then(res=>{
					if(res.code === 200){
						this.mvInfo = res
					}
				})
			},
			getMvUrl(id){
				mvUrl(id).then(res=>{
					if(res.code === 200){
						this.url = res.data.url
					}
					console.log(res)
				})
			},
			getMvDetail(id){
				mvDetail(id).then(res=>{
					if(res.code === 200){
						this.detail = res.data
					}
					console.log(res)
				})
			},
			init(id){
				this.getMvUrl(id)
				this.getMvInfo(id),
				this.getMvDetail(id)
			},
			showDesc(){
				this.isShowDesc = !this.isShowDesc
			}
		},
		onLoad(options) {
			this.mvId = options.mvId
			
			this.init(this.mvId)
		}
	}
</script>

<style scoped>
	.video-detail{
		width: 100%;
		height: 100vh;
		background-color: #000;
		color: #fff;
		text-align: center;
	}
	.iconfont{
		font-size: 26px;
	}
	/* #ifdef H5 */
	.nav-place{
		width: 100%;
		height: 44px;
	}
	.nav{
		height: 44px;
	}
	.nav-left{
		
		height: 100%;
		text-align: left;
	}
	/* #endif */
	.back{
		display: inline-block;
		width: 40px;
		height: 100%;
		font-weight: bolder;
		text-align: center;
		line-height: 44px;
	}
	#mv-video{
		position: absolute;
		top:40%;
		left: 0;
		width: 100%;
		transform: translateY(-50%);
		z-index: 999;
		
	}
	.video-info{
		position: absolute;
		
		bottom: 0;
		width: 100%;
		height: 45%;
		z-index: 999;
	}
	.info-top{
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		height: 86%;	
	}
	.operation{
		width: 14%;
		height: 100%;
	}
	.operation,.operation-item{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	.item-text{
		margin-top: 6px;
		font-size: 12px;
	}
	.pic-box{
		width: 36px;
		height: 36px;
		border: 5px solid #ff5500;
		border-radius: 50%;
	}
	.cover{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.info{
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding-left: 10px;
		font-size: 12px;
	}
	.info-item{
		margin-bottom: 10px;
	}
	.artist-box{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.artist-ava{
		display: inline-block;
		width: 30px;
		height: 30px;
		
		border-radius: 50%;
	}
	.artist-name{
		margin-left: 4px;
		font-weight: bold;
	}
	.mv-name-desc{
		display: flex;
	}
	.mv-name{
		max-width: 90%;
		text-align: left;
		
	}
	.tag{
		margin-right: 4px;
		display: inline-block;
		padding: 0 2px;
		max-height: 16px;
		background-color: #999999;
		border-radius: 2px;
		color: #ff0000;
	}
	.desc-box{
		max-width: 90%;
		text-align: left;
	}
	.angle{
		width: 0;
		height: 0;
		border: 6px solid transparent;
	}
	.bottom-angle{
		display: inline-block;
		border-bottom-color: #fff;
	}
	.top-angle{
		display: flex;
		margin-left: 4px;
		position: relative;
		top: 6px;
		border-top-color: #fff;
	}
	.info-bottom{
		display: flex;
		align-items: center;
		padding-left: 10px;
		width: 100%;
		height: 14%;
	}
	.input{
		width: 80%;
		text-align: left;
		font-size: 13px;
	}
	/* #ifdef MP-WEIXIN */
	.nav-place,.nav{
		height: 80px;
	}

	.nav-left{
		position: relative;
		top:20px;
		text-align: left;
	}
	/* #endif */
</style>
