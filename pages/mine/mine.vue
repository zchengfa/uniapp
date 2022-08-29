<template>
	<view class="mine-container">
		<!-- 导航栏 -->
		<view class="top-box">
			<top-bar></top-bar>
		</view>
		
		<scroll-view scroll-y="true" :style="scrollHeight" class="scroll-v">
			<!-- 用户资料部分 用户未登录，展示引导用户登录模块，已登录则展示用户基本信息-->
			<view class="user">
				<view class="guide-login">
					<text class="iconfont mine-taogongzi"  v-if="!$checkLogin()"></text>
					<image :src="$store.state.user.userInfo.avatarUrl" class="avatar" v-if="$checkLogin()"></image>
					<text class="nick-name" >{{$store.state.user.userInfo.nickname}}</text>
					<text class="login-tap" @tap="toLogin"  v-if="!$checkLogin()">立即登录 ></text>
				</view>
			</view>
			<!-- 用户相关 -->
			<view class="user-operation">
				<view class="history-play operation-item">
					<text class="iconfont mine-24gf-playCircle"></text>
					<text class="text">最近播放</text>
				</view>
				<view class="local operation-item">
					<text class="iconfont mine-bendisucai"></text>
					<text class="text">本地/下载</text>
				</view>
				<view class="yun operation-item">
					<text class="iconfont mine-yunpan"></text>
					<text class="text">云盘</text>
				</view>
				<view class="had-buy operation-item">
					<text class="iconfont mine-gaiicon-"></text>
					<text class="text">已购</text>
				</view>
				<view class="friend operation-item">
					<text class="iconfont mine-haoyou"></text>
					<text class="text">我的好友</text>
				</view>
				<view class="collection operation-item">
					<text class="iconfont mine-xingxing"></text>
					<text class="text">收藏和赞</text>
				</view>
				<view class="player operation-item">
					<text class="iconfont mine-KJ_039"></text>
					<text class="text">我的播客</text>
				</view>
				<view class="bottle operation-item">
					<text class="iconfont mine-guojiangguanzi"></text>
					<text class="text">音乐罐子</text>
				</view>
			</view>
			<!-- 我喜欢的音乐 -->
			<view class="love-mode">
				<view class="love-music">
					<view class="love-image">
						<text class="iconfont controller-love"></text>
					</view>
					<view class="love-text">
						<text class="title-love">我喜欢的音乐</text>
						<text class="count">{{666}}首</text>
					</view>
				</view>
				<view class="mode">
					<text>心动模式</text>
				</view>
			</view>
			<!-- 为你推荐 -->
			<view class="rec">
				<text class="title">为你推荐</text>
				<view class="rec-sheet">
					<view class="rec-sheet-item" v-for="(item,index) in recSheet" :key="index">
						<image class="sheet-image" :src="item.picUrl" mode="aspectFit"></image>
						<view class="mask">
							<text>{{$dealCount(item.playCount)}}</text>
							<text class="iconfont musicplayCircle"></text>
						</view>
						<text class="rec-name">{{item.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bottom-control" v-show="isShowBottomControl">
			<music-controller></music-controller>
		</view>
	</view>
</template>

<script>
	import '@/common/mine.css'
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	import { recommendSongSheet } from '@/common/api.js'
	
	export default {
		mixins:[bottomControlMixin],
		data() {
			return {
				recSheet:[]
			}
		},
		methods: {
			getRec(){
				recommendSongSheet().then(res=>{
					if(res.code === 200){
						this.recSheet = res.result
					}
					console.log(res)
				})
			},
			toLogin(){
				uni.navigateTo({
					url:'../login/login'
				})
			}
		},
		created() {
			this.getRec()
		}
	}
</script>

<style scoped>
.mine-container{
	width: 100%;
	height:calc(100vh - 50px);
	background-color: #e7e7e7;
}
.top-box{
	width: 100%;
	height: 50px;
}
/* #ifdef MP-WEIXIN */
.top-box{
	width: 100%;
	height: 80px;
}
/* #endif */
.scroll-v{
	margin: 0 auto;
	width: 94%;
}
.user{
	position: relative;
	top:50px;
	height: 100px;
	text-align: center;
	background-color: #fff;
	border-radius: 6px;
}
.guide-login{
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.login-tap{
	position: relative;
	top:-30px;
	font-weight: bolder;
}
.mine-taogongzi.iconfont,.avatar{
	background-color: #ffbed2;
	border-radius: 50%;
	font-size: 70px;
	transform: translateY(-50%);
}
.avatar{
	width: 60px;
	height: 60px;
}
.user-operation{
	position: relative;
	top:65px;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	align-items: center;
	background-color: #fff;
	border-radius: 6px;
}
.operation-item{
	margin: 20px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 25%;
	color: #ff0000;
}
.iconfont{
	font-size: 30px;
}
.text{
	margin-top: 6px;
	color: #666666;
	font-size: 14px;
}
.love-mode{
	display: flex;
	justify-content: space-between;
	position: relative;
	top:80px;
	padding: 20px;
	background-color: #fff;
	border-radius: 6px;
	
}

.love-music{
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
.love-image{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 60px;
	height: 60px;
	background-color: #bcbcbc;
	border-radius: 6px;
}
.controller-love{
	color: #fff;
	
}
.love-text{
	margin-left: 6px;
	display: flex;
	flex-direction: column;
}
.count{
	margin-top: 4px;
	color: #B5B5B5;
	font-size: 12px;
}
.rec{
	position: relative;
	top:95px;
	font-size: 12px;
}
.rec-sheet{
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
}
.rec-sheet-item{
	position: relative;
	margin-top: 20px;
	width: 30%;
	height: auto;
	background-color: #fff;
	border-radius: 6px;
}
.sheet-image{
	width: 100%;
	height: 100px;
}
.mask{
	flex-direction: row;
	width: 100%;
	background-color: rgba(0,0,0,.2);
	border-radius: 6px;
	
}
.musicplayCircle{
	font-size: 16px;
}
.rec-name{
	display: block;
	padding: 10px;
	
	white-space: nowrap;
	text-overflow: ellipsis;
	
	overflow: hidden;
}
</style>
