<template>
	<view class="video-detail">
		<view class="nav-place">
			<view class="nav flex-box">
				<view class="left nav-left">
					<text class="iconfont musicleftArrow back" @tap="back"></text>
				</view>
			</view>
		</view>
		<view  id="mv-video" class="my-video" >
			<video style="width: 100%;" :src="url" autoplay="true" loop="true" objectFit="contain" @ended="videoEnded"></video>
		</view>
		<view class="video-info">
			<view class="info-top">
				<view class="operation">
					<view class="operation-item">
						<text class="iconfont controller-good"></text>
						<text class="item-text" >{{$dealCount(vInfo.likedCount)}}</text>
					</view>
					<view class="operation-item">
						<text class="iconfont controller-comments"></text>
						<text class="item-text" >{{$dealCount(vInfo.commentCount)}}</text>
					</view>
					<view class="operation-item">
						
						<text class="iconfont musicshare"></text>
						<text class="item-text" >{{$dealCount(vInfo.shareCount)}}</text>
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
						<view class="artist-avatar" v-if="Number(vId)">
							<image class="artist-ava" v-for="(art,artIndex) in detail.artists" :src="art.img1v1Url" :key="artIndex"></image>
						</view>
						<view class="artist-avatar" v-else>
							<image class="artist-ava" :src="detail.avatarUrl"></image>
						</view>
						<text class="artist-name" v-if="Number(vId)">{{$dealAuthor(detail.artists,'name')}}</text>
						<text class="artist-name" v-else>{{nickname}}</text>
					</view>
					<view class="mv-name-desc  info-item" @tap="showDesc">
						<text class="tag" v-if="Number(vId)">MV</text>
						<text class="tag" v-else>视频</text>
						<text class="mv-name">{{detail.name || detail.title}}</text>
						<text class="top-angle angle" v-if="!isShowDesc && (detail.desc || detail.description)"></text>
					</view>
					<view class="desc-box" v-if="isShowDesc">
						<text @tap="showDesc">{{detail.desc || detail.description}}</text>
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
	import { vInfo , vUrl , vDetail} from '@/common/api.js'
	
	export default {
		data() {
			return {
				vId:undefined,
				vInfo:{},
				url:'',
				detail:{},
				isShowDesc:false,
				nickname:''
			}
		},
		methods: {
			videoEnded(){
				console.log('放完了')
			},
			back(){
				uni.navigateBack()
			},
			getVInfo(id){
				vInfo(id).then(res=>{
					if(res.code === 200){
						this.vInfo = res
					}
				})
			},
			getVUrl(id){
				vUrl(id).then(res=>{
					console.log(res)
					if(res.code === 200){
						if(Number(id)){
							this.url = res.data.url
						}
						else{
							this.url = res.urls[0].url
						}
					}
					
				})
			},
			getVDetail(id){
				vDetail(id).then(res=>{
					if(res.code === 200){
						this.detail = res.data
						if(!Number(id)){
							
							this.nickname = res.data.creator.nickname
						}
					}
					console.log(res)
				})
			},
			init(id){
				this.getVUrl(id)
				this.getVInfo(id),
				this.getVDetail(id)
			},
			showDesc(){
				this.isShowDesc = !this.isShowDesc
			}
		},
		onLoad(options) {
			this.vId = options.vId
			
			this.init(this.vId)
		}
	}
</script>

<style scoped>
	.video-detail{
		position: relative;
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
	/* #ifdef APP */
	.mv-video{
		position: absolute;
		top:40%;
		left: 0;
		width: 100%;
		transform: translateY(-50%);
		z-index: 999;
		
	}
	/* #endif */
	
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
		max-height: 180px;
		text-align: left;
		overflow: scroll;
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
	/* #ifdef MP-WEIXIN || APP */
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
