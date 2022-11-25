<template>
	<view class="care">
		<view class="nav">
			<top-bar>
				<view slot="center"></view>
			</top-bar>
		</view>
		<scroll-view scroll-y="true" :style="scrollHeight" class="scroll-v">
			<view class="tip" v-if="isShowTip">您未登录，当前页面的数据为静态数据</view>
			<view class="content-item" v-for="(item,index) in careData" :key="index">
				<view class="user">
					<image :src="item.user.avatarUrl" class="avatar"></image>
				</view>
				<view class="content">
					<view class="top">
						<view class="name-time">
							<view class="name-vip">
								<text class="nick-name">{{item.user.nickname}}</text>
								<text v-if="item.user.vipRights" class="vip">VIP.{{$level(item.user.vipRights.redVipLevel)}}</text>
								<text>{{shareTitle(item.info.commentThread.resourceTitle)}}</text>
							</view>
							<text class="time">{{$timeFormate('YYYY年MM月DD日',item.eventTime)}}</text>
						</view>
					</view>
					<view class="center" v-html="content(JSON.parse(item.json))">
						{{content(JSON.parse(item.json))}}
					</view>
					<view class="bottom">
						<view class="count-box share">
							<text class="iconfont musicshare"></text>
							<text v-if="item.info.likedCount" class="count">{{item.info.shareCount}}</text>
						</view>
						<view class="count-box comment">
							<text class="iconfont controller-comments"></text>
							<text v-if="item.info.likedCount" class="count">{{item.info.commentCount}}</text>
						</view>
						<view class="count-box liked">
							<text class="iconfont controller-good"></text>
							<text v-if="item.info.likedCount" class="count">{{item.info.likedCount}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bottom-control"  v-show="isShowBottomControl">
			<music-controller FMPath="../indexMenu/FM/FM" songDetailPath="../songDetail/songDetail"></music-controller>
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
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	import { event } from '@/common/api.js'
	import care  from '@/static/json/care.json'
	import '@/common/iconfont.css'
	import '@/common/controller.css'
	
	export default {
		mixins:[bottomControlMixin],
		data() {
			return {
				careData:[],
				more:false,
				lastTime:undefined,
				isShowTip:false
			}
		},
	
		methods: {
			content(content){
				//使用html原生标签，uniapp和小程序会将其编译成rich-text富文本，对下面带有标签的字符串进行转换
				return `
				<span class="msg">${content.msg}</span>
				<div class="song" style="position:relative; display:flex; justify-content:flex-start; align-items:center; margin:10px auto; padding:4px; background-color:#eaeaea;border-radius:6px;">
					<img class="song-image" style="margin-right:4px; width:40px; height:40px; border-radius:6px;" src="${content.song.album.picUrl}">
					<div class="info">
						<span class="song-name" style="display:block;">${content.song.name}</span>
						<span class="song-art" style="display:block; color:#bababa; font-size:12px;">${this.$dealAuthor(content.song.artists,'name')}</span>
					</div>
					<div class="mask" style="display:flex; justify-content:center; align-items:center; position: absolute;width: 40px;height: 40px;left: 4px;top:4px; z-index:999;background-color:rgba(0,0,0,.1);">
						<span class="iconfont musicplayCircleOne" style=" width:16px; height:16px; color:#fff;"></span>
					</div>
				</div>
				`
			},
			shareTitle(title){
				return title.substr(0,title.indexOf('：')+1)
			},
			getEvent(){
				event().then(res=>{
					console.log(res)
					this.careData = res.event
					this.more = res.more
					this.lastTime = res.lasttime
					this.isShowTip = false
				})
			},
			check(){
				if(this.$checkLogin()){
					this.getEvent()
				}
				else{
					this.careData = care.event
					this.more = care.more
					this.lastTime = care.lasttime
					this.isShowTip = true
				}
			}
		},
		created() {
			//this.getEvent()
			this.check()
		},
		activated() {
			this.check()
		}
	}
</script>

<style scoped lang="scss">
	.tip{
		text-align: center;
		font-size: 12px;
		color: #b1b1b1;
	}
	.content-item{
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 10px ;
	}
	.user{
		position: relative;
		margin-top: 4px;
		width: 10%;
		height: 100%;
		text-align: center;
	}
	.content{
		margin: 10px auto;
		width: 88%;
	}
	.top{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.center{
		font-size: 14px;
	}
	.bottom{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding-top: 10px;
		padding-bottom: 10px;
		font-size: 12px;
		border-bottom: 1px solid #eae9ef;
	}
	.count-box{
		margin-right: 60px;
	}
	.name-vip{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.vip{
		margin-left: 4px;
		padding: 0 6px;
		font-size: 12px;
		color: #fff;
		border-radius: 4px;
		background: linear-gradient(to right, #ff3e4b , #786eff ,#61ddff,#ff6fff);
	}
	.nick-name,.time{
		padding: 2px 0;
		display: block;
		text-align: left;
	}
	.nick-name{
		font-size: 14px;
	}
	.time,.count{
		font-size: 12px;
		color: #C8C7CC;
	}
	.iconfont{
		font-size: 12px;
	}
	.count{
		margin-right: 2px;
	}
// #ifdef H5
.nav{
	height: 50px;
}
// #endif
// #ifdef MP-WEIXIN
.nav{
	height: 80px;
}
// #endif
</style>
